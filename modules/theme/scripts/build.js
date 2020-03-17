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
const rimraf = require("rimraf");
const CleanCSS = require("clean-css");
const distDir = path.join(__dirname, "..", "dist");
const themesDir = path.join(__dirname, "..", "src", "themes");
const lessNpmModuleDir = path.dirname(require.resolve("less"));
const semanticUICSSModuleDir = path.join(lessNpmModuleDir, "..", "semantic-ui-css");

const writeFile = (theme, file, content) => {
    if (!fs.existsSync(path.join(distDir, "lib"))) {
        fs.mkdirSync(path.join(distDir, "lib"));
    }

    if (!fs.existsSync(path.join(distDir, "lib", "themes"))) {
        fs.mkdirSync(path.join(distDir, "lib", "themes"));
    }

    if (!fs.existsSync(path.join(distDir, "lib", "themes", theme))) {
        fs.mkdirSync(path.join(distDir, "lib", "themes", theme));
    }

    fs.writeFileSync(path.join(distDir, "lib", "themes", theme, "theme" + file), content, (error) => {
        console.error(theme + "/" + "theme" + file + " generation failed.");
        console.error(error);
    });

    console.log(theme + "/" + "theme" + file + " generated.");
};

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

const copyAssets = (theme, filePath) => {
    try {
        fs.copySync(path.join(filePath, "assets"), path.join(distDir, "lib", "themes", theme, "assets"));
        console.log(theme + "/assets copied.");
        copySemanticUIJSFiles(theme);
    } catch (error) {
        console.error(error);
    }
};

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

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
    generateThemes();
} else {
    rimraf(distDir + "/*", () => {
        generateThemes();
    });
}
