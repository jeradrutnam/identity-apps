module.exports = {
    parser: "@typescript-eslint/parser",
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
    ],
    parserOptions: {
        ecmaVersion: 9,
        sourceType: "module",
    },
    settings: {
        react: {
            version: "detect"
        },
    },
    rules: {
        "eol-last": "error",
        "quotes": ["warn", "double"],
        "max-len": ["warn", { "code": 120 }],
        "react/jsx-curly-spacing": [2, "always", {
            "allowMultiline": true,
            "spacing": {"objectLiterals": "always"}
        }]
    },
    overrides: [
        {
            files: ["**/*.tsx"],
            rules: {
                "react/prop-types": "off"
            }
        },
        {
            files: ["./**/*/build.js", "./**/*/theme.js", "./**/*/index.js"],
            rules: {
                "@typescript-eslint/no-var-requires": "off",
                "@typescript-eslint/explicit-function-return-type": "off"
            }
        }
    ]
};
