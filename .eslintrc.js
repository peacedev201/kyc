module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      legacyDecorators: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-hooks',
  ],
  rules: {
    "react/forbid-prop-types": [1, { forbid: ["any"] }],
    "react/prop-types": [1, { ignore: ["classes", "children", "history"] }],
    "react/require-default-props": 0,

    // prettier-oriented rules
    "semi": [2, "never"],
    "comma-dangle": [2, "always-multiline"],
    "max-len": [1, { code: 140, ignoreStrings: true, ignoreComments: true, ignoreTemplateLiterals: true }],
    "react-hooks/rules-of-hooks": 'error',
    "react-hooks/exhaustive-deps": 'warn',
    "react/destructuring-assignment": [0],
    "jsx-a11y/click-events-have-key-events": [0],
    "jsx-a11y/no-noninteractive-element-interactions": [0],
    "jsx-a11y/no-static-element-interactions": [1],
    "react/jsx-props-no-spreading": [0]
  },
};
