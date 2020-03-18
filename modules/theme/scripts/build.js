/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */

require("@babel/register");

const { Theme } = require("../src/theme");
const path = require("path");
const fs = require("fs-extra");
const CleanCSS = require("clean-css");
const replace = require("replace");

const distDir = path.join(__dirname, "..", "dist");
const themesDir = path.join(__dirname, "..", "src", "themes");
const semanticUICorePath = path.join("src", "semantic-ui-core");
const semanticUICoreDefinitions = path.join(semanticUICorePath, "definitions");

const lessNpmModuleDir = path.dirname(require.resolve("less"));
const semanticUICSSModuleDir = path.join(lessNpmModuleDir, "..", "semantic-ui-css");
const semanticUILessModuleDir = path.join(lessNpmModuleDir, "..", "semantic-ui-less");

/*
 * Export compiled theme string to files
 *
 * @param {theme} Theme name
 * @param {file} Copiled CSS File type
 * @param {content} Compiled css string
 */
const writeFile = (theme, file, content) => {
    fs.ensureDirSync(path.join(distDir, "lib", "themes", theme));

    fs.writeFileSync(path.join(distDir, "lib", "themes", theme, "theme" + file), content, (error) => {
        console.error(theme + "/" + "theme" + file + " generation failed.");
        console.error(error);
    });

    console.log(theme + "/" + "theme" + file + " generated.");
};

/*
 * Copy semantic.js files to each theme to make them self contained
 *
 * @param {theme} Theme name
 */
const copySemanticUIJSFiles = (theme) => {
    ["semantic.js", "semantic.min.js"].map((fileName) => {
        try {
            fs.copySync(
                path.join(semanticUICSSModuleDir, fileName),
                path.join(distDir, "lib", "themes", theme, fileName));
            console.log(theme + "/" + fileName + " file copied.");
        } catch (error) {
            console.error(error);
        }
    });
};

/*
 * Copy theme assets to each theme to make them self contained
 *
 * @param {theme} Theme name
 * @param {filePath} Theme assets path
 */
const copyAssets = (theme, filePath) => {
    try {
        fs.copySync(path.join(filePath, "assets"), path.join(distDir, "lib", "themes", theme, "assets"));
        console.log(theme + "/assets copied.");
        copySemanticUIJSFiles(theme);
    } catch (error) {
        console.error(error);
    }
};

/*
 * Less compile themes method. Which will read the themes folder and compile all the themes
 */
const generateThemes = () => {
    const themes = fs.readdirSync(themesDir);

    const fileWritePromises = themes.map((theme) => {
        const filePath = path.join(themesDir, theme);
        const themeIndexFile = path.join(filePath, "index.less");

        if (!fs.existsSync(themeIndexFile)) {
            return;
        }

        if (theme === "sample") {
            return;
        }

        return Theme.compile(themeIndexFile, {}).then((output) => {
            const minifiedOutput = new CleanCSS().minify(output.css);
            const files = {
                ".css": output.css,
                ".css.map": output.map,
                ".min.css": minifiedOutput.styles
            };

            Object.keys(files).map((key) => writeFile(theme, key, files[key], themeIndexFile));
            copyAssets(theme, filePath);
        }, (error) => {
            console.error(error);
        });
    });

    Promise.all(fileWritePromises).then(() => {
        console.log("Task Done.");
    }).catch((error) => {
        console.error(error);
    });
};

/*
 * Create theme module dependency semantic-ui-core folder 
 */
const createSemanticUICore = () => {
    try {

        /*
         * Copy theme definition .less file from semantic ui less module to src/semantic-ui-core folder
         */
        fs.ensureDirSync(semanticUICoreDefinitions);
        fs.copySync(
            path.join(semanticUILessModuleDir, "definitions"),
            semanticUICoreDefinitions,
            {
                filter: (src) => {
                    // @return true if 'src' is a folder
                    if (fs.lstatSync(src).isDirectory()) {
                       return true;
                    }
                    
                    // @return true if 'src' is a file & type .less
                    const result = /\.less$/.test(src);
                    return result;
               }
            });

        console.log("node_modules/semantic-ui-less/definitions .less files copied.");
        
        /*
         * Remove empty definition folders from the copied
         */
        const folders = fs.readdirSync(semanticUICoreDefinitions);

        folders.map((folder) => {
            const folderPath = path.join(semanticUICoreDefinitions, folder);
            if (fs.readdirSync(folderPath).length === 0) {
                fs.removeSync(folderPath);
            }
        });

        console.log("node_modules/semantic-ui-less/definitions folder cleansed.");
        
        /*
         * Copy default theme .variable & .override files from semantic ui less module to src/semantic-ui-core folder
         */
        fs.copySync(path.join(semanticUILessModuleDir, "themes", "default"),
            path.join(semanticUICorePath, "default"));

        console.log("node_modules/semantic-ui-less/themes/default copied.");

        /*
         * Update copied definition .less files theme import logic support
         */
        replace({
            regex: /@import \(multiple\) '\.\.\/\.\.\/theme\.config';/gi,
            replacement: "@import (multiple) '../../theme.less';\n.loadVariables();",
            paths: [ semanticUICoreDefinitions ],
            recursive: true,
            silent: true,
        });

        console.log("semantic-ui-less/definitions changes updated.");

        generateThemes();

    } catch (error) {
        console.error(error);
    }
};

// Start the build with creating the src/semantic-ui-core folder dynamically
createSemanticUICore();
