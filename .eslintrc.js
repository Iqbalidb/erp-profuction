module.exports = {
  env: {
    node: true,
    es6: true,
    // es2020: true,
    browser: true
  },
  parser: "babel-eslint",

  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
      modules: true,
      experimentalObjectRestSpread: true
    }
  },
  rules: {
    "no-console": "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    // 'prettier/prettier': 'error',
    // Best Practices
    eqeqeq: "error",
    "no-invalid-this": "error",
    "no-return-assign": "error",
    "no-unused-expressions": [
      "error",
      { allowShortCircuit: true, allowTernary: true }
    ],
    "no-useless-concat": "error",
    "no-useless-return": "error",
    "react/display-name": "off",
    // Variable
    // 'init-declarations': 'error',
    // "no-use-before-define": "error",
    'no-use-before-define': 'warn',
    // Stylistic Issues
    "array-bracket-newline": ["error", { multiline: true, minItems: null }],
    "array-bracket-spacing": "error",
    "brace-style": ["error", "1tbs", { allowSingleLine: true }],
    "block-spacing": "error",
    // "comma-dangle": "error",
    'comma-dangle': 'off',
    "comma-spacing": "error",
    "comma-style": "error",
    "computed-property-spacing": "error",
    "func-call-spacing": "error",
    // "implicit-arrow-linebreak": ["error", "beside"],
    'implicit-arrow-linebreak': 'off',
    // indent: ['error', 4],
    // "keyword-spacing": "error",
    'keyword-spacing': 'off',
    // "multiline-ternary": ["error", "never"],
    'multiline-ternary': 'off',
    // 'no-lonely-if': 'error',
    "no-mixed-operators": "error",
    "no-multiple-empty-lines": ["error", { max: 2, maxEOF: 1 }],
    "no-tabs": "error",
    // "no-unneeded-ternary": "error",
    'no-unneeded-ternary': 'off',
    "no-whitespace-before-property": "error",
    "nonblock-statement-body-position": "error",
    "object-property-newline": [
      "error",
      { allowAllPropertiesOnSameLine: true }
    ],
    "quote-props": ["error", "as-needed"],
    // "quotes": ['error', 'prefer-single'],
    // quotes: ['error', 'single', { allowTemplateLiterals: true }],
    // semi: ['error', 'always'],
    semi: [2, "always"],
    "no-extra-semi": "error",
    "semi-spacing": "error",
    "space-before-blocks": "error",
    //'space-before-function-paren': ['error'],
    // 'space-in-parens': 'error',
    "space-infix-ops": "error",
    "space-unary-ops": "error",
    // New
    // "space-in-parens": ["error", "always"],
    'space-in-parens': 'off',
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "no-unused-vars": 0,
    // ES6
    "arrow-spacing": "error",
    // "no-confusing-arrow": "error",
    'no-confusing-arrow': 'off',
    "no-duplicate-imports": "error",
    "no-var": "error",
    // "object-shorthand": "error",
    'object-shorthand': 'off',
    // "prefer-const": "error",
    'prefer-const': 'warn',
    "prefer-template": "error",
    "no-constant-condition": ["error", { checkLoops: false }]
  },
  // New Rules Here {For Missing Components or Import}
  // extends: ["prettier", "eslint:recommended"],
  plugins: ["prettier", "react", "import"],
  extends: ["eslint:recommended", "plugin:react/recommended"]

  // plugins: ["import", "eslint-plugin-prettier"],
  // extends: ["react-app", "plugin:eslint-plugin-prettier/recommended"]
  /// End New Roles Here

  // rules: {
  //   'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  //   'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  //   semi: ['error', 'never'],
  //   'max-len': 'off',
  //   camelcase: ['error', { properties: 'never', ignoreDestructuring: true, ignoreImports: true }]
  // }
};
