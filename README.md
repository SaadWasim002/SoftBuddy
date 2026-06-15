# 🤖 Pterodactyl Discord Bot

This is a powerful and easy-to-use Discord bot for managing game servers hosted on the Pterodactyl panel. It provides a rich set of slash commands to control your server directly from Discord, including starting/stopping, viewing live resource usage, running console commands, and managing backups.


---

## ✅ Commands

| Command | What it does |
|---|---|
| `/status` | Shows server status, players, and resource usage |
| `/start` | Starts the server |
| `/stop` | Stops the server |
| `/restart` | Restarts the server |
| `/kill` | Force-kills the server process |
| `/cmd <command>` | Runs any console command (e.g. `say Hello!`) |
| `/servers` | Lists all servers your API key can access |
| `/console [lines]` | Shows the last few lines from the server console |
| `/backup list` | Lists all available backups |
| `/backup create [name]` | Creates a new server backup |

---

## 🚀 Setup

### 1. Get Pterodactyl API Key
- Log in to your Pterodactyl panel (e.g., `https://panel.softhost.net`).
- Click the **Account API** icon in the sidebar.
- Create a new API key. Give it a description and leave the "Allowed IPs" blank.
- Copy the key that starts with `ptlc_`.

### 2. Create a Discord Bot
1. Go to https://discord.com/developers/applications
2. Click **New Application** → name it
3. Go to **Bot** → click **Add Bot**
4. Under **Token**, click **Reset Token** and copy the new token.
5. Go to **OAuth2 → URL Generator**:
   - Scopes: `bot`, `applications.commands`
   - Bot permissions: `Send Messages`, `Use Slash Commands`
6. Open the generated URL and invite the bot to your server

### 3. Get Your IDs
- **CLIENT_ID**: Discord Developer Portal → General Information → Application ID.
- **GUILD_ID**: Right-click your Discord server → Copy Server ID (enable Developer Mode in Discord settings first).
- **PTERO_HOST**: The URL to your panel, e.g., `https://panel.softhost.net`.
- **PTERO_SERVER_ID**: From your server's URL, e.g., `.../server/abcdef12`.

### 4. Configure Environment
```bash
cp .env.example .env # If you haven't already
# Edit your .env file with all the values from the steps above.
```

### 5. Install & Run
```bash
npm install
npm start
```

---

## 📝 Notes
- The bot registers slash commands to your specific guild on startup
- Power actions (start/stop/restart) are sent immediately — use with care!
- For `/cmd`, don't include the `/` — just write `say Hello` not `/say Hello`
