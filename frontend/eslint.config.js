import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettier,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    rules: {
      // A arquitetura do projeto (02-PADROES.md §3 e §7) manda buscar dados no
      // Hook da feature ao montar, expondo carregando/erro, sem biblioteca de
      // cache nem Suspense. A regra pressupõe justamente essas alternativas.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
);
