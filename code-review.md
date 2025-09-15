### `tools.ts`

**Overview:**
This change introduces two new tools: `generateCommitMessageTool` for generating commit messages based on diffs and `writeReviewToMarkdownTool` for writing a code review to a markdown file.

**Detailed Feedback:**

1.  **`generateCommitMessage` Function and `generateCommitMessageTool`**
    *   **Correctness & Utility:** The current implementation of `generateCommitMessage` is very basic, producing a commit message like `chore: update <changedFiles>`. While it fulfills the basic requirement of generating *a* commit message, it doesn't provide much value in terms of summarizing the actual changes or their intent. A good commit message explains *what* was changed and *why*.
        *   **Suggestion:** Consider enhancing this function to analyze the diff content more deeply. For example, it could look for keywords in the diffs, identify common patterns (e.g., adding a new function, fixing a bug, refactoring), or even categorize the changes to generate more descriptive commit messages (e.g., "feat: Add new tool for X", "fix: Resolve Y bug"). This would make the tool significantly more powerful and helpful.
    *   **Commit Message Scope:** The `chore:` prefix is appropriate for tool-related updates, but if the tool is intended to generate messages for *any* type of change, it should be capable of producing other prefixes like `feat:`, `fix:`, `refactor:`, etc.
        *   **Suggestion:** If the tool's purpose is broader than just `chore` changes, introduce logic to infer the appropriate commit type (e.g., `feat`, `fix`, `refactor`).

2.  **`writeReviewToMarkdown` Function and `writeReviewToMarkdownTool`**
    *   **Correctness & Clarity:** This function is straightforward and correctly implements the functionality to write a string to a file. The `outputPath` with a default value of `"code-review.md"` is a good touch.
    *   **Error Handling:** The current implementation does not include explicit error handling for the file write operation. If there's an issue with permissions, disk space, or an invalid path, `fs.writeFile` would throw an unhandled exception, which could crash the agent.
        *   **Suggestion:** Wrap the `await fs.writeFile` call in a `try-catch` block to gracefully handle potential file writing errors. Log the error and perhaps return a more informative message to the user if the write fails.

**Overall:**
The additions are a good start towards building useful automation tools. The `writeReviewToMarkdownTool` is solid with a minor enhancement for error handling. The `generateCommitMessageTool` has significant potential but currently offers limited practical value due to its simplicity. Enhancing it to provide more intelligent message generation would be a great next step.