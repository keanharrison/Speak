# Google Drive MCP setup (Cursor)

Used so agents can read Speak’s Drive docs / Sheets (outreach lists, pitch materials, etc.).

**Server:** `@ibarcarty/mcp-server-google-drive`  
**Docs:** https://github.com/ibarcarty/mcp-server-google-drive

---

## One-time setup (you do this in browser + terminal)

### 1. Google Cloud

1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project (e.g. `Speak MCP`)
3. **APIs & Services → Library** — enable:
   - Google Drive API
   - Google Docs API
   - Google Sheets API
   - Google Slides API
4. **OAuth consent screen**
   - External (or Internal if Workspace)
   - App name: `Speak MCP Google Drive`
   - Add yourself as a **test user**
5. **Credentials → Create credentials → OAuth client ID**
   - Type: **Desktop app**
   - Download the JSON

### 2. Save credentials

```bash
mkdir -p ~/.config/mcp-server-google-drive
mv ~/Downloads/client_secret_*.json ~/.config/mcp-server-google-drive/oauth-credentials.json
```

### 3. Auth (browser login)

```bash
npx -y @ibarcarty/mcp-server-google-drive auth
```

Complete Google consent. Tokens land in `~/.config/mcp-server-google-drive/tokens.json`.

If Google says the app isn’t verified: **Advanced → Go to … (unsafe)** (normal for testing mode).

### 4. Cursor config

Ensure `~/.cursor/mcp.json` includes:

```json
{
  "mcpServers": {
    "google-drive": {
      "command": "npx",
      "args": ["-y", "@ibarcarty/mcp-server-google-drive"],
      "env": {
        "GDRIVE_MCP_OAUTH_PATH": "/Users/keanharrison/.config/mcp-server-google-drive/oauth-credentials.json"
      }
    }
  }
}
```

(Already written for you if this setup was run from Cursor.)

### 5. Restart Cursor

- Fully quit and reopen Cursor
- **Customize → MCPs** → confirm `google-drive` is on
- In a new Agent chat, ask: “List my recent Google Drive files” or “Read the Speak outreach spreadsheet”

---

## Security

- Don’t commit `oauth-credentials.json` or `tokens.json` to git
- Prefer `drive.file` scope later if you want narrower access; default is full `drive` for personal/testing use

## Troubleshooting

- MCP not showing tools → restart Cursor; check **MCP Logs**
- Token expired (testing mode ~7 days) → re-run `npx -y @ibarcarty/mcp-server-google-drive auth`
- API disabled errors → enable Drive/Docs/Sheets/Slides APIs in GCP
