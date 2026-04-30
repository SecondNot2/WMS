/**
 * Conventional Commits validator (https://www.conventionalcommits.org/).
 *
 * Format:
 *   <type>(<scope>): <subject>
 *
 * Examples:
 *   feat(web/products): add product list filters
 *   fix(api/inbound): use transaction when approving receipt
 *   ci: enable codeql security scan
 *   db: add StockHistory indexes
 */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "refactor",
        "perf",
        "chore",
        "docs",
        "test",
        "ci",
        "build",
        "style",
        "revert",
        "db",
      ],
    ],
    "subject-case": [0],
    "header-max-length": [2, "always", 120],
    "body-max-line-length": [0],
    "footer-max-line-length": [0],
  },
};
