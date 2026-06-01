Stage and commit all current changes with a clear, concise commit message. Execute all steps automatically without asking for confirmation.

## Steps

1. Run `git status` to see what has changed. If there is nothing to commit, say so and stop.

2. Run `git diff` (staged and unstaged) to understand what changed.

3. Stage all modified and new tracked files:
   ```bash
   git add -A
   ```

4. Draft a commit message:
   - One short subject line (under 60 characters), imperative mood ("Add X", "Fix Y", "Update Z")
   - No body unless the change genuinely needs explanation
   - Do not mention file names unless they are the point of the change

5. Commit:
   ```bash
   git commit -m "<your message>"
   ```

6. Confirm success by showing the commit hash and subject line.
