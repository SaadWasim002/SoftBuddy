# 🤖 MCSS Discord Bot

A production-ready Discord bot to control your **MC Server Soft (MCSS)** Minecraft server with slash commands.

---

## 📁 Project Structure

```
mcss-discord-bot/
├── src/
│   ├── commands/          # One file per slash command
│   │   ├── backups.js
│   │   ├── cmd.js
│   │   ├── kill.js
│   │   ├── players.js
│   │   ├── restart.js
│   │   ├── schedulers.js
│   │   ├── servers.js
│   │   ├── start.js
│   │   ├── status.js
│   │   └── stop.js
│   ├── config/
│   │   └── index.js       # Env var loader & validation
│   ├── services/
│   │   ├── commandLoader.js  # Auto-discovers command files
│   │   └── mcss.js           # All MCSS API calls
│   ├── utils/
│   │   ├── embeds.js      # Reusable Discord embed builders
│   │   └── logger.js      # Winston logger (console + file)
│   ├── deploy-commands.js # Run once to register slash commands
│   └── index.js           # Bot entry point
├── logs/                  # Auto-created log files
├── .env.example
├── .gitignore
└── package.json
```

---

## ✅ Commands

| Command | Description |
|---|---|
| `/status` | Server status and description |
| `/players` | Online count, TPS, CPU, RAM |
| `/start` | Start the server |
| `/stop` | Stop the server |
| `/restart` | Restart the server |
| `/kill` | Force-kill the server process |
| `/cmd <command>` | Run a console command |
| `/servers` | List all MCSS-managed servers |
| `/backups list` | List all configured backups |
| `/backups run <id>` | Trigger a backup by ID |
| `/schedulers` | List all scheduled tasks |

---

## 🚀 Setup

### 1. Enable the MCSS Web API
- Open MCSS → `File > Options`
- Scroll down, tick **Enable Web API**
- Go to **Web Panel → Manage Users & API Keys** → copy your API key

### 2. Create a Discord Bot
1. Go to https://discord.com/developers/applications → **New Application**
2. Go to **Bot** → **Add Bot** → copy the **Token**
3. Go to **OAuth2 → URL Generator**:
   - Scopes: `bot`, `applications.commands`
   - Bot Permissions: `Send Messages`, `Use Slash Commands`
4. Open the generated URL and invite the bot to your server

### 3. Get Your IDs
- **CLIENT_ID** → Developer Portal → General Information → Application ID
- **GUILD_ID** → Right-click your Discord server → Copy Server ID  
  *(Enable Developer Mode: Discord Settings → Advanced → Developer Mode)*
- **MCSS_SERVER_ID** → Run `/servers` after first launch to find the GUID

### 4. Configure Environment
```bash
cp .env.example .env
# Fill in all values in .env
```

### 5. Install Dependencies
```bash
npm install
```

### 6. Deploy Slash Commands (run once)
```bash
npm run deploy
```

### 7. Start the Bot
```bash
# Production
npm start

# Development (auto-restarts on file change)
npm run dev
```

---

## ➕ Adding New Commands

1. Create `src/commands/yourcommand.js`
2. Export `data` (SlashCommandBuilder) and `execute(interaction)`
3. Re-run `npm run deploy` to register the new command with Discord

The command loader discovers all `.js` files in `/commands` automatically.

---

## 🌐 Remote MCSS Access

If MCSS is on a different machine:
- **ngrok** (easy): `ngrok http 25560` → use the ngrok URL as `MCSS_HOST`
- **Port forward** port `25560` (not recommended without SSL)

---

## 📋 Logs

Logs are written to:
- `logs/combined.log` — all logs
- `logs/error.log` — errors only
