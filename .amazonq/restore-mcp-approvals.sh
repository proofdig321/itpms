#!/usr/bin/env bash
# Restores Amazon Q MCP server approvals after Codespaces container restart.
# ~/.aws/amazonq/mcp-approvals.json is wiped on every restart — this recreates it.
# Run automatically via devcontainer postStartCommand and npm postinstall.

set -e

APPROVALS_DIR="$HOME/.aws/amazonq"
APPROVALS_FILE="$APPROVALS_DIR/mcp-approvals.json"
MCP_ADMIN_DIR="$APPROVALS_DIR/mcpAdmin"

mkdir -p "$APPROVALS_DIR" "$MCP_ADMIN_DIR"

# Write approvals — fingerprints captured 2026-08-18, workspaceHash for /workspaces/itpms
cat > "$APPROVALS_FILE" << 'EOF'
{
  "version": 1,
  "approvals": [
    {
      "serverName": "itpms-backend-mirror",
      "fingerprint": "sha256:a7a93b20536b1ecf457346ffaf6b905dc6858c4bd882144966abdc168598f7df",
      "workspaceHash": "sha256:6fa356ea7223a2b44116f354aee96efbae780e04ca4deb7b525ae5d12f1c90f3",
      "approvedAt": "2026-08-18T12:16:07.536Z"
    },
    {
      "serverName": "itpms-workspace",
      "fingerprint": "sha256:38d7e4794b1a62de31a3e3c0046ee70dd4d03e854f8dc85ad5e974f2a7118f50",
      "workspaceHash": "sha256:6fa356ea7223a2b44116f354aee96efbae780e04ca4deb7b525ae5d12f1c90f3",
      "approvedAt": "2026-08-18T12:16:12.167Z"
    },
    {
      "serverName": "itpms-constitution",
      "fingerprint": "sha256:9f3f11213fafb74d349e6b3972166ab4affd7e5a50ae0e478e86a282f373a92d",
      "workspaceHash": "sha256:6fa356ea7223a2b44116f354aee96efbae780e04ca4deb7b525ae5d12f1c90f3",
      "approvedAt": "2026-08-18T12:16:16.234Z"
    }
  ]
}
EOF

# Ensure MCP is enabled
echo '{"enabled":true}' > "$MCP_ADMIN_DIR/mcp-state.json"

# Write global agent config with MCP servers.
# ~/.aws/amazonq/agents/default.json is what Q IDE loads at startup.
# The workspace .amazonq/agents/default.json is only loaded when manually selected.
AGENTS_DIR="$APPROVALS_DIR/agents"
mkdir -p "$AGENTS_DIR"

cat > "$AGENTS_DIR/default.json" << 'EOF'
{
  "name": "Agent ITPMS",
  "description": "ITPMS frontend engineering agent for Newcastle Municipality. Reads constitution, workspace, and backend mirror via MCP.",
  "prompt": "",
  "mcpServers": {
    "itpms-constitution": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/workspaces/itpms/docs/context"
      ]
    },
    "itpms-workspace": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/workspaces/itpms"
      ]
    },
    "itpms-backend-mirror": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/workspaces/itpms-backend-mirror"
      ]
    }
  },
  "tools": [
    "fs_read",
    "execute_bash",
    "fs_write",
    "report_issue",
    "use_aws",
    "@itpms-constitution",
    "@itpms-workspace",
    "@itpms-backend-mirror",
    "fsRead",
    "fsWrite",
    "fsReplace",
    "listDirectory",
    "fileSearch",
    "executeBash",
    "codeReview",
    "displayFindings"
  ],
  "toolAliases": {},
  "allowedTools": [
    "fs_read",
    "report_issue",
    "use_aws",
    "execute_bash",
    "fs_write",
    "fsRead",
    "listDirectory",
    "fileSearch",
    "codeReview",
    "displayFindings"
  ],
  "toolsSettings": {
    "use_aws": {
      "alwaysAllow": [
        {
          "preset": "readOnly"
        }
      ]
    },
    "execute_bash": {
      "alwaysAllow": [
        {
          "preset": "readOnly"
        }
      ]
    }
  },
  "resources": [
    "file://AmazonQ.md",
    "file://README.md",
    "file://.amazonq/rules/**/*.md"
  ],
  "hooks": {
    "agentSpawn": [],
    "userPromptSubmit": []
  },
  "useLegacyMcpJson": true
}
EOF

echo "✅ MCP restored — Agent ITPMS, itpms-constitution, itpms-workspace, itpms-backend-mirror"
