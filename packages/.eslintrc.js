module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		sourceType: 'module',
		tsconfigRootDir: __dirname + '/..',
		project: ['./tsconfig.eslint.json'],
		warnOnUnsupportedTypeScriptVersion: false,
	},
	extends: [
		'airbnb',
		'plugin:@typescript-eslint/recommended',
		'plugin:import/typescript',
		'prettier' // Nutné pro zamezení kolize ESLint s Prettier pravidly
	],
	settings: {
		'import/resolver': {
			typescript: {
				project: [
					__dirname + "/../tsconfig.eslint.json",
					__dirname + "/**/*/tsconfig.json",
				]
			}
		}
	},
	plugins: [
		'@typescript-eslint',
		'react-hooks',
		'validate-jsx-nesting',
		'no-only-tests',
		'prettier' // Zajišťuje, že všechny prettierové chyby budou opraveny s 'eslint --fix'
	],
	rules: {
		'@typescript-eslint/ban-ts-comment': 'warn',
		'@typescript-eslint/ban-types': ['error', {
			types: {
				'{}': false,
			}
		}],
		'@typescript-eslint/camelcase': 'off',
		'@typescript-eslint/explicit-function-return-type': [
			'error',
			{
				'allowExpressions': true
			}
		],
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/lines-between-class-members': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-floating-promises': 'warn',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/member-delimiter-style': 'error',
		'@typescript-eslint/no-use-before-define': 'error',
		'@typescript-eslint/no-unsafe-declaration-merging': 'off',
		'@typescript-eslint/no-shadow': ['error'],
		'arrow-parens': 'off',
		'camelcase': 'off',
		'curly': ['error', 'all'],
		'class-methods-use-this': 'off',
		'default-case': 'off',
		'eqeqeq': 'error',
		'import/extensions': 'off',
		'import/no-cycle': 'off',
		'import/no-named-as-default-member': 'off',
		'import/prefer-default-export': 'off',
		'indent': 'off',
		'jsx-a11y/click-events-have-key-events': 'off',
		'jsx-a11y/label-has-associated-control': 'off',
		'jsx-a11y/control-has-associated-label': 'off',
		'jsx-a11y/label-has-for': 'off',
		'jsx-a11y/no-static-element-interactions': 'off',
		'lines-between-class-members': 'off',
		'max-classes-per-file': ['off'],
		'max-len': 'off',
		'require-await': 'error',
		'no-alert': 'off',
		'no-await-in-loop': 'warn',
		'no-case-declarations': 'warn',
		'no-continue': 'off',
		'no-console': 'error',
		'no-dupe-class-members': 'off',
		'no-shadow': 'off',
		'import/no-extraneous-dependencies': ['error', { 'devDependencies': ['**/*.test.ts'] }],
		'no-mixed-operators': 'off',
		'no-param-reassign': 'error',
		'no-plusplus': 'off',
		'no-prototype-builtins': 'off',
		'no-restricted-globals': 'off',
		'no-tabs': 'off',
		'no-undef': 'off',
		'no-underscore-dangle': 'off',
		'no-unused-expressions': 'off',
		'no-unused-vars': 'off',
		'no-use-before-define': 'error',
		'no-useless-constructor': 'off',
		'object-curly-newline': 'off',
		'padded-blocks': 'off',
		'radix': 'off',
		'react/jsx-filename-extension': [
			'warn',
			{
				'extensions': [
					'.js',
					'.jsx',
					'.ts',
					'.tsx'
				]
			}
		],
		'react/jsx-indent': 'off',
		'react/jsx-indent-props': 'off',
		'react/jsx-key': ['error', { 'checkFragmentShorthand': true }],
		'react/jsx-props-no-spreading': 'off',
		'react/no-unused-prop-types': 'off',
		'react/prop-types': 'off',
		'react/require-default-props': 'off',
		'react/sort-comp': 'off',
		'semi': 'off',
		"react-hooks/exhaustive-deps": "error",
		"react-hooks/rules-of-hooks": "error",
		'no-param-reassign': ['error', { 'ignorePropertyModificationsFor': ['draft', 'draftState'] }], // ignorujeme 'draft' prop kvuli immeru
		'no-shadow': 'off',
		'no-promise-executor-return': 'off',
		'no-constructor-return': 'off',
		'default-param-last': 'off',
		'@typescript-eslint/no-shadow': ['error'],
		'newline-per-chained-call': 'off',
		'@typescript-eslint/consistent-type-imports': 'error',
		'@typescript-eslint/consistent-type-exports': 'error',
		'curly': ['error', 'all'],
		'react/react-in-jsx-scope': 'off',
		'react/function-component-definition': 'off',
		'react/jsx-no-constructed-context-values': 'off',
		'react/jsx-no-useless-fragment': ['error', {'allowExpressions': true}],
		'validate-jsx-nesting/no-invalid-jsx-nesting': 'error',
		'no-only-tests/no-only-tests': [
			'error', {
				'block': ['test', 'it', 'describe'],
				'focus': ['only', 'skip']
			}
		],

		// @NOTE - empty lines codestyle
		"lines-between-class-members": ["error", "always", { exceptAfterSingleLine: true }],
		"padding-line-between-statements": [
			"error",
			// prázdný řádek před returnem
			{ blankLine: "always", prev: "*", next: "return" },

			// prázdný řádek po bloku const a let
			{ blankLine: "always", prev: ["const", "let", "var",], next: "*" },
			{ blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] },




			// prázdný řádek po blokových definicích (if, function, ...)
			{ blankLine: "always", prev: ["multiline-block-like", "block-like", "block"], next: "*" },
			{ blankLine: "always", prev: "*", next: ["multiline-block-like", "block-like", "block"] },

			// přebití vrchního pravidla pro umožnění zadání proměnné nad ifem
			{ blankLine: "any", prev: ["const", "let", "var"], next: ["if", "switch"] },


			// prázdný řádek před každým casem - můžeme změnit na always, až budeme mít eslint v8 a budeme moci použít: no-fallthrough: ["error", { "allowEmptyCase": true }]
			{ blankLine: "any", prev: "case", next: "*" },

			// prázdný řádek před a po deklaraci class
			{ blankLine: "always", prev: "*", next: "class" },
			{ blankLine: "always", prev: "class", next: "*" },

			// prázdný řádek před a po deklaraci switch
			{ blankLine: "always", prev: "*", next: "switch" },
			{ blankLine: "always", prev: "switch", next: "*" },

		],

		'import/no-default-export': 'error',
		'quotes': ['error', 'single', { 'avoidEscape': true }],
		'no-empty-function': ["error", { "allow": ["constructors"] }],
		'no-unsafe-optional-chaining': ['error', { 'disallowArithmeticOperators': false }],
		'prefer-regex-literals': 'off',
		/*
		 * @NOTE - Je nutné, aby toto pravidlo bylo na posledním místě, aby nedocházelo k ESlint vs prettier kolizím!!!
		 */
		'prettier/prettier': 'error'
	},
	overrides: [
		{
			files: [
				'*.d.ts',
				'*.stories.tsx',
				'*.shared-worker.ts',
				'*.worker.ts',
			],
			rules: {
				'import/no-default-export': 'off',
			},
		},
		{
			files: [
				"**/engine-core/**/*",
				"**/data-query/**/*",
				"**/@types/**/*",
				'*.types.ts',
			],
			rules: {
				'no-use-before-define': 'off',
				'@typescript-eslint/no-use-before-define': 'off',
			},
		},
		{
			files: ['**/*.ts'],
			excludedFiles: [
				'**/*.hooks.ts',
				'**/use*.ts',
			],
			rules: {
				'react/button-has-type': 'off',
				'react/default-props-match-prop-types': 'off',
				'react/destructuring-assignment': 'off',
				'react/forbid-foreign-prop-types': 'off',
				'react/forbid-prop-types': 'off',
				'react/jsx-boolean-value': 'off',
				'react/jsx-curly-brace-presence': 'off',
				'react/jsx-fragments': 'off',
				'react/jsx-key': 'off',
				'react/jsx-no-bind': 'off',
				'react/jsx-no-comment-textnodes': 'off',
				'react/jsx-no-duplicate-props': 'off',
				'react/jsx-no-target-blank': 'off',
				'react/jsx-no-undef': 'off',
				'react/jsx-pascal-case': 'off',
				'react/jsx-uses-react': 'off',
				'react/jsx-uses-vars': 'off',
				'react/no-access-state-in-setstate': 'off',
				'react/no-array-index-key': 'off',
				'react/no-children-prop': 'off',
				'react/no-danger-with-children': 'off',
				'react/no-danger': 'off',
				'react/no-deprecated': 'off',
				'react/no-did-update-set-state': 'off',
				'react/no-find-dom-node': 'off',
				'react/no-is-mounted': 'off',
				'react/no-redundant-should-component-update': 'off',
				'react/no-render-return-value': 'off',
				'react/no-string-refs': 'off',
				'react/no-this-in-sfc': 'off',
				'react/no-typos': 'off',
				'react/no-unescaped-entities': 'off',
				'react/no-unknown-property': 'off',
				'react/no-unused-state': 'off',
				'react/no-will-update-set-state': 'off',
				'react/prefer-es6-class': 'off',
				'react/prefer-stateless-function': 'off',
				'react/require-render-return': 'off',
				'react/self-closing-comp': 'off',
				'react/state-in-constructor': 'off',
				'react/static-property-placement': 'off',
				'react/style-prop-object': 'off',
				'react/void-dom-elements-no-children': 'off',
				'react-hooks/exhaustive-deps': 'off',
				'react-hooks/rules-of-hooks': 'off',
				'react/no-unstable-nested-components': 'off',
				'react/prefer-exact-props': 'off',
				'react/no-arrow-function-lifecycle': 'off',
			}
		},
		{
			files: [
				'**/*.test.*',
				'**/*.typetest.ts',
			],
			rules: {
				'import/no-extraneous-dependencies': 'off',
			}
		},
		{
			files: [
				'*.js',
				'*.es6'
			],
			rules: {
				'@typescript-eslint/explicit-function-return-type': 'off',
				'@typescript-eslint/no-unused-vars': 'off'
			}
		},
		{
			files: [
				'*.d.ts',
				'**/*.typetest.ts',
			],
			rules: {
				'@typescript-eslint/no-unused-vars': 'off'
			}
		}
	],
	env: {
		es6: true,
		node: true,
		browser: true
}



