#!/bin/bash
# Configures git push credentials for proofdig321/itpms.
# Token is read from .devcontainer/.git-pat (gitignored — never committed).
# To set up: echo "YOUR_PAT" > /workspaces/itpms/.devcontainer/.git-pat

PAT_FILE="/workspaces/itpms/.devcontainer/.git-pat"

if [ ! -f "$PAT_FILE" ]; then
  echo "[git-credentials] $PAT_FILE not found — skipping credential setup."
  echo "[git-credentials] Run: echo 'YOUR_PAT' > $PAT_FILE"
  exit 0
fi

PAT=$(cat "$PAT_FILE" | tr -d '[:space:]')

if [ -z "$PAT" ]; then
  echo "[git-credentials] PAT file is empty — skipping."
  exit 0
fi

git config --global credential.helper store
echo "https://prooftv:${PAT}@github.com" > ~/.git-credentials
chmod 600 ~/.git-credentials
echo "[git-credentials] Credentials configured for prooftv."
