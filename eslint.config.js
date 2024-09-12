// @ts-ignore
import babelParser from "@babel/eslint-parser"
// @ts-ignore
import globals from "globals"
// @ts-ignore
import stylisticJs from '@stylistic/eslint-plugin-js'

export default [
    {
        files: [
            "**/*.js",
        ],
        ignores: [
            "playwright-report/**",
            "src/vendor/**",
            "dist/cleaner-twitter/vendor/**",
        ],
        languageOptions: {
            parser: babelParser,
            parserOptions: {
                requireConfigFile: false,
                babelOptions: {
                  babelrc: false,
                  configFile: false,
                  presets: ["@babel/preset-env"],
                  plugins: ["@babel/plugin-syntax-import-attributes"],
                },
            },
            globals: {
                ...globals.browser,
                chrome: "readonly",
                ace: "readonly",
                process: "readonly",
            },
        },
        plugins: {
            '@stylistic/js': stylisticJs,
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
            "no-promise-executor-return": "warn",
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
                "message": "Regex is the root of all evil!",
                },
                {
                "selector": "NewExpression[callee.name='RegExp']",
                "message": "Regex is the root of all evil!",
                },
            ],
            // "no-return-assign": "error",
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
            "@stylistic/js/array-bracket-spacing": ["error", "never"],
            "@stylistic/js/array-element-newline": ["error", "consistent"],
            "@stylistic/js/arrow-parens": ["error", "as-needed"],
            "@stylistic/js/arrow-spacing": ["error", { "before": true, "after": true }],
            "@stylistic/js/block-spacing": ["error", "always"],
            "@stylistic/js/brace-style": "error",
            "@stylistic/js/comma-dangle": ["error", {
                "arrays": "only-multiline",
                "objects": "only-multiline",
                "imports": "never",
                "exports": "never",
                "functions": "never",
            }],
            "@stylistic/js/comma-spacing": "error",
            "@stylistic/js/computed-property-spacing": "error",
            "@stylistic/js/function-call-argument-newline": ["error", "consistent"],
            "@stylistic/js/function-call-spacing": "error",
            "@stylistic/js/key-spacing": "error",
            "@stylistic/js/keyword-spacing": "error",
            "@stylistic/js/no-extra-semi": "error",
            "@stylistic/js/no-multi-spaces": "error",
            "@stylistic/js/no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 0, "maxBOF": 0 }],
            "@stylistic/js/no-trailing-spaces": "error",
            "@stylistic/js/no-whitespace-before-property": "error",
            "@stylistic/js/object-curly-newline": ["error", { "consistent": true }],
            "@stylistic/js/object-curly-spacing": ["error", "always"],
            "@stylistic/js/padded-blocks": ["error", "never"],
            "@stylistic/js/quote-props": ["error", "consistent"],
            "@stylistic/js/rest-spread-spacing": "error",
            "@stylistic/js/semi": ["error", "never"],
            "@stylistic/js/space-before-blocks": "error",
            "@stylistic/js/space-before-function-paren": ["error", {
                "anonymous": "never",
                "named": "never",
                "asyncArrow": "always"
            }],
            "@stylistic/js/space-in-parens": "error",
            "@stylistic/js/space-infix-ops": "error",
            "@stylistic/js/space-unary-ops": ["error", { "words": true, "nonwords": false }],
            "@stylistic/js/switch-colon-spacing": "error",
            "@stylistic/js/template-curly-spacing": "error",
            "@stylistic/js/template-tag-spacing": "error",
        },
    },
]