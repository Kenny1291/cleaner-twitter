// @ts-ignore
import babelParser from "@babel/eslint-parser";

export default [
    {
        files: [
            "**/*.js"
        ],
        ignores: [
            "playwright-report/**", 
            "src/vendor/**",
            "dist/cleaner-twitter/vendor/**"
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
        linterOptions: {
            noInlineConfig: true
        },
        rules: {
            "prefer-const": "error",
            "eqeqeq": ["error", "always"],
            "func-style": ["error", "declaration"],
            "no-class-assign": "error",
            "no-compare-neg-zero": "error",
            "no-cond-assign": ["error", "except-parens"],
            "no-constant-binary-expression": "error",
            "no-constant-condition": ["error", { "checkLoops": "all" }],
            "no-constructor-return": "error",
            "no-debugger": "error",
            "no-dupe-args": "error",
            "no-dupe-class-members": "error",
            "no-dupe-else-if": "error",
            "no-dupe-keys": "error",
            "no-duplicate-case": "error",
            "no-duplicate-imports": "error",
            "no-empty-pattern": ["error", { "allowObjectPatternsAsParameters": true }],
            "no-ex-assign": "error",
            "no-func-assign": "error",
            "no-import-assign": "error",
            "no-inner-declarations": "error",
        },
    }
]