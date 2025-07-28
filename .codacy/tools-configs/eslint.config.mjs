export default [
  {
    "settings": {
      "react": {
        "version": "999.999.999"
      },
      "import/extensions": [
        ".ts",
        ".cts",
        ".mts",
        ".tsx",
        ".js",
        ".jsx",
        ".mjs",
        ".cjs"
      ],
      "import/external-module-folders": [
        "node_modules",
        "node_modules/@types"
      ],
      "import/parsers": {
        "@typescript-eslint/parser": [
          ".ts",
          ".cts",
          ".mts",
          ".tsx"
        ]
      },
      "import/resolver": {
        "node": {
          "extensions": [
            ".ts",
            ".cts",
            ".mts",
            ".tsx",
            ".js",
            ".jsx",
            ".mjs",
            ".cjs"
          ]
        },
        "typescript": {
          "alwaysTryTypes": true,
          "project": "./tsconfig.eslint.json"
        }
      }
    },
    "linterOptions": {
      "reportUnusedDisableDirectives": 1
    },
    "rules": {
      "accessor-pairs": [
        2,
        {
          "enforceForClassMembers": true,
          "getWithoutSet": false,
          "setWithoutGet": true
        }
      ],
      "array-callback-return": [
        2,
        {
          "allowImplicit": false,
          "checkForEach": false,
          "allowVoid": false
        }
      ],
      "arrow-body-style": [
        0,
        "as-needed"
      ],
      "block-scoped-var": [
        2
      ],
      "camelcase": [
        2,
        {
          "allow": [],
          "ignoreDestructuring": false,
          "ignoreGlobals": false,
          "ignoreImports": false,
          "properties": "always"
        }
      ],
      "capitalized-comments": [
        2,
        "always",
        {
          "ignoreConsecutiveComments": true
        }
      ],
      "class-methods-use-this": [
        2,
        {
          "enforceForClassFields": true,
          "exceptMethods": [],
          "ignoreOverrideMethods": false
        }
      ],
      "complexity": [
        0,
        20
      ],
      "consistent-return": [
        2,
        {
          "treatUndefinedAsUnspecified": false
        }
      ],
      "consistent-this": [
        2,
        "that"
      ],
      "constructor-super": [
        0
      ],
      "curly": [
        0,
        "all"
      ],
      "default-case": [
        2,
        {}
      ],
      "default-case-last": [
        2
      ],
      "default-param-last": [
        2
      ],
      "dot-notation": [
        2,
        {
          "allowKeywords": true,
          "allowPattern": ""
        }
      ],
      "eqeqeq": [
        2,
        "always",
        {
          "null": "ignore"
        }
      ],
      "for-direction": [
        2
      ],
      "func-name-matching": [
        2
      ],
      "func-names": [
        2,
        "always",
        {}
      ],
      "func-style": [
        2,
        "expression",
        {
          "allowArrowFunctions": false,
          "allowTypeAnnotation": false,
          "overrides": {}
        }
      ],
      "getter-return": [
        0,
        {
          "allowImplicit": false
        }
      ],
      "grouped-accessor-pairs": [
        2,
        "anyOrder"
      ],
      "guard-for-in": [
        2
      ],
      "id-denylist": [
        2
      ],
      "id-length": [
        2,
        {
          "exceptionPatterns": [],
          "exceptions": [
            "a",
            "b",
            "i",
            "j",
            "t"
          ],
          "min": 2,
          "properties": "always"
        }
      ],
      "id-match": [
        2,
        "^.+$",
        {
          "classFields": false,
          "ignoreDestructuring": false,
          "onlyDeclarations": false,
          "properties": false
        }
      ],
      "init-declarations": [
        0
      ],
      "logical-assignment-operators": [
        0
      ],
      "max-classes-per-file": [
        2
      ],
      "max-depth": [
        0
      ],
      "max-lines": [
        0
      ],
      "max-lines-per-function": [
        0
      ],
      "max-nested-callbacks": [
        2
      ],
      "max-params": [
        0
      ],
      "max-statements": [
        0
      ],
      "new-cap": [
        2,
        {
          "capIsNew": true,
          "capIsNewExceptions": [
            "Array",
            "Boolean",
            "Date",
            "Error",
            "Function",
            "Number",
            "Object",
            "RegExp",
            "String",
            "Symbol",
            "BigInt"
          ],
          "newIsCap": true,
          "newIsCapExceptions": [],
          "properties": true
        }
      ],
      "no-alert": [
        2
      ],
      "no-array-constructor": [
        0
      ],
      "no-async-promise-executor": [
        2
      ],
      "no-await-in-loop": [
        2
      ],
      "no-bitwise": [
        2,
        {
          "allow": [],
          "int32Hint": false
        }
      ],
      "no-caller": [
        2
      ],
      "no-case-declarations": [
        2
      ],
      "no-class-assign": [
        0
      ],
      "no-compare-neg-zero": [
        2
      ],
      "no-cond-assign": [
        2,
        "except-parens"
      ],
      "no-console": [
        2,
        {}
      ],
      "no-const-assign": [
        0
      ],
      "no-constant-binary-expression": [
        2
      ],
      "no-constant-condition": [
        2,
        {
          "checkLoops": "allExceptWhileTrue"
        }
      ],
      "no-constructor-return": [
        2
      ],
      "no-continue": [
        0
      ],
      "no-control-regex": [
        2
      ],
      "no-debugger": [
        2
      ],
      "no-delete-var": [
        2
      ],
      "no-div-regex": [
        2
      ],
      "no-dupe-args": [
        0
      ],
      "no-dupe-class-members": [
        0
      ],
      "no-dupe-else-if": [
        2
      ],
      "no-dupe-keys": [
        0
      ],
      "no-duplicate-case": [
        2
      ],
      "no-duplicate-imports": [
        2,
        {
          "includeExports": false,
          "allowSeparateTypeImports": false
        }
      ],
      "no-else-return": [
        2,
        {
          "allowElseIf": true
        }
      ],
      "no-empty": [
        2,
        {
          "allowEmptyCatch": false
        }
      ],
      "no-empty-character-class": [
        2
      ],
      "no-empty-function": [
        2,
        {
          "allow": [
            "arrowFunctions",
            "methods"
          ]
        }
      ],
      "no-empty-pattern": [
        2,
        {
          "allowObjectPatternsAsParameters": false
        }
      ],
      "no-empty-static-block": [
        2
      ],
      "no-eq-null": [
        2
      ],
      "no-eval": [
        2,
        {
          "allowIndirect": false
        }
      ],
      "no-ex-assign": [
        2
      ],
      "no-extend-native": [
        2,
        {
          "exceptions": []
        }
      ],
      "no-extra-bind": [
        2
      ],
      "no-extra-boolean-cast": [
        2,
        {}
      ],
      "no-extra-label": [
        2
      ],
      "no-fallthrough": [
        2,
        {
          "allowEmptyCase": false,
          "reportUnusedFallthroughComment": false
        }
      ],
      "no-func-assign": [
        0
      ],
      "no-global-assign": [
        2,
        {
          "exceptions": []
        }
      ],
      "no-implicit-coercion": [
        2,
        {
          "allow": [],
          "boolean": true,
          "disallowTemplateShorthand": false,
          "number": true,
          "string": true
        }
      ],
      "no-implicit-globals": [
        2,
        {
          "lexicalBindings": false
        }
      ],
      "no-implied-eval": [
        0
      ],
      "no-import-assign": [
        0
      ],
      "no-inline-comments": [
        0,
        {}
      ],
      "no-inner-declarations": [
        2,
        "functions",
        {
          "blockScopedFunctions": "allow"
        }
      ],
      "no-invalid-regexp": [
        2,
        {}
      ],
      "no-invalid-this": [
        2,
        {
          "capIsConstructor": true
        }
      ],
      "no-irregular-whitespace": [
        2,
        {
          "skipComments": false,
          "skipJSXText": false,
          "skipRegExps": false,
          "skipStrings": true,
          "skipTemplates": false
        }
      ],
      "no-iterator": [
        2
      ],
      "no-label-var": [
        2
      ],
      "no-labels": [
        2,
        {
          "allowLoop": false,
          "allowSwitch": false
        }
      ],
      "no-lone-blocks": [
        2
      ],
      "no-lonely-if": [
        2
      ],
      "no-loop-func": [
        2
      ],
      "no-loss-of-precision": [
        2
      ],
      "no-magic-numbers": [
        2,
        {
          "ignoreNumericLiteralTypes": true,
          "ignoreEnums": true,
          "ignoreArrayIndexes": true,
          "ignore": [
            -1,
            0,
            1,
            2
          ],
          "detectObjects": false,
          "enforceConst": false,
          "ignoreDefaultValues": false,
          "ignoreClassFieldInitialValues": false,
          "ignoreReadonlyClassProperties": false,
          "ignoreTypeIndexes": false
        }
      ],
      "no-misleading-character-class": [
        2
      ],
      "no-multi-assign": [
        2,
        {
          "ignoreNonDeclaration": false
        }
      ],
      "no-multi-str": [
        2
      ],
      "no-negated-condition": [
        0
      ],
      "no-nested-ternary": [
        0
      ],
      "no-new": [
        2
      ],
      "no-new-func": [
        2
      ],
      "no-new-native-nonconstructor": [
        0
      ],
      "no-new-wrappers": [
        2
      ],
      "no-nonoctal-decimal-escape": [
        2
      ],
      "no-obj-calls": [
        0
      ],
      "no-object-constructor": [
        2
      ],
      "no-octal": [
        2
      ],
      "no-octal-escape": [
        2
      ],
      "no-param-reassign": [
        2
      ],
      "no-plusplus": [
        2,
        {
          "allowForLoopAfterthoughts": true
        }
      ],
      "no-promise-executor-return": [
        2,
        {
          "allowVoid": false
        }
      ],
      "no-proto": [
        2
      ],
      "no-prototype-builtins": [
        2
      ],
      "no-redeclare": [
        0,
        {
          "builtinGlobals": true
        }
      ],
      "no-regex-spaces": [
        2
      ],
      "no-restricted-exports": [
        2
      ],
      "no-restricted-globals": [
        2,
        {
          "name": "addEventListener",
          "message": "Use window.addEventListener instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "blur",
          "message": "Use window.blur instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "close",
          "message": "Use window.close instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "closed",
          "message": "Use window.closed instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "confirm",
          "message": "Use window.confirm instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "defaultStatus",
          "message": "Use window.defaultStatus instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "defaultstatus",
          "message": "Use window.defaultstatus instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "event",
          "message": "Use window.event instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "external",
          "message": "Use window.external instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "find",
          "message": "Use window.find instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "focus",
          "message": "Use window.focus instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "frameElement",
          "message": "Use window.frameElement instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "frames",
          "message": "Use window.frames instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "history",
          "message": "Use window.history instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "innerHeight",
          "message": "Use window.innerHeight instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "innerWidth",
          "message": "Use window.innerWidth instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "length",
          "message": "Use window.length instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "location",
          "message": "Use window.location instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "locationbar",
          "message": "Use window.locationbar instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "menubar",
          "message": "Use window.menubar instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "moveBy",
          "message": "Use window.moveBy instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "moveTo",
          "message": "Use window.moveTo instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "name",
          "message": "Use window.name instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "onblur",
          "message": "Use window.onblur instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "onerror",
          "message": "Use window.onerror instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "onfocus",
          "message": "Use window.onfocus instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "onload",
          "message": "Use window.onload instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "onresize",
          "message": "Use window.onresize instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "onunload",
          "message": "Use window.onunload instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "open",
          "message": "Use window.open instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "opener",
          "message": "Use window.opener instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "opera",
          "message": "Use window.opera instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "outerHeight",
          "message": "Use window.outerHeight instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "outerWidth",
          "message": "Use window.outerWidth instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "pageXOffset",
          "message": "Use window.pageXOffset instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "pageYOffset",
          "message": "Use window.pageYOffset instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "parent",
          "message": "Use window.parent instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "print",
          "message": "Use window.print instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "removeEventListener",
          "message": "Use window.removeEventListener instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "resizeBy",
          "message": "Use window.resizeBy instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "resizeTo",
          "message": "Use window.resizeTo instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "screen",
          "message": "Use window.screen instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "screenLeft",
          "message": "Use window.screenLeft instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "screenTop",
          "message": "Use window.screenTop instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "screenX",
          "message": "Use window.screenX instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "screenY",
          "message": "Use window.screenY instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "scroll",
          "message": "Use window.scroll instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "scrollbars",
          "message": "Use window.scrollbars instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "scrollBy",
          "message": "Use window.scrollBy instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "scrollTo",
          "message": "Use window.scrollTo instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "scrollX",
          "message": "Use window.scrollX instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "scrollY",
          "message": "Use window.scrollY instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "self",
          "message": "Use window.self instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "status",
          "message": "Use window.status instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "statusbar",
          "message": "Use window.statusbar instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "stop",
          "message": "Use window.stop instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "toolbar",
          "message": "Use window.toolbar instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        },
        {
          "name": "top",
          "message": "Use window.top instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md"
        }
      ],
      "no-restricted-imports": [
        2
      ],
      "no-restricted-properties": [
        2
      ],
      "no-restricted-syntax": [
        2
      ],
      "no-return-assign": [
        2,
        "except-parens"
      ],
      "no-script-url": [
        2
      ],
      "no-self-assign": [
        2,
        {
          "props": true
        }
      ],
      "no-self-compare": [
        2
      ],
      "no-sequences": [
        2,
        {
          "allowInParentheses": true
        }
      ],
      "no-setter-return": [
        0
      ],
      "no-shadow": [
        2,
        {
          "allow": [],
          "builtinGlobals": false,
          "hoist": "functions",
          "ignoreOnInitialization": false,
          "ignoreTypeValueShadow": true,
          "ignoreFunctionTypeParameterNameValueShadow": true
        }
      ],
      "no-shadow-restricted-names": [
        2,
        {
          "reportGlobalThis": false
        }
      ],
      "no-sparse-arrays": [
        2
      ],
      "no-template-curly-in-string": [
        2
      ],
      "no-ternary": [
        0
      ],
      "no-this-before-super": [
        0
      ],
      "no-throw-literal": [
        0
      ],
      "no-unassigned-vars": [
        2
      ],
      "no-undef": [
        0,
        {
          "typeof": false
        }
      ],
      "no-undef-init": [
        2
      ],
      "no-undefined": [
        2
      ],
      "no-underscore-dangle": [
        2,
        {
          "allow": [],
          "allowAfterSuper": false,
          "allowAfterThis": false,
          "allowAfterThisConstructor": false,
          "allowFunctionParams": true,
          "allowInArrayDestructuring": true,
          "allowInObjectDestructuring": true,
          "enforceInClassFields": false,
          "enforceInMethodNames": false
        }
      ],
      "no-unexpected-multiline": [
        0
      ],
      "no-unmodified-loop-condition": [
        2
      ],
      "no-unneeded-ternary": [
        2,
        {
          "defaultAssignment": true
        }
      ],
      "no-unreachable": [
        0
      ],
      "no-unreachable-loop": [
        2,
        {
          "ignore": []
        }
      ],
      "no-unsafe-finally": [
        2
      ],
      "no-unsafe-negation": [
        0,
        {
          "enforceForOrderingRelations": false
        }
      ],
      "no-unsafe-optional-chaining": [
        2,
        {
          "disallowArithmeticOperators": false
        }
      ],
      "no-unused-expressions": [
        0,
        {
          "allowShortCircuit": false,
          "allowTernary": false,
          "allowTaggedTemplates": false,
          "enforceForJSX": false,
          "ignoreDirectives": false
        }
      ],
      "no-unused-labels": [
        2
      ],
      "no-unused-private-class-members": [
        2
      ],
      "no-unused-vars": [
        0
      ],
      "no-use-before-define": [
        2,
        {
          "classes": true,
          "functions": true,
          "variables": true,
          "allowNamedExports": false,
          "enums": true,
          "typedefs": true,
          "ignoreTypeReferences": true
        }
      ],
      "no-useless-assignment": [
        2
      ],
      "no-useless-backreference": [
        2
      ],
      "no-useless-call": [
        2
      ],
      "no-useless-catch": [
        2
      ],
      "no-useless-computed-key": [
        2,
        {
          "enforceForClassMembers": true
        }
      ],
      "no-useless-concat": [
        2
      ],
      "no-useless-constructor": [
        2
      ],
      "no-useless-escape": [
        2,
        {
          "allowRegexCharacters": []
        }
      ],
      "no-useless-rename": [
        2,
        {
          "ignoreDestructuring": false,
          "ignoreImport": false,
          "ignoreExport": false
        }
      ],
      "no-useless-return": [
        2
      ],
      "no-var": [
        2
      ],
      "no-void": [
        2,
        {
          "allowAsStatement": false
        }
      ],
      "no-warning-comments": [
        0,
        {
          "location": "start",
          "terms": [
            "todo",
            "fixme",
            "xxx"
          ]
        }
      ],
      "no-with": [
        0
      ],
      "object-shorthand": [
        2
      ],
      "one-var": [
        2,
        "never"
      ],
      "operator-assignment": [
        2,
        "always"
      ],
      "prefer-arrow-callback": [
        0,
        {
          "allowNamedFunctions": false,
          "allowUnboundThis": true
        }
      ],
      "prefer-const": [
        2,
        {
          "destructuring": "any",
          "ignoreReadBeforeAssign": false
        }
      ],
      "prefer-destructuring": [
        2
      ],
      "prefer-exponentiation-operator": [
        2
      ],
      "prefer-named-capture-group": [
        2
      ],
      "prefer-numeric-literals": [
        2
      ],
      "prefer-object-has-own": [
        2
      ],
      "prefer-object-spread": [
        2
      ],
      "prefer-promise-reject-errors": [
        0,
        {
          "allowEmptyReject": false
        }
      ],
      "prefer-regex-literals": [
        2,
        {
          "disallowRedundantWrapping": false
        }
      ],
      "prefer-rest-params": [
        2
      ],
      "prefer-spread": [
        2
      ],
      "prefer-template": [
        2
      ],
      "radix": [
        2,
        "always"
      ],
      "require-atomic-updates": [
        2,
        {
          "allowProperties": false
        }
      ],
      "require-await": [
        0
      ],
      "require-unicode-regexp": [
        2
      ],
      "require-yield": [
        2
      ],
      "sort-imports": [
        2,
        {
          "allowSeparatedGroups": true,
          "ignoreCase": false,
          "ignoreDeclarationSort": true,
          "ignoreMemberSort": false,
          "memberSyntaxSortOrder": [
            "none",
            "all",
            "multiple",
            "single"
          ]
        }
      ],
      "sort-keys": [
        0,
        "asc",
        {
          "allowLineSeparatedGroups": false,
          "caseSensitive": true,
          "ignoreComputedKeys": false,
          "minKeys": 2,
          "natural": false
        }
      ],
      "sort-vars": [
        2,
        {
          "ignoreCase": false
        }
      ],
      "strict": [
        2,
        "safe"
      ],
      "symbol-description": [
        2
      ],
      "unicode-bom": [
        2,
        "never"
      ],
      "use-isnan": [
        2,
        {
          "enforceForIndexOf": false,
          "enforceForSwitchCase": true
        }
      ],
      "valid-typeof": [
        2,
        {
          "requireStringLiterals": false
        }
      ],
      "vars-on-top": [
        2
      ],
      "yoda": [
        2,
        "never",
        {
          "exceptRange": false,
          "onlyEquality": false
        }
      ],
      "sonarjs/function-name": [
        0,
        {
          "format": "^[_a-z][a-zA-Z0-9]*$"
        }
      ],
      "sonarjs/class-name": [
        2,
        {
          "format": "^[A-Z][a-zA-Z0-9]*$"
        }
      ],
      "sonarjs/max-lines": [
        0,
        {
          "maximum": 1000
        }
      ],
      "sonarjs/no-tab": [
        0
      ],
      "sonarjs/variable-name": [
        0,
        {
          "format": "^[_$A-Za-z][$A-Za-z0-9]*$|^[_$A-Z][_$A-Z0-9]+$"
        }
      ],
      "sonarjs/comment-regex": [
        0,
        {
          "regularExpression": "",
          "message": "The regular expression matches this comment.",
          "flags": ""
        }
      ],
      "sonarjs/no-commented-code": [
        2
      ],
      "sonarjs/elseif-without-else": [
        0
      ],
      "sonarjs/no-fallthrough": [
        2
      ],
      "sonarjs/nested-control-flow": [
        0,
        {
          "maximumNestingLevel": 3
        }
      ],
      "sonarjs/too-many-break-or-continue-in-loop": [
        0
      ],
      "sonarjs/max-lines-per-function": [
        0,
        {
          "maximum": 200
        }
      ],
      "sonarjs/no-nested-incdec": [
        0
      ],
      "sonarjs/no-equals-in-for-termination": [
        2
      ],
      "sonarjs/no-extra-arguments": [
        2
      ],
      "sonarjs/no-collapsible-if": [
        2
      ],
      "sonarjs/expression-complexity": [
        0,
        {
          "max": 3
        }
      ],
      "sonarjs/no-redundant-parentheses": [
        0
      ],
      "sonarjs/no-labels": [
        2
      ],
      "sonarjs/no-nested-assignment": [
        2
      ],
      "sonarjs/no-redundant-boolean": [
        2
      ],
      "sonarjs/prefer-single-boolean-return": [
        2
      ],
      "sonarjs/unused-import": [
        2
      ],
      "sonarjs/fixme-tag": [
        2
      ],
      "sonarjs/todo-tag": [
        1
      ],
      "sonarjs/useless-string-operation": [
        0
      ],
      "sonarjs/no-unused-function-argument": [
        0
      ],
      "sonarjs/no-duplicate-string": [
        2,
        {
          "threshold": 3,
          "ignoreStrings": "application/json"
        }
      ],
      "sonarjs/no-case-label-in-switch": [
        2
      ],
      "sonarjs/no-parameter-reassignment": [
        2
      ],
      "sonarjs/prefer-while": [
        2
      ],
      "sonarjs/no-sonar-comments": [
        0
      ],
      "sonarjs/no-small-switch": [
        2
      ],
      "sonarjs/no-hardcoded-ip": [
        2
      ],
      "sonarjs/label-position": [
        2
      ],
      "sonarjs/public-static-readonly": [
        2
      ],
      "sonarjs/file-header": [
        0,
        {
          "headerFormat": "",
          "isRegularExpression": false
        }
      ],
      "sonarjs/call-argument-line": [
        2
      ],
      "sonarjs/max-switch-cases": [
        2,
        30
      ],
      "sonarjs/no-unused-vars": [
        2
      ],
      "sonarjs/prefer-immediate-return": [
        0
      ],
      "sonarjs/function-inside-loop": [
        2
      ],
      "sonarjs/code-eval": [
        2
      ],
      "sonarjs/no-variable-usage-before-declaration": [
        0
      ],
      "sonarjs/future-reserved-words": [
        2
      ],
      "sonarjs/array-constructor": [
        0
      ],
      "sonarjs/bitwise-operators": [
        2
      ],
      "sonarjs/no-function-declaration-in-block": [
        0
      ],
      "sonarjs/no-primitive-wrappers": [
        2
      ],
      "sonarjs/for-in": [
        0
      ],
      "sonarjs/cyclomatic-complexity": [
        0,
        {
          "threshold": 10
        }
      ],
      "sonarjs/no-skipped-tests": [
        2
      ],
      "sonarjs/no-one-iteration-loop": [
        2
      ],
      "sonarjs/no-identical-expressions": [
        2
      ],
      "sonarjs/no-nested-switch": [
        0
      ],
      "sonarjs/constructor-for-side-effects": [
        2
      ],
      "sonarjs/no-dead-store": [
        2
      ],
      "sonarjs/no-identical-conditions": [
        2
      ],
      "sonarjs/no-duplicated-branches": [
        2
      ],
      "sonarjs/deprecation": [
        2
      ],
      "sonarjs/no-inverted-boolean-check": [
        2
      ],
      "sonarjs/misplaced-loop-counter": [
        2
      ],
      "sonarjs/no-nested-functions": [
        2,
        {
          "threshold": 4
        }
      ],
      "sonarjs/no-hardcoded-passwords": [
        2,
        {
          "passwordWords": [
            "password",
            "pwd",
            "passwd",
            "passphrase"
          ]
        }
      ],
      "sonarjs/sql-queries": [
        2
      ],
      "sonarjs/insecure-cookie": [
        2
      ],
      "sonarjs/no-useless-increment": [
        2
      ],
      "sonarjs/no-globals-shadowing": [
        2
      ],
      "sonarjs/no-undefined-assignment": [
        0
      ],
      "sonarjs/no-empty-test-file": [
        2
      ],
      "sonarjs/no-ignored-return": [
        2
      ],
      "sonarjs/no-wildcard-import": [
        0
      ],
      "sonarjs/arguments-order": [
        2
      ],
      "sonarjs/pseudo-random": [
        2
      ],
      "sonarjs/for-loop-increment-sign": [
        2
      ],
      "sonarjs/cookies": [
        0
      ],
      "sonarjs/null-dereference": [
        2
      ],
      "sonarjs/no-selector-parameter": [
        2
      ],
      "sonarjs/updated-loop-counter": [
        2
      ],
      "sonarjs/block-scoped-var": [
        2
      ],
      "sonarjs/no-built-in-override": [
        0
      ],
      "sonarjs/prefer-object-literal": [
        2
      ],
      "sonarjs/no-ignored-exceptions": [
        2
      ],
      "sonarjs/no-gratuitous-expressions": [
        2
      ],
      "sonarjs/file-uploads": [
        2
      ],
      "sonarjs/file-permissions": [
        2
      ],
      "sonarjs/no-empty-character-class": [
        2
      ],
      "sonarjs/no-unenclosed-multiline-block": [
        2
      ],
      "sonarjs/index-of-compare-to-positive-number": [
        2
      ],
      "sonarjs/assertions-in-tests": [
        2
      ],
      "sonarjs/no-implicit-global": [
        2
      ],
      "sonarjs/no-useless-catch": [
        2
      ],
      "sonarjs/xml-parser-xxe": [
        2
      ],
      "sonarjs/non-existent-operator": [
        2
      ],
      "sonarjs/web-sql-database": [
        0
      ],
      "sonarjs/post-message": [
        2
      ],
      "sonarjs/no-array-delete": [
        2
      ],
      "sonarjs/no-alphabetical-sort": [
        2
      ],
      "sonarjs/no-incomplete-assertions": [
        2
      ],
      "sonarjs/no-global-this": [
        2
      ],
      "sonarjs/new-operator-misuse": [
        2,
        {
          "considerJSDoc": false
        }
      ],
      "sonarjs/no-delete-var": [
        2
      ],
      "sonarjs/strings-comparison": [
        0
      ],
      "sonarjs/file-name-differ-from-class": [
        0
      ],
      "sonarjs/cookie-no-httponly": [
        2
      ],
      "sonarjs/no-nested-conditional": [
        2
      ],
      "sonarjs/no-incorrect-string-concat": [
        0
      ],
      "sonarjs/different-types-comparison": [
        2
      ],
      "sonarjs/inverted-assertion-arguments": [
        2
      ],
      "sonarjs/shorthand-property-grouping": [
        0
      ],
      "sonarjs/updated-const-var": [
        2
      ],
      "sonarjs/arguments-usage": [
        0
      ],
      "sonarjs/destructuring-assignment-syntax": [
        0
      ],
      "sonarjs/no-invariant-returns": [
        2
      ],
      "sonarjs/arrow-function-convention": [
        0,
        {
          "requireParameterParentheses": false,
          "requireBodyBraces": false
        }
      ],
      "sonarjs/class-prototype": [
        0
      ],
      "sonarjs/generator-without-yield": [
        2
      ],
      "sonarjs/no-require-or-define": [
        0
      ],
      "sonarjs/no-associative-arrays": [
        2
      ],
      "sonarjs/comma-or-logical-or-case": [
        2
      ],
      "sonarjs/no-redundant-jump": [
        2
      ],
      "sonarjs/inconsistent-function-call": [
        2
      ],
      "sonarjs/no-use-of-empty-return-value": [
        2
      ],
      "sonarjs/enforce-trailing-comma": [
        0,
        "always-multiline"
      ],
      "sonarjs/void-use": [
        2
      ],
      "sonarjs/operation-returning-nan": [
        0
      ],
      "sonarjs/values-not-convertible-to-numbers": [
        0
      ],
      "sonarjs/non-number-in-arithmetic-expression": [
        0
      ],
      "sonarjs/cognitive-complexity": [
        1,
        15
      ],
      "sonarjs/argument-type": [
        2
      ],
      "sonarjs/in-operator-type-error": [
        2
      ],
      "sonarjs/array-callback-without-return": [
        2
      ],
      "sonarjs/declarations-in-global-scope": [
        0
      ],
      "sonarjs/function-return-type": [
        2
      ],
      "sonarjs/no-inconsistent-returns": [
        0
      ],
      "sonarjs/no-reference-error": [
        0
      ],
      "sonarjs/super-invocation": [
        2
      ],
      "sonarjs/no-all-duplicated-branches": [
        2
      ],
      "sonarjs/no-same-line-conditional": [
        2
      ],
      "sonarjs/conditional-indentation": [
        0
      ],
      "sonarjs/no-collection-size-mischeck": [
        2
      ],
      "sonarjs/no-unthrown-error": [
        2
      ],
      "sonarjs/no-unused-collection": [
        2
      ],
      "sonarjs/no-os-command-from-path": [
        2
      ],
      "sonarjs/no-misleading-array-reverse": [
        2
      ],
      "sonarjs/no-for-in-iterable": [
        0
      ],
      "sonarjs/no-element-overwrite": [
        2
      ],
      "sonarjs/no-identical-functions": [
        2,
        3
      ],
      "sonarjs/no-empty-collection": [
        2
      ],
      "sonarjs/no-redundant-assignments": [
        2
      ],
      "sonarjs/prefer-type-guard": [
        2
      ],
      "sonarjs/use-type-alias": [
        2
      ],
      "sonarjs/no-return-type-any": [
        0
      ],
      "sonarjs/no-implicit-dependencies": [
        0,
        {
          "whitelist": []
        }
      ],
      "sonarjs/no-useless-intersection": [
        2
      ],
      "sonarjs/weak-ssl": [
        2
      ],
      "sonarjs/no-weak-keys": [
        2
      ],
      "sonarjs/csrf": [
        2
      ],
      "sonarjs/production-debug": [
        2
      ],
      "sonarjs/prefer-default-last": [
        2
      ],
      "sonarjs/no-in-misuse": [
        2
      ],
      "sonarjs/no-duplicate-in-composite": [
        2
      ],
      "sonarjs/max-union-size": [
        0,
        {
          "threshold": 3
        }
      ],
      "sonarjs/no-undefined-argument": [
        2
      ],
      "sonarjs/no-nested-template-literals": [
        2
      ],
      "sonarjs/prefer-promise-shorthand": [
        2
      ],
      "sonarjs/os-command": [
        2
      ],
      "sonarjs/no-redundant-optional": [
        2
      ],
      "sonarjs/regular-expr": [
        0
      ],
      "sonarjs/encryption": [
        0
      ],
      "sonarjs/hashing": [
        2
      ],
      "sonarjs/bool-param-default": [
        0
      ],
      "sonarjs/xpath": [
        0
      ],
      "sonarjs/sockets": [
        0
      ],
      "sonarjs/no-try-promise": [
        2
      ],
      "sonarjs/process-argv": [
        0
      ],
      "sonarjs/standard-input": [
        0
      ],
      "sonarjs/unverified-certificate": [
        2
      ],
      "sonarjs/no-unsafe-unzip": [
        2
      ],
      "sonarjs/cors": [
        2
      ],
      "sonarjs/link-with-target-blank": [
        2
      ],
      "sonarjs/disabled-auto-escaping": [
        2
      ],
      "sonarjs/table-header": [
        2
      ],
      "sonarjs/no-table-as-layout": [
        2
      ],
      "sonarjs/table-header-reference": [
        2
      ],
      "sonarjs/object-alt-content": [
        2
      ],
      "sonarjs/no-clear-text-protocols": [
        2
      ],
      "sonarjs/publicly-writable-directories": [
        2
      ],
      "sonarjs/unverified-hostname": [
        2
      ],
      "sonarjs/encryption-secure-mode": [
        2
      ],
      "sonarjs/no-weak-cipher": [
        2
      ],
      "sonarjs/no-intrusive-permissions": [
        2,
        {
          "permissions": [
            "geolocation"
          ]
        }
      ],
      "sonarjs/insecure-jwt-token": [
        2
      ],
      "sonarjs/x-powered-by": [
        2
      ],
      "sonarjs/hidden-files": [
        2
      ],
      "sonarjs/content-length": [
        2,
        {
          "fileUploadSizeLimit": 8000000,
          "standardSizeLimit": 2000000
        }
      ],
      "sonarjs/disabled-resource-integrity": [
        2
      ],
      "sonarjs/content-security-policy": [
        2
      ],
      "sonarjs/no-mixed-content": [
        2
      ],
      "sonarjs/frame-ancestors": [
        2
      ],
      "sonarjs/no-mime-sniff": [
        2
      ],
      "sonarjs/no-referrer-policy": [
        2
      ],
      "sonarjs/strict-transport-security": [
        2
      ],
      "sonarjs/certificate-transparency": [
        0
      ],
      "sonarjs/dns-prefetching": [
        0
      ],
      "sonarjs/confidential-information-logging": [
        2
      ],
      "sonarjs/no-ip-forward": [
        2
      ],
      "sonarjs/empty-string-repetition": [
        2
      ],
      "sonarjs/regex-complexity": [
        2,
        {
          "threshold": 20
        }
      ],
      "sonarjs/anchor-precedence": [
        2
      ],
      "sonarjs/slow-regex": [
        2
      ],
      "sonarjs/no-invalid-regexp": [
        2
      ],
      "sonarjs/unused-named-groups": [
        2
      ],
      "sonarjs/no-same-argument-assert": [
        2
      ],
      "sonarjs/unicode-aware-regex": [
        0
      ],
      "sonarjs/no-misleading-character-class": [
        2
      ],
      "sonarjs/duplicates-in-character-class": [
        2
      ],
      "sonarjs/session-regeneration": [
        2
      ],
      "sonarjs/test-check-exception": [
        2
      ],
      "sonarjs/stable-tests": [
        2
      ],
      "sonarjs/no-empty-after-reluctant": [
        2
      ],
      "sonarjs/single-character-alternation": [
        2
      ],
      "sonarjs/no-code-after-done": [
        2
      ],
      "sonarjs/disabled-timeout": [
        2
      ],
      "sonarjs/chai-determinate-assertion": [
        2
      ],
      "sonarjs/aws-s3-bucket-server-encryption": [
        0
      ],
      "sonarjs/aws-s3-bucket-insecure-http": [
        2
      ],
      "sonarjs/aws-s3-bucket-versioning": [
        2
      ],
      "sonarjs/aws-s3-bucket-granted-access": [
        2
      ],
      "sonarjs/no-angular-bypass-sanitization": [
        2
      ],
      "sonarjs/aws-iam-public-access": [
        2
      ],
      "sonarjs/aws-ec2-unencrypted-ebs-volume": [
        2
      ],
      "sonarjs/aws-s3-bucket-public-access": [
        2
      ],
      "sonarjs/no-vue-bypass-sanitization": [
        0
      ],
      "sonarjs/aws-iam-all-privileges": [
        2
      ],
      "sonarjs/aws-rds-unencrypted-databases": [
        2
      ],
      "sonarjs/aws-iam-all-resources-accessible": [
        0
      ],
      "sonarjs/aws-opensearchservice-domain": [
        2
      ],
      "sonarjs/aws-iam-privilege-escalation": [
        2
      ],
      "sonarjs/aws-sagemaker-unencrypted-notebook": [
        2
      ],
      "sonarjs/aws-restricted-ip-admin-access": [
        2
      ],
      "sonarjs/no-empty-alternatives": [
        2
      ],
      "sonarjs/no-control-regex": [
        2
      ],
      "sonarjs/no-regex-spaces": [
        2
      ],
      "sonarjs/aws-sns-unencrypted-topics": [
        2
      ],
      "sonarjs/existing-groups": [
        2
      ],
      "sonarjs/aws-ec2-rds-dms-public": [
        2
      ],
      "sonarjs/aws-sqs-unencrypted-queue": [
        2
      ],
      "sonarjs/no-empty-group": [
        2
      ],
      "sonarjs/aws-efs-unencrypted": [
        2
      ],
      "sonarjs/aws-apigateway-public-api": [
        2
      ],
      "sonarjs/stateful-regex": [
        2
      ],
      "sonarjs/concise-regex": [
        2
      ],
      "sonarjs/single-char-in-character-classes": [
        2
      ],
      "sonarjs/no-hardcoded-secrets": [
        2,
        {
          "secretWords": "api[_.-]?key,auth,credential,secret,token",
          "randomnessSensibility": 5
        }
      ],
      "sonarjs/no-exclusive-tests": [
        2
      ],
      "sonarjs/jsx-no-leaked-render": [
        2
      ],
      "sonarjs/no-hook-setter-in-body": [
        2
      ],
      "sonarjs/no-useless-react-setstate": [
        2
      ],
      "sonarjs/no-uniq-key": [
        2
      ],
      "sonarjs/redundant-type-aliases": [
        2
      ],
      "sonarjs/prefer-regexp-exec": [
        2
      ],
      "sonarjs/no-internal-api-use": [
        2
      ],
      "sonarjs/prefer-read-only-props": [
        2
      ],
      "sonarjs/no-literal-call": [
        2
      ],
      "sonarjs/reduce-initial-value": [
        2
      ],
      "sonarjs/no-async-constructor": [
        2
      ],
      "import/no-unresolved": [
        2
      ],
      "import/named": [
        2
      ],
      "import/namespace": [
        2
      ],
      "import/default": [
        2
      ],
      "import/export": [
        2
      ],
      "import/no-named-as-default": [
        2
      ],
      "import/no-named-as-default-member": [
        1
      ],
      "import/no-duplicates": [
        2
      ],
      "unicorn/better-regex": [
        0,
        {
          "sortCharacterClasses": true
        }
      ],
      "unicorn/catch-error-name": [
        2,
        {}
      ],
      "unicorn/consistent-assert": [
        2
      ],
      "unicorn/consistent-date-clone": [
        2
      ],
      "unicorn/consistent-destructuring": [
        0
      ],
      "unicorn/consistent-empty-array-spread": [
        2
      ],
      "unicorn/consistent-existence-index-check": [
        2
      ],
      "unicorn/consistent-function-scoping": [
        2,
        {
          "checkArrowFunctions": true
        }
      ],
      "unicorn/custom-error-definition": [
        0
      ],
      "unicorn/empty-brace-spaces": [
        0
      ],
      "unicorn/error-message": [
        2
      ],
      "unicorn/escape-case": [
        2,
        "uppercase"
      ],
      "unicorn/expiring-todo-comments": [
        2,
        {
          "terms": [
            "todo",
            "fixme",
            "xxx"
          ],
          "ignore": [],
          "ignoreDatesOnPullRequests": true,
          "allowWarningComments": true
        }
      ],
      "unicorn/explicit-length-check": [
        2
      ],
      "unicorn/filename-case": [
        2
      ],
      "unicorn/import-style": [
        2,
        {
          "styles": {
            "node:path": {
              "named": true,
              "default": false
            }
          }
        }
      ],
      "unicorn/new-for-builtins": [
        2
      ],
      "unicorn/no-abusive-eslint-disable": [
        2
      ],
      "unicorn/no-accessor-recursion": [
        2
      ],
      "unicorn/no-anonymous-default-export": [
        2
      ],
      "unicorn/no-array-callback-reference": [
        2
      ],
      "unicorn/no-array-for-each": [
        2
      ],
      "unicorn/no-array-method-this-argument": [
        2
      ],
      "unicorn/no-array-reduce": [
        2,
        {
          "allowSimpleOperations": true
        }
      ],
      "unicorn/no-array-reverse": [
        2,
        {
          "allowExpressionStatement": true
        }
      ],
      "unicorn/no-await-expression-member": [
        2
      ],
      "unicorn/no-await-in-promise-methods": [
        2
      ],
      "unicorn/no-console-spaces": [
        2
      ],
      "unicorn/no-document-cookie": [
        2
      ],
      "unicorn/no-empty-file": [
        2
      ],
      "unicorn/no-for-loop": [
        2
      ],
      "unicorn/no-hex-escape": [
        2
      ],
      "unicorn/no-instanceof-builtins": [
        2,
        {
          "useErrorIsError": false,
          "strategy": "loose",
          "include": [],
          "exclude": []
        }
      ],
      "unicorn/no-invalid-fetch-options": [
        2
      ],
      "unicorn/no-invalid-remove-event-listener": [
        2
      ],
      "unicorn/no-keyword-prefix": [
        0,
        {}
      ],
      "unicorn/no-lonely-if": [
        2
      ],
      "unicorn/no-magic-array-flat-depth": [
        2
      ],
      "unicorn/no-named-default": [
        2
      ],
      "unicorn/no-negated-condition": [
        2
      ],
      "unicorn/no-negation-in-equality-check": [
        2
      ],
      "unicorn/no-nested-ternary": [
        0
      ],
      "unicorn/no-new-array": [
        2
      ],
      "unicorn/no-new-buffer": [
        2
      ],
      "unicorn/no-null": [
        0,
        {
          "checkStrictEquality": false
        }
      ],
      "unicorn/no-object-as-default-parameter": [
        2
      ],
      "unicorn/no-process-exit": [
        2
      ],
      "unicorn/no-single-promise-in-promise-methods": [
        2
      ],
      "unicorn/no-static-only-class": [
        2
      ],
      "unicorn/no-thenable": [
        2
      ],
      "unicorn/no-this-assignment": [
        2
      ],
      "unicorn/no-typeof-undefined": [
        2,
        {
          "checkGlobalVariables": false
        }
      ],
      "unicorn/no-unnecessary-array-flat-depth": [
        2
      ],
      "unicorn/no-unnecessary-array-splice-count": [
        2
      ],
      "unicorn/no-unnecessary-await": [
        2
      ],
      "unicorn/no-unnecessary-polyfills": [
        2
      ],
      "unicorn/no-unnecessary-slice-end": [
        2
      ],
      "unicorn/no-unreadable-array-destructuring": [
        2
      ],
      "unicorn/no-unreadable-iife": [
        2
      ],
      "unicorn/no-unused-properties": [
        0
      ],
      "unicorn/no-useless-error-capture-stack-trace": [
        2
      ],
      "unicorn/no-useless-fallback-in-spread": [
        2
      ],
      "unicorn/no-useless-length-check": [
        2
      ],
      "unicorn/no-useless-promise-resolve-reject": [
        2
      ],
      "unicorn/no-useless-spread": [
        2
      ],
      "unicorn/no-useless-switch-case": [
        2
      ],
      "unicorn/no-useless-undefined": [
        2,
        {}
      ],
      "unicorn/no-zero-fractions": [
        2
      ],
      "unicorn/number-literal-case": [
        0,
        {
          "hexadecimalValue": "uppercase"
        }
      ],
      "unicorn/numeric-separators-style": [
        2,
        {
          "onlyIfContainsSeparator": false,
          "binary": {
            "minimumDigits": 0,
            "groupLength": 4
          },
          "octal": {
            "minimumDigits": 0,
            "groupLength": 4
          },
          "hexadecimal": {
            "minimumDigits": 0,
            "groupLength": 2
          },
          "number": {
            "minimumDigits": 5,
            "groupLength": 3
          }
        }
      ],
      "unicorn/prefer-add-event-listener": [
        2,
        {}
      ],
      "unicorn/prefer-array-find": [
        2,
        {
          "checkFromLast": true
        }
      ],
      "unicorn/prefer-array-flat": [
        2,
        {}
      ],
      "unicorn/prefer-array-flat-map": [
        2
      ],
      "unicorn/prefer-array-index-of": [
        2
      ],
      "unicorn/prefer-array-some": [
        2
      ],
      "unicorn/prefer-at": [
        2,
        {
          "getLastElementFunctions": [],
          "checkAllIndexAccess": false
        }
      ],
      "unicorn/prefer-blob-reading-methods": [
        2
      ],
      "unicorn/prefer-class-fields": [
        2
      ],
      "unicorn/prefer-code-point": [
        2
      ],
      "unicorn/prefer-date-now": [
        2
      ],
      "unicorn/prefer-default-parameters": [
        2
      ],
      "unicorn/prefer-dom-node-append": [
        2
      ],
      "unicorn/prefer-dom-node-dataset": [
        2
      ],
      "unicorn/prefer-dom-node-remove": [
        2
      ],
      "unicorn/prefer-dom-node-text-content": [
        2
      ],
      "unicorn/prefer-event-target": [
        2
      ],
      "unicorn/prefer-export-from": [
        2,
        {
          "ignoreUsedVariables": false
        }
      ],
      "unicorn/prefer-global-this": [
        2
      ],
      "unicorn/prefer-import-meta-properties": [
        0
      ],
      "unicorn/prefer-includes": [
        2
      ],
      "unicorn/prefer-json-parse-buffer": [
        0
      ],
      "unicorn/prefer-keyboard-event-key": [
        2
      ],
      "unicorn/prefer-logical-operator-over-ternary": [
        2
      ],
      "unicorn/prefer-math-min-max": [
        2
      ],
      "unicorn/prefer-math-trunc": [
        2
      ],
      "unicorn/prefer-modern-dom-apis": [
        2
      ],
      "unicorn/prefer-modern-math-apis": [
        2
      ],
      "unicorn/prefer-module": [
        2
      ],
      "unicorn/prefer-native-coercion-functions": [
        2
      ],
      "unicorn/prefer-negative-index": [
        2
      ],
      "unicorn/prefer-node-protocol": [
        2
      ],
      "unicorn/prefer-number-properties": [
        2,
        {
          "checkInfinity": false,
          "checkNaN": true
        }
      ],
      "unicorn/prefer-object-from-entries": [
        2,
        {}
      ],
      "unicorn/prefer-optional-catch-binding": [
        2
      ],
      "unicorn/prefer-prototype-methods": [
        2
      ],
      "unicorn/prefer-query-selector": [
        2
      ],
      "unicorn/prefer-reflect-apply": [
        2
      ],
      "unicorn/prefer-regexp-test": [
        2
      ],
      "unicorn/prefer-set-has": [
        2
      ],
      "unicorn/prefer-set-size": [
        2
      ],
      "unicorn/prefer-single-call": [
        2,
        {}
      ],
      "unicorn/prefer-spread": [
        2
      ],
      "unicorn/prefer-string-raw": [
        2
      ],
      "unicorn/prefer-string-replace-all": [
        2
      ],
      "unicorn/prefer-string-slice": [
        2
      ],
      "unicorn/prefer-string-starts-ends-with": [
        2
      ],
      "unicorn/prefer-string-trim-start-end": [
        2
      ],
      "unicorn/prefer-structured-clone": [
        2,
        {}
      ],
      "unicorn/prefer-switch": [
        2,
        {
          "minimumCases": 3,
          "emptyDefaultCase": "no-default-comment"
        }
      ],
      "unicorn/prefer-ternary": [
        2,
        "always"
      ],
      "unicorn/prefer-top-level-await": [
        2
      ],
      "unicorn/prefer-type-error": [
        2
      ],
      "unicorn/prevent-abbreviations": [
        2,
        {
          "allowList": {
            "utils": true,
            "lib": true,
            "pkg": true,
            "i": true,
            "j": true
          }
        }
      ],
      "unicorn/relative-url-style": [
        2,
        "never"
      ],
      "unicorn/require-array-join-separator": [
        2
      ],
      "unicorn/require-module-specifiers": [
        2
      ],
      "unicorn/require-number-to-fixed-digits-argument": [
        2
      ],
      "unicorn/require-post-message-target-origin": [
        0
      ],
      "unicorn/string-content": [
        0,
        {}
      ],
      "unicorn/switch-case-braces": [
        2,
        "avoid"
      ],
      "unicorn/template-indent": [
        0,
        {}
      ],
      "unicorn/text-encoding-identifier-case": [
        2
      ],
      "unicorn/throw-new-error": [
        2
      ],
      "no-new-symbol": [
        0
      ],
      "@typescript-eslint/await-thenable": [
        2
      ],
      "@typescript-eslint/ban-ts-comment": [
        2
      ],
      "@typescript-eslint/no-array-constructor": [
        2
      ],
      "@typescript-eslint/no-array-delete": [
        2
      ],
      "@typescript-eslint/no-base-to-string": [
        2
      ],
      "@typescript-eslint/no-duplicate-enum-values": [
        2
      ],
      "@typescript-eslint/no-duplicate-type-constituents": [
        2
      ],
      "@typescript-eslint/no-empty-object-type": [
        2
      ],
      "@typescript-eslint/no-explicit-any": [
        2
      ],
      "@typescript-eslint/no-extra-non-null-assertion": [
        2
      ],
      "@typescript-eslint/no-floating-promises": [
        2
      ],
      "@typescript-eslint/no-for-in-array": [
        2
      ],
      "@typescript-eslint/no-implied-eval": [
        2
      ],
      "@typescript-eslint/no-misused-new": [
        2
      ],
      "@typescript-eslint/no-misused-promises": [
        2
      ],
      "@typescript-eslint/no-namespace": [
        2
      ],
      "@typescript-eslint/no-non-null-asserted-optional-chain": [
        2
      ],
      "@typescript-eslint/no-redundant-type-constituents": [
        2
      ],
      "@typescript-eslint/no-require-imports": [
        2
      ],
      "@typescript-eslint/no-this-alias": [
        2
      ],
      "@typescript-eslint/no-unnecessary-type-assertion": [
        2
      ],
      "@typescript-eslint/no-unnecessary-type-constraint": [
        2
      ],
      "@typescript-eslint/no-unsafe-argument": [
        2
      ],
      "@typescript-eslint/no-unsafe-assignment": [
        2
      ],
      "@typescript-eslint/no-unsafe-call": [
        2
      ],
      "@typescript-eslint/no-unsafe-declaration-merging": [
        2
      ],
      "@typescript-eslint/no-unsafe-enum-comparison": [
        2
      ],
      "@typescript-eslint/no-unsafe-function-type": [
        2
      ],
      "@typescript-eslint/no-unsafe-member-access": [
        2
      ],
      "@typescript-eslint/no-unsafe-return": [
        2
      ],
      "@typescript-eslint/no-unsafe-unary-minus": [
        2
      ],
      "@typescript-eslint/no-unused-expressions": [
        2,
        {
          "allowShortCircuit": false,
          "allowTaggedTemplates": false,
          "allowTernary": false
        }
      ],
      "@typescript-eslint/no-unused-vars": [
        2,
        {
          "args": "none"
        }
      ],
      "@typescript-eslint/no-wrapper-object-types": [
        2
      ],
      "@typescript-eslint/only-throw-error": [
        2
      ],
      "@typescript-eslint/prefer-as-const": [
        2
      ],
      "@typescript-eslint/prefer-namespace-keyword": [
        2
      ],
      "@typescript-eslint/prefer-promise-reject-errors": [
        2
      ],
      "@typescript-eslint/require-await": [
        2
      ],
      "@typescript-eslint/restrict-plus-operands": [
        2
      ],
      "@typescript-eslint/restrict-template-expressions": [
        2
      ],
      "@typescript-eslint/triple-slash-reference": [
        2
      ],
      "@typescript-eslint/unbound-method": [
        2
      ],
      "@stylistic/lines-around-comment": [
        0
      ],
      "@stylistic/max-len": [
        0
      ],
      "@stylistic/no-confusing-arrow": [
        0
      ],
      "@stylistic/no-mixed-operators": [
        0
      ],
      "@stylistic/no-tabs": [
        0
      ],
      "@stylistic/quotes": [
        0
      ],
      "@stylistic/js/lines-around-comment": [
        0
      ],
      "@stylistic/js/max-len": [
        0
      ],
      "@stylistic/js/no-confusing-arrow": [
        0
      ],
      "@stylistic/js/no-mixed-operators": [
        0
      ],
      "@stylistic/js/no-tabs": [
        0
      ],
      "@stylistic/js/quotes": [
        0
      ],
      "@stylistic/ts/lines-around-comment": [
        0
      ],
      "@stylistic/ts/quotes": [
        0
      ],
      "@typescript-eslint/lines-around-comment": [
        0
      ],
      "@typescript-eslint/quotes": [
        0
      ],
      "babel/quotes": [
        0
      ],
      "vue/html-self-closing": [
        0
      ],
      "vue/max-len": [
        0
      ],
      "@babel/object-curly-spacing": [
        0
      ],
      "@babel/semi": [
        0
      ],
      "@stylistic/array-bracket-newline": [
        0
      ],
      "@stylistic/array-bracket-spacing": [
        0
      ],
      "@stylistic/array-element-newline": [
        0
      ],
      "@stylistic/arrow-parens": [
        0
      ],
      "@stylistic/arrow-spacing": [
        0
      ],
      "@stylistic/block-spacing": [
        0
      ],
      "@stylistic/brace-style": [
        0
      ],
      "@stylistic/comma-dangle": [
        0
      ],
      "@stylistic/comma-spacing": [
        0
      ],
      "@stylistic/comma-style": [
        0
      ],
      "@stylistic/computed-property-spacing": [
        0
      ],
      "@stylistic/dot-location": [
        0
      ],
      "@stylistic/eol-last": [
        0
      ],
      "@stylistic/func-call-spacing": [
        0
      ],
      "@stylistic/function-call-argument-newline": [
        0
      ],
      "@stylistic/function-call-spacing": [
        0
      ],
      "@stylistic/function-paren-newline": [
        0
      ],
      "@stylistic/generator-star-spacing": [
        0
      ],
      "@stylistic/implicit-arrow-linebreak": [
        0
      ],
      "@stylistic/indent": [
        0
      ],
      "@stylistic/jsx-quotes": [
        0
      ],
      "@stylistic/key-spacing": [
        0
      ],
      "@stylistic/keyword-spacing": [
        0
      ],
      "@stylistic/linebreak-style": [
        0
      ],
      "@stylistic/max-statements-per-line": [
        0
      ],
      "@stylistic/multiline-ternary": [
        0
      ],
      "@stylistic/new-parens": [
        0
      ],
      "@stylistic/newline-per-chained-call": [
        0
      ],
      "@stylistic/no-extra-parens": [
        0
      ],
      "@stylistic/no-extra-semi": [
        0
      ],
      "@stylistic/no-floating-decimal": [
        0
      ],
      "@stylistic/no-mixed-spaces-and-tabs": [
        0
      ],
      "@stylistic/no-multi-spaces": [
        0
      ],
      "@stylistic/no-multiple-empty-lines": [
        0
      ],
      "@stylistic/no-trailing-spaces": [
        0
      ],
      "@stylistic/no-whitespace-before-property": [
        0
      ],
      "@stylistic/nonblock-statement-body-position": [
        0
      ],
      "@stylistic/object-curly-newline": [
        0
      ],
      "@stylistic/object-curly-spacing": [
        0
      ],
      "@stylistic/object-property-newline": [
        0
      ],
      "@stylistic/one-var-declaration-per-line": [
        0
      ],
      "@stylistic/operator-linebreak": [
        0
      ],
      "@stylistic/padded-blocks": [
        0
      ],
      "@stylistic/quote-props": [
        0
      ],
      "@stylistic/rest-spread-spacing": [
        0
      ],
      "@stylistic/semi": [
        0
      ],
      "@stylistic/semi-spacing": [
        0
      ],
      "@stylistic/semi-style": [
        0
      ],
      "@stylistic/space-before-blocks": [
        0
      ],
      "@stylistic/space-before-function-paren": [
        0
      ],
      "@stylistic/space-in-parens": [
        0
      ],
      "@stylistic/space-infix-ops": [
        0
      ],
      "@stylistic/space-unary-ops": [
        0
      ],
      "@stylistic/switch-colon-spacing": [
        0
      ],
      "@stylistic/template-curly-spacing": [
        0
      ],
      "@stylistic/template-tag-spacing": [
        0
      ],
      "@stylistic/wrap-iife": [
        0
      ],
      "@stylistic/wrap-regex": [
        0
      ],
      "@stylistic/yield-star-spacing": [
        0
      ],
      "@stylistic/member-delimiter-style": [
        0
      ],
      "@stylistic/type-annotation-spacing": [
        0
      ],
      "@stylistic/jsx-child-element-spacing": [
        0
      ],
      "@stylistic/jsx-closing-bracket-location": [
        0
      ],
      "@stylistic/jsx-closing-tag-location": [
        0
      ],
      "@stylistic/jsx-curly-newline": [
        0
      ],
      "@stylistic/jsx-curly-spacing": [
        0
      ],
      "@stylistic/jsx-equals-spacing": [
        0
      ],
      "@stylistic/jsx-first-prop-new-line": [
        0
      ],
      "@stylistic/jsx-indent": [
        0
      ],
      "@stylistic/jsx-indent-props": [
        0
      ],
      "@stylistic/jsx-max-props-per-line": [
        0
      ],
      "@stylistic/jsx-newline": [
        0
      ],
      "@stylistic/jsx-one-expression-per-line": [
        0
      ],
      "@stylistic/jsx-props-no-multi-spaces": [
        0
      ],
      "@stylistic/jsx-tag-spacing": [
        0
      ],
      "@stylistic/jsx-wrap-multilines": [
        0
      ],
      "@stylistic/indent-binary-ops": [
        0
      ],
      "@stylistic/type-generic-spacing": [
        0
      ],
      "@stylistic/type-named-tuple-spacing": [
        0
      ],
      "@stylistic/js/array-bracket-newline": [
        0
      ],
      "@stylistic/js/array-bracket-spacing": [
        0
      ],
      "@stylistic/js/array-element-newline": [
        0
      ],
      "@stylistic/js/arrow-parens": [
        0
      ],
      "@stylistic/js/arrow-spacing": [
        0
      ],
      "@stylistic/js/block-spacing": [
        0
      ],
      "@stylistic/js/brace-style": [
        0
      ],
      "@stylistic/js/comma-dangle": [
        0
      ],
      "@stylistic/js/comma-spacing": [
        0
      ],
      "@stylistic/js/comma-style": [
        0
      ],
      "@stylistic/js/computed-property-spacing": [
        0
      ],
      "@stylistic/js/dot-location": [
        0
      ],
      "@stylistic/js/eol-last": [
        0
      ],
      "@stylistic/js/func-call-spacing": [
        0
      ],
      "@stylistic/js/function-call-argument-newline": [
        0
      ],
      "@stylistic/js/function-call-spacing": [
        0
      ],
      "@stylistic/js/function-paren-newline": [
        0
      ],
      "@stylistic/js/generator-star-spacing": [
        0
      ],
      "@stylistic/js/implicit-arrow-linebreak": [
        0
      ],
      "@stylistic/js/indent": [
        0
      ],
      "@stylistic/js/jsx-quotes": [
        0
      ],
      "@stylistic/js/key-spacing": [
        0
      ],
      "@stylistic/js/keyword-spacing": [
        0
      ],
      "@stylistic/js/linebreak-style": [
        0
      ],
      "@stylistic/js/max-statements-per-line": [
        0
      ],
      "@stylistic/js/multiline-ternary": [
        0
      ],
      "@stylistic/js/new-parens": [
        0
      ],
      "@stylistic/js/newline-per-chained-call": [
        0
      ],
      "@stylistic/js/no-extra-parens": [
        0
      ],
      "@stylistic/js/no-extra-semi": [
        0
      ],
      "@stylistic/js/no-floating-decimal": [
        0
      ],
      "@stylistic/js/no-mixed-spaces-and-tabs": [
        0
      ],
      "@stylistic/js/no-multi-spaces": [
        0
      ],
      "@stylistic/js/no-multiple-empty-lines": [
        0
      ],
      "@stylistic/js/no-trailing-spaces": [
        0
      ],
      "@stylistic/js/no-whitespace-before-property": [
        0
      ],
      "@stylistic/js/nonblock-statement-body-position": [
        0
      ],
      "@stylistic/js/object-curly-newline": [
        0
      ],
      "@stylistic/js/object-curly-spacing": [
        0
      ],
      "@stylistic/js/object-property-newline": [
        0
      ],
      "@stylistic/js/one-var-declaration-per-line": [
        0
      ],
      "@stylistic/js/operator-linebreak": [
        0
      ],
      "@stylistic/js/padded-blocks": [
        0
      ],
      "@stylistic/js/quote-props": [
        0
      ],
      "@stylistic/js/rest-spread-spacing": [
        0
      ],
      "@stylistic/js/semi": [
        0
      ],
      "@stylistic/js/semi-spacing": [
        0
      ],
      "@stylistic/js/semi-style": [
        0
      ],
      "@stylistic/js/space-before-blocks": [
        0
      ],
      "@stylistic/js/space-before-function-paren": [
        0
      ],
      "@stylistic/js/space-in-parens": [
        0
      ],
      "@stylistic/js/space-infix-ops": [
        0
      ],
      "@stylistic/js/space-unary-ops": [
        0
      ],
      "@stylistic/js/switch-colon-spacing": [
        0
      ],
      "@stylistic/js/template-curly-spacing": [
        0
      ],
      "@stylistic/js/template-tag-spacing": [
        0
      ],
      "@stylistic/js/wrap-iife": [
        0
      ],
      "@stylistic/js/wrap-regex": [
        0
      ],
      "@stylistic/js/yield-star-spacing": [
        0
      ],
      "@stylistic/ts/block-spacing": [
        0
      ],
      "@stylistic/ts/brace-style": [
        0
      ],
      "@stylistic/ts/comma-dangle": [
        0
      ],
      "@stylistic/ts/comma-spacing": [
        0
      ],
      "@stylistic/ts/func-call-spacing": [
        0
      ],
      "@stylistic/ts/function-call-spacing": [
        0
      ],
      "@stylistic/ts/indent": [
        0
      ],
      "@stylistic/ts/key-spacing": [
        0
      ],
      "@stylistic/ts/keyword-spacing": [
        0
      ],
      "@stylistic/ts/member-delimiter-style": [
        0
      ],
      "@stylistic/ts/no-extra-parens": [
        0
      ],
      "@stylistic/ts/no-extra-semi": [
        0
      ],
      "@stylistic/ts/object-curly-spacing": [
        0
      ],
      "@stylistic/ts/semi": [
        0
      ],
      "@stylistic/ts/space-before-blocks": [
        0
      ],
      "@stylistic/ts/space-before-function-paren": [
        0
      ],
      "@stylistic/ts/space-infix-ops": [
        0
      ],
      "@stylistic/ts/type-annotation-spacing": [
        0
      ],
      "@stylistic/jsx/jsx-child-element-spacing": [
        0
      ],
      "@stylistic/jsx/jsx-closing-bracket-location": [
        0
      ],
      "@stylistic/jsx/jsx-closing-tag-location": [
        0
      ],
      "@stylistic/jsx/jsx-curly-newline": [
        0
      ],
      "@stylistic/jsx/jsx-curly-spacing": [
        0
      ],
      "@stylistic/jsx/jsx-equals-spacing": [
        0
      ],
      "@stylistic/jsx/jsx-first-prop-new-line": [
        0
      ],
      "@stylistic/jsx/jsx-indent": [
        0
      ],
      "@stylistic/jsx/jsx-indent-props": [
        0
      ],
      "@stylistic/jsx/jsx-max-props-per-line": [
        0
      ],
      "@typescript-eslint/block-spacing": [
        0
      ],
      "@typescript-eslint/brace-style": [
        0
      ],
      "@typescript-eslint/comma-dangle": [
        0
      ],
      "@typescript-eslint/comma-spacing": [
        0
      ],
      "@typescript-eslint/func-call-spacing": [
        0
      ],
      "@typescript-eslint/indent": [
        0
      ],
      "@typescript-eslint/key-spacing": [
        0
      ],
      "@typescript-eslint/keyword-spacing": [
        0
      ],
      "@typescript-eslint/member-delimiter-style": [
        0
      ],
      "@typescript-eslint/no-extra-parens": [
        0
      ],
      "@typescript-eslint/no-extra-semi": [
        0
      ],
      "@typescript-eslint/object-curly-spacing": [
        0
      ],
      "@typescript-eslint/semi": [
        0
      ],
      "@typescript-eslint/space-before-blocks": [
        0
      ],
      "@typescript-eslint/space-before-function-paren": [
        0
      ],
      "@typescript-eslint/space-infix-ops": [
        0
      ],
      "@typescript-eslint/type-annotation-spacing": [
        0
      ],
      "babel/object-curly-spacing": [
        0
      ],
      "babel/semi": [
        0
      ],
      "flowtype/boolean-style": [
        0
      ],
      "flowtype/delimiter-dangle": [
        0
      ],
      "flowtype/generic-spacing": [
        0
      ],
      "flowtype/object-type-curly-spacing": [
        0
      ],
      "flowtype/object-type-delimiter": [
        0
      ],
      "flowtype/quotes": [
        0
      ],
      "flowtype/semi": [
        0
      ],
      "flowtype/space-after-type-colon": [
        0
      ],
      "flowtype/space-before-generic-bracket": [
        0
      ],
      "flowtype/space-before-type-colon": [
        0
      ],
      "flowtype/union-intersection-spacing": [
        0
      ],
      "react/jsx-child-element-spacing": [
        0
      ],
      "react/jsx-closing-bracket-location": [
        0
      ],
      "react/jsx-closing-tag-location": [
        0
      ],
      "react/jsx-curly-newline": [
        0
      ],
      "react/jsx-curly-spacing": [
        0
      ],
      "react/jsx-equals-spacing": [
        0
      ],
      "react/jsx-first-prop-new-line": [
        0
      ],
      "react/jsx-indent": [
        0
      ],
      "react/jsx-indent-props": [
        0
      ],
      "react/jsx-max-props-per-line": [
        0
      ],
      "react/jsx-newline": [
        0
      ],
      "react/jsx-one-expression-per-line": [
        0
      ],
      "react/jsx-props-no-multi-spaces": [
        0
      ],
      "react/jsx-tag-spacing": [
        0
      ],
      "react/jsx-wrap-multilines": [
        0
      ],
      "standard/array-bracket-even-spacing": [
        0
      ],
      "standard/computed-property-even-spacing": [
        0
      ],
      "standard/object-curly-even-spacing": [
        0
      ],
      "vue/array-bracket-newline": [
        0
      ],
      "vue/array-bracket-spacing": [
        0
      ],
      "vue/array-element-newline": [
        0
      ],
      "vue/arrow-spacing": [
        0
      ],
      "vue/block-spacing": [
        0
      ],
      "vue/block-tag-newline": [
        0
      ],
      "vue/brace-style": [
        0
      ],
      "vue/comma-dangle": [
        0
      ],
      "vue/comma-spacing": [
        0
      ],
      "vue/comma-style": [
        0
      ],
      "vue/dot-location": [
        0
      ],
      "vue/func-call-spacing": [
        0
      ],
      "vue/html-closing-bracket-newline": [
        0
      ],
      "vue/html-closing-bracket-spacing": [
        0
      ],
      "vue/html-end-tags": [
        0
      ],
      "vue/html-indent": [
        0
      ],
      "vue/html-quotes": [
        0
      ],
      "vue/key-spacing": [
        0
      ],
      "vue/keyword-spacing": [
        0
      ],
      "vue/max-attributes-per-line": [
        0
      ],
      "vue/multiline-html-element-content-newline": [
        0
      ],
      "vue/multiline-ternary": [
        0
      ],
      "vue/mustache-interpolation-spacing": [
        0
      ],
      "vue/no-extra-parens": [
        0
      ],
      "vue/no-multi-spaces": [
        0
      ],
      "vue/no-spaces-around-equal-signs-in-attribute": [
        0
      ],
      "vue/object-curly-newline": [
        0
      ],
      "vue/object-curly-spacing": [
        0
      ],
      "vue/object-property-newline": [
        0
      ],
      "vue/operator-linebreak": [
        0
      ],
      "vue/quote-props": [
        0
      ],
      "vue/script-indent": [
        0
      ],
      "vue/singleline-html-element-content-newline": [
        0
      ],
      "vue/space-in-parens": [
        0
      ],
      "vue/space-infix-ops": [
        0
      ],
      "vue/space-unary-ops": [
        0
      ],
      "vue/template-curly-spacing": [
        0
      ],
      "space-unary-word-ops": [
        0
      ],
      "generator-star": [
        0
      ],
      "no-comma-dangle": [
        0
      ],
      "no-reserved-keys": [
        0
      ],
      "no-space-before-semi": [
        0
      ],
      "no-wrap-func": [
        0
      ],
      "space-after-function-name": [
        0
      ],
      "space-before-function-parentheses": [
        0
      ],
      "space-in-brackets": [
        0
      ],
      "no-arrow-condition": [
        0
      ],
      "space-after-keywords": [
        0
      ],
      "space-before-keywords": [
        0
      ],
      "space-return-throw-case": [
        0
      ],
      "no-spaced-func": [
        0
      ],
      "indent-legacy": [
        0
      ],
      "array-bracket-newline": [
        0
      ],
      "array-bracket-spacing": [
        0
      ],
      "array-element-newline": [
        0
      ],
      "arrow-parens": [
        0
      ],
      "arrow-spacing": [
        0
      ],
      "block-spacing": [
        0
      ],
      "brace-style": [
        0
      ],
      "comma-dangle": [
        0
      ],
      "comma-spacing": [
        0
      ],
      "comma-style": [
        0
      ],
      "computed-property-spacing": [
        0
      ],
      "dot-location": [
        0
      ],
      "eol-last": [
        0
      ],
      "func-call-spacing": [
        0
      ],
      "function-call-argument-newline": [
        0
      ],
      "function-paren-newline": [
        0
      ],
      "generator-star-spacing": [
        0
      ],
      "implicit-arrow-linebreak": [
        0
      ],
      "indent": [
        0
      ],
      "jsx-quotes": [
        0
      ],
      "key-spacing": [
        0
      ],
      "keyword-spacing": [
        0
      ],
      "linebreak-style": [
        0
      ],
      "lines-around-comment": [
        0
      ],
      "max-len": [
        0
      ],
      "max-statements-per-line": [
        0
      ],
      "multiline-ternary": [
        0
      ],
      "new-parens": [
        0
      ],
      "newline-per-chained-call": [
        0
      ],
      "no-confusing-arrow": [
        0
      ],
      "no-extra-parens": [
        0
      ],
      "no-extra-semi": [
        0
      ],
      "no-floating-decimal": [
        0
      ],
      "no-mixed-operators": [
        0
      ],
      "no-mixed-spaces-and-tabs": [
        0
      ],
      "no-multi-spaces": [
        0
      ],
      "no-multiple-empty-lines": [
        0
      ],
      "no-tabs": [
        0
      ],
      "no-trailing-spaces": [
        0
      ],
      "no-whitespace-before-property": [
        0
      ],
      "nonblock-statement-body-position": [
        0
      ],
      "object-curly-newline": [
        0
      ],
      "object-curly-spacing": [
        0
      ],
      "object-property-newline": [
        0
      ],
      "one-var-declaration-per-line": [
        0
      ],
      "operator-linebreak": [
        0
      ],
      "padded-blocks": [
        0
      ],
      "quote-props": [
        0
      ],
      "quotes": [
        0
      ],
      "rest-spread-spacing": [
        0
      ],
      "semi": [
        0
      ],
      "semi-spacing": [
        0
      ],
      "semi-style": [
        0
      ],
      "space-before-blocks": [
        0
      ],
      "space-before-function-paren": [
        0
      ],
      "space-in-parens": [
        0
      ],
      "space-infix-ops": [
        0
      ],
      "space-unary-ops": [
        0
      ],
      "switch-colon-spacing": [
        0
      ],
      "template-curly-spacing": [
        0
      ],
      "template-tag-spacing": [
        0
      ],
      "wrap-iife": [
        0
      ],
      "wrap-regex": [
        0
      ],
      "yield-star-spacing": [
        0
      ],
      "react/jsx-space-before-closing": [
        0
      ],
      "prettier/prettier": [
        2
      ],
      "import/first": [
        2
      ],
      "import/newline-after-import": [
        2
      ],
      "import/no-absolute-path": [
        2
      ],
      "import/no-amd": [
        2
      ],
      "import/no-cycle": [
        0
      ],
      "import/no-dynamic-require": [
        2
      ],
      "import/no-extraneous-dependencies": [
        2,
        {
          "devDependencies": [
            "test/**",
            "tests/**",
            "spec/**",
            "**/__tests__/**",
            "**/__mocks__/**",
            "test.{js,jsx,ts,tsx}",
            "test-*.{js,jsx,ts,tsx}",
            "**/*{.,_}{test,spec}.{js,jsx,ts,tsx}",
            "**/*.config.{js,mjs,cjs,ts}",
            "**/*.config.*.{js,mjs,cjs,ts}",
            "**/*rc.{js,mjs,cjs,ts}"
          ],
          "optionalDependencies": false,
          "peerDependencies": false
        }
      ],
      "import/no-import-module-exports": [
        2
      ],
      "import/no-mutable-exports": [
        2
      ],
      "import/no-named-default": [
        2
      ],
      "import/no-relative-packages": [
        2
      ],
      "import/no-self-import": [
        2
      ],
      "import/no-useless-path-segments": [
        2,
        {
          "commonjs": true
        }
      ],
      "import/order": [
        2,
        {
          "groups": [
            [
              "builtin",
              "external"
            ],
            [
              "internal",
              "parent",
              "sibling",
              "index",
              "object",
              "unknown"
            ],
            "type"
          ],
          "newlines-between": "always",
          "alphabetize": {
            "order": "asc",
            "caseInsensitive": true,
            "orderImportKind": "ignore"
          },
          "distinctGroup": true,
          "sortTypesGroup": false,
          "named": false,
          "warnOnUnassignedImports": false
        }
      ],
      "import/prefer-default-export": [
        0
      ],
      "import/no-default-export": [
        2
      ],
      "import/exports-last": [
        2
      ],
      "@typescript-eslint/naming-convention": [
        2,
        {
          "selector": "typeLike",
          "format": [
            "PascalCase"
          ]
        },
        {
          "selector": "interface",
          "format": [
            "PascalCase"
          ],
          "custom": {
            "regex": "^I[A-Z]",
            "match": false
          }
        },
        {
          "selector": "enumMember",
          "format": [
            "UPPER_CASE"
          ]
        },
        {
          "selector": [
            "variable",
            "parameter",
            "classProperty"
          ],
          "format": [
            "camelCase"
          ]
        },
        {
          "selector": "variable",
          "modifiers": [
            "const"
          ],
          "format": [
            "camelCase",
            "UPPER_CASE"
          ]
        },
        {
          "selector": "variable",
          "types": [
            "boolean"
          ],
          "format": [
            "camelCase"
          ],
          "custom": {
            "regex": "^(is|has|should)[A-Z]([a-zA-Z0-9]+)$",
            "match": true
          }
        },
        {
          "selector": [
            "function",
            "method"
          ],
          "format": [
            "camelCase"
          ]
        },
        {
          "selector": "variable",
          "format": [
            "PascalCase"
          ],
          "modifiers": [
            "exported"
          ],
          "filter": {
            "regex": "^[A-Z]",
            "match": true
          }
        }
      ],
      "ava/assertion-arguments": [
        2
      ],
      "ava/hooks-order": [
        2
      ],
      "ava/max-asserts": [
        0,
        5
      ],
      "ava/no-async-fn-without-await": [
        2
      ],
      "ava/no-duplicate-modifiers": [
        2
      ],
      "ava/no-identical-title": [
        2
      ],
      "ava/no-ignored-test-files": [
        2
      ],
      "ava/no-import-test-files": [
        2
      ],
      "ava/no-incorrect-deep-equal": [
        2
      ],
      "ava/no-inline-assertions": [
        2
      ],
      "ava/no-nested-tests": [
        2
      ],
      "ava/no-only-test": [
        2
      ],
      "ava/no-skip-assert": [
        2
      ],
      "ava/no-skip-test": [
        2
      ],
      "ava/no-todo-implementation": [
        2
      ],
      "ava/no-todo-test": [
        1
      ],
      "ava/no-unknown-modifiers": [
        2
      ],
      "ava/prefer-async-await": [
        2
      ],
      "ava/prefer-power-assert": [
        0
      ],
      "ava/prefer-t-regex": [
        2
      ],
      "ava/test-title": [
        2
      ],
      "ava/test-title-format": [
        0
      ],
      "ava/use-t-well": [
        2
      ],
      "ava/use-t": [
        2
      ],
      "ava/use-t-throws-async-well": [
        2
      ],
      "ava/use-test": [
        2
      ],
      "ava/use-true-false": [
        2
      ]
    },
    "plugins": [
      "@",
      "sonarjs",
      "import:eslint-plugin-import@2.32.0",
      "unicorn:eslint-plugin-unicorn@60.0.0",
      "@typescript-eslint:@typescript-eslint/eslint-plugin@8.38.0",
      "prettier:eslint-plugin-prettier@5.5.3",
      "ava:eslint-plugin-ava@15.1.0"
    ],
    "language": "@/js",
    "languageOptions": {
      "sourceType": "module",
      "ecmaVersion": 2026,
      "parser": "typescript-eslint/parser@8.38.0",
      "parserOptions": {
        "ecmaVersion": "latest",
        "projectService": false,
        "project": "./tsconfig.eslint.json"
      },
      "globals": {
        "__dirname": false,
        "__filename": false,
        "AbortController": false,
        "AbortSignal": false,
        "AsyncDisposableStack": false,
        "atob": false,
        "Blob": false,
        "BroadcastChannel": false,
        "btoa": false,
        "Buffer": false,
        "ByteLengthQueuingStrategy": false,
        "clearImmediate": false,
        "clearInterval": false,
        "clearTimeout": false,
        "CloseEvent": false,
        "CompressionStream": false,
        "console": false,
        "CountQueuingStrategy": false,
        "crypto": false,
        "Crypto": false,
        "CryptoKey": false,
        "CustomEvent": false,
        "DecompressionStream": false,
        "DisposableStack": false,
        "DOMException": false,
        "Event": false,
        "EventTarget": false,
        "exports": true,
        "fetch": false,
        "File": false,
        "FormData": false,
        "global": false,
        "Headers": false,
        "MessageChannel": false,
        "MessageEvent": false,
        "MessagePort": false,
        "module": false,
        "navigator": false,
        "Navigator": false,
        "performance": false,
        "Performance": false,
        "PerformanceEntry": false,
        "PerformanceMark": false,
        "PerformanceMeasure": false,
        "PerformanceObserver": false,
        "PerformanceObserverEntryList": false,
        "PerformanceResourceTiming": false,
        "process": false,
        "queueMicrotask": false,
        "ReadableByteStreamController": false,
        "ReadableStream": false,
        "ReadableStreamBYOBReader": false,
        "ReadableStreamBYOBRequest": false,
        "ReadableStreamDefaultController": false,
        "ReadableStreamDefaultReader": false,
        "Request": false,
        "require": false,
        "Response": false,
        "setImmediate": false,
        "setInterval": false,
        "setTimeout": false,
        "structuredClone": false,
        "SubtleCrypto": false,
        "SuppressedError": false,
        "TextDecoder": false,
        "TextDecoderStream": false,
        "TextEncoder": false,
        "TextEncoderStream": false,
        "TransformStream": false,
        "TransformStreamDefaultController": false,
        "URL": false,
        "URLPattern": false,
        "URLSearchParams": false,
        "WebAssembly": false,
        "WebSocket": false,
        "WritableStream": false,
        "WritableStreamDefaultController": false,
        "WritableStreamDefaultWriter": false,
        "AggregateError": false,
        "Array": false,
        "ArrayBuffer": false,
        "Atomics": false,
        "BigInt": false,
        "BigInt64Array": false,
        "BigUint64Array": false,
        "Boolean": false,
        "DataView": false,
        "Date": false,
        "decodeURI": false,
        "decodeURIComponent": false,
        "encodeURI": false,
        "encodeURIComponent": false,
        "Error": false,
        "escape": false,
        "eval": false,
        "EvalError": false,
        "FinalizationRegistry": false,
        "Float16Array": false,
        "Float32Array": false,
        "Float64Array": false,
        "Function": false,
        "globalThis": false,
        "Infinity": false,
        "Int16Array": false,
        "Int32Array": false,
        "Int8Array": false,
        "Intl": false,
        "isFinite": false,
        "isNaN": false,
        "Iterator": false,
        "JSON": false,
        "Map": false,
        "Math": false,
        "NaN": false,
        "Number": false,
        "Object": false,
        "parseFloat": false,
        "parseInt": false,
        "Promise": false,
        "Proxy": false,
        "RangeError": false,
        "ReferenceError": false,
        "Reflect": false,
        "RegExp": false,
        "Set": false,
        "SharedArrayBuffer": false,
        "String": false,
        "Symbol": false,
        "SyntaxError": false,
        "TypeError": false,
        "Uint16Array": false,
        "Uint32Array": false,
        "Uint8Array": false,
        "Uint8ClampedArray": false,
        "undefined": false,
        "unescape": false,
        "URIError": false,
        "WeakMap": false,
        "WeakRef": false,
        "WeakSet": false
      }
    }
  }
];