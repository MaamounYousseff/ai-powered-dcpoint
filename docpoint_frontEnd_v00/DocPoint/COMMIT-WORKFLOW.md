## Commit & Lint Workflow

### 1. What this setup does

- **Code quality gate**: Run ESLint automatically before each commit.
- **Commit message gate**: Run Commitlint to enforce conventional commit messages.
- **Clarity**: Make it obvious which step failed and why.

---

### 2. React + TypeScript + ESLint

- **What**
  - React + React DOM as runtime dependencies.
  - TypeScript with `"jsx": "react-jsx"` in `tsconfig.app.json`.
  - ESLint flat config (`eslint.config.js`) with:
    - `@eslint/js`, `typescript-eslint`
    - `eslint-plugin-react`, `eslint-plugin-react-hooks`
    - `globals` for browser globals.

- **Why**
  - New JSX transform (`react-jsx`) lets us use JSX without importing `React`.
  - ESLint catches common bugs and style issues before code is committed.

- **How to see it working**
  - Run:

    ```bash
    npm run lint
    ```

  - If there are problems, ESLint prints file + line + rule.

---

### 3. Husky pre-commit hook (ESLint)

- **What**
  - `.husky/pre-commit` runs ESLint before Git creates a commit.

- **Why**
  - Prevent broken / unlinted code from entering the repository.

- **How**
  - Hook (simplified):

    ```sh
    # .husky/pre-commit
    cd DocPoint || exit 1
    echo "🚀 Running ESLint before commit..."
    npm run lint
    ```

  - Non-zero exit from `npm run lint` blocks the commit.

- **How to observe**
  - Introduce a lint error, then:

    ```bash
    git add .
    git commit -m "test: lint failure"
    ```

  - Expect: ESLint error output, commit is rejected.

---

### 4. Commitlint (commit message rules)

- **What**
  - `@commitlint/cli` + `@commitlint/config-conventional`.
  - Config file: `commitlint.config.cjs`.
  - Husky `commit-msg` hook runs Commitlint on every commit message.

- **Why**
  - Enforce consistent messages like:
    - `feat: add login page`
    - `fix: handle null user`
  - Makes `git log` and changelogs easier to read and automate.

- **How**
  - Config:

    ```js
    // commitlint.config.cjs
    module.exports = {
      extends: ['@commitlint/config-conventional'],
    };
    ```

  - Hook:

    ```sh
    # .husky/commit-msg
    cd DocPoint || exit 1
    echo "🚀 Running CommitLint before commit..."
    npx --no-install commitlint --edit "$1"
    ```

- **How to observe**
  - Bad message:

    ```bash
    git commit -m "bad message"
    ```

    - ESLint runs first.
    - Then Commitlint runs and should reject the message with clear errors.

  - Good message:

    ```bash
    git commit -m "feat: add commitlint test"
    ```

    - Both ESLint and Commitlint pass, commit succeeds.

---

### 5. Why ESLint ignores `commitlint.config.cjs`

- **What**
  - `eslint.config.js` has:

    ```js
    { ignores: ['dist', 'node_modules', 'commitlint.config.cjs'] }
    ```

- **Why**
  - `commitlint.config.cjs` is a Node/CommonJS config file, not browser/React code.
  - Linting it as app code caused `'module' is not defined` errors.
  - Ignoring it keeps `npm run lint` focused on actual source files.

- **How to observe**
  - Run:

    ```bash
    npm run lint
    ```

  - You should not see `commitlint.config.cjs` in the ESLint output.

---

### 6. Quick mental model when a commit fails

1. **See the hook messages**
   - `🚀 Running ESLint before commit...`
   - `🚀 Running CommitLint before commit...`
2. **If ESLint fails** → fix code (or run `npm run lint` directly).
3. **If Commitlint fails** → fix message (or test with `echo "msg" | npx commitlint`).
