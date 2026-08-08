Review all staged and unstaged changes in the current repository.

1. Inspect the changes for obvious bugs, mistakes, or unintended changes.
2. If you find a serious issue, stop and explain it. Do not commit or push.
3. Generate a concise commit message following Conventional Commits.
4. Stage all changes with `git add -A`.
5. Commit using the generated commit message.
6. Push the current branch with `git push`.

Do not ask me for a commit message.
Do not modify code unless necessary to fix an obvious issue.
Do not create a new branch.
Do not change branches.

If everything looks good, execute the entire workflow automatically:

review → stage → commit → push