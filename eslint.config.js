// @ts-ignore
import babelParser from "@babel/eslint-parser"
// @ts-ignore
import globals from "globals"

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
            },
            globals: {
                ...globals.browser,
                chrome: "readonly",
                ace: "readonly",
                process: "readonly"
            }
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
            "no-invalid-regexp": "error",
            "no-irregular-whitespace": "error",
            "no-loss-of-precision": "error",
            "no-misleading-character-class": "error",
            "no-promise-executor-return": "error",
            "no-prototype-builtins": "error",
            "no-self-assign": "error",
            "no-self-compare": "error",
            "no-setter-return": "error",
            "no-sparse-arrays": "error",
            "no-template-curly-in-string": "error",
            "no-this-before-super": "error",
            "no-undef": "error",
            "no-unmodified-loop-condition": "error",
            "no-unreachable": "error",
            "no-unused-private-class-members": "error",
            "no-useless-assignment": "error",
            "no-useless-backreference": "error",
            "require-atomic-updates": "error",
            "use-isnan": "error",
            "block-scoped-var": "error",
            "camelcase": "error",
            "curly": ["error", "multi-line"],
            "default-param-last": "error",
            "guard-for-in": "error",
            "new-cap": "error",
            "no-alert": "error",
            "no-array-constructor": "error",
            "no-console": "error",
            "no-delete-var": "error",
            "no-else-return": "error",
            "no-empty": ["error", { "allowEmptyCatch": true }],
            "no-empty-function": "error",
            "no-empty-static-block": "error",
            "no-eval": "error",
            "no-extend-native": "error",
            "no-extra-bind": "error",
            "no-extra-boolean-cast": "error",
            "no-extra-label": "error",
            "no-global-assign": "error",
            "no-implicit-coercion": ["error", { "string": false }],    
            "no-implicit-globals": "error",    
            "no-implied-eval": "error",    
            "no-invalid-this": "error",    
            "no-label-var": "error",    
            "no-loop-func": "error",    
            "no-multi-assign": "error",    
            "no-new-func": "error",    
            "no-object-constructor": "error",    
            "no-param-reassign": "error",    
            "no-redeclare": "error",
            "no-restricted-syntax": [
                "error",
                {
                "selector": "Literal[regex]",
                "message": "Regex is the root of all evil!"
                },
                {
                "selector": "NewExpression[callee.name='RegExp']",
                "message": "Regex is the root of all evil!"
                }
            ],
            "no-return-assign": "error", 
            "no-script-url": "error", 
            "no-sequences": "error", 
            "no-throw-literal": "error", 
            "no-unneeded-ternary": "error", 
            "no-unused-labels": "error", 
            "no-useless-call": "error", 
            "no-useless-catch": "error", 
            "no-useless-escape": "error", 
            "no-useless-rename": "error", 
            "no-useless-return": "error", 
            "no-var": "error", 
            "no-void": "error", 
            "no-with": "error", 
            "prefer-object-has-own": "error", 
            "prefer-spread": "error", 
        },
    }
]