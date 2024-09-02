import babelParser from "@babel/eslint-parser";

export default [
    {
        files: [
            "**/*.js"
        ],
        ignores: [
            "playwright-report/**", 
        ],
        languageOptions: {
            parser: babelParser,
            parserOptions: {
                requireConfigFile: false,
                babelOptions: {
                  babelrc: false,
                  configFile: false,
                  presets: ["@babel/preset-env"],
                  plugins: ["@babel/plugin-syntax-import-attributes"]
                }
            }
        },
        rules: {
            "prefer-const": "error"
        },
    }
]