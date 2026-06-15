const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
require("dotenv").config();

// ─── CONFIG ────────────────────────────────────────────────────────────────
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID     = process.env.CLIENT_ID;
const GUILD_ID      = process.env.GUILD_ID;
const PTERO_HOST    = process.env.PTERO_HOST;    // e.g. https://panel.example.com
const PTERO_API_KEY = process.env.PTERO_API_KEY; // Your Pterodactyl client API key
const SERVER_ID     = process.env.PTERO_SERVER_ID; // Your Pterodactyl server ID

// ─── PTERODACTYL API HELPER ────────────────────────────────────────────────
async function ptero(method, endpoint, body = null) {
  const url = `${PTERO_HOST}/api/client${endpoint}`;

  const res = await fetch(url, {
    method,
    headers: {
      "Authorization": `Bearer ${PTERO_API_KEY}`,
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : null,
  });

  if (res.status === 204) { // Pterodactyl returns 204 No Content for successful actions
    return null;
  }

  const contentType = res.headers.get("content-type");

  if (!res.ok) {
    let errorJson;
    if (contentType && contentType.includes("application/json")) {
      errorJson = await res.json();
    }
    const error = errorJson?.errors?.[0]?.detail || `HTTP error ${res.status} - ${res.statusText}`;
    throw new Error(`Pterodactyl API Error: ${error}`);
  }

  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }
  return res.text();
}

// Power action helper: "start", "stop", "restart", "kill"
async function sendPowerAction(action) {
  return ptero("POST", `/servers/${SERVER_ID}/power`, { signal: action });
}

// Helper to ensure a server ID is configured for commands that need it
function requireServerId() {
  if (!SERVER_ID || SERVER_ID === "your_pterodactyl_server_id") {
    throw new Error("`PTERO_SERVER_ID` is not set in your .env file. Please run `/servers` to find your server ID, then add it to your configuration and restart the bot.");
  }
}

// ─── SLASH COMMANDS ────────────────────────────────────────────────────────
const commands = [
  new SlashCommandBuilder()
    .setName("status")
    .setDescription("Get the Minecraft server status, players, and resource usage"),

  new SlashCommandBuilder()
    .setName("start")
    .setDescription("Start the Minecraft server"),

  new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop the Minecraft server"),

  new SlashCommandBuilder()
    .setName("restart")
    .setDescription("Restart the Minecraft server"),

  new SlashCommandBuilder()
    .setName("kill")
    .setDescription("Force kill the Minecraft server"),

  new SlashCommandBuilder()
    .setName("cmd")
    .setDescription("Run a console command on the server")
    .addStringOption(opt =>
      opt.setName("command").setDescription("The command to run (without /)").setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("servers")
    .setDescription("List all servers your API key can access"),

  new SlashCommandBuilder()
    .setName("console")
    .setDescription("Show the last few lines from the server console")
    .addIntegerOption(opt =>
      opt.setName("lines").setDescription("Number of lines to show (default: 15)").setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("backup")
    .setDescription("Manage server backups")
    .addSubcommand(sub =>
      sub.setName("list").setDescription("List all available backups")
    )
    .addSubcommand(sub =>
      sub.setName("create")
        .setDescription("Create a new server backup")
        .addStringOption(opt => opt.setName("name").setDescription("Optional name for the backup"))
    ),

].map(cmd => cmd.toJSON());

// ─── REGISTER COMMANDS ─────────────────────────────────────────────────────
async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);
  console.log("📡 Registering slash commands...");
  await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
  console.log("✅ Slash commands registered!");
}

// ─── STATUS COLORS ─────────────────────────────────────────────────────────
const STATUS_MAP = {
  running:   { label: "🟢 Online",   color: 0x57F287 },
  starting:  { label: "🟡 Starting",  color: 0xFEE75C },
  stopping:  { label: "🔴 Stopping",  color: 0xED4245 },
  offline:   { label: "⚫ Offline",   color: 0x555555 },
};

// ─── BOT CLIENT ────────────────────────────────────────────────────────────
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  await interaction.deferReply();

  const { commandName } = interaction;

  try {
    // ── /status ──────────────────────────────────────────────────────────
    if (commandName === "status") {
      requireServerId();
      // Run API calls in parallel for a small performance boost
      const [resources, details] = await Promise.all([
        ptero("GET", `/servers/${SERVER_ID}/resources`),
        ptero("GET", `/servers/${SERVER_ID}`)
      ]);

      const attr = resources.attributes;
      const statusInfo = STATUS_MAP[attr.current_state] ?? { label: `❓ ${attr.current_state}`, color: 0x99AAB5 };

      const embed = new EmbedBuilder()
        .setTitle(`🖥️ ${details.attributes.name}`)
        .setColor(statusInfo.color)
        .addFields(
          { name: "Status", value: statusInfo.label, inline: true },
          { name: "Players", value: `${attr.resources.players ?? 0} / ${details.attributes.limits.connections || "N/A"}`, inline: true },
          { name: "Server ID", value: `\`${SERVER_ID}\``, inline: false },
          { name: "CPU", value: `${attr.resources.cpu_absolute.toFixed(2)}%`, inline: true },
          { name: "RAM", value: `${(attr.resources.memory_bytes / 1024 / 1024).toFixed(0)} MB`, inline: true },
          { name: "Disk", value: `${(attr.resources.disk_bytes / 1024 / 1024).toFixed(0)} MB`, inline: true },
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    }

    // ── /start ────────────────────────────────────────────────────────────
    else if (commandName === "start") {
      requireServerId();
      await sendPowerAction("start");
      const embed = new EmbedBuilder().setColor(0x57F287).setDescription("✅ **Start** command sent to the server.");
      await interaction.editReply({ embeds: [embed] });
    }

    // ── /stop ─────────────────────────────────────────────────────────────
    else if (commandName === "stop") {
      requireServerId();
      await sendPowerAction("stop");
      const embed = new EmbedBuilder().setColor(0xED4245).setDescription("🛑 **Stop** command sent to the server.");
      await interaction.editReply({ embeds: [embed] });
    }

    // ── /restart ──────────────────────────────────────────────────────────
    else if (commandName === "restart") {
      requireServerId();
      await sendPowerAction("restart");
      const embed = new EmbedBuilder().setColor(0xFEE75C).setDescription("🔄 **Restart** command sent to the server.");
      await interaction.editReply({ embeds: [embed] });
    }

    // ── /kill ─────────────────────────────────────────────────────────────
    else if (commandName === "kill") {
      requireServerId();
      await sendPowerAction("kill");
      const embed = new EmbedBuilder().setColor(0x2f3136).setDescription("💀 **Kill** command sent to the server. The process was force-stopped.");
      await interaction.editReply({ embeds: [embed] });
    }

    // ── /cmd ──────────────────────────────────────────────────────────────
    else if (commandName === "cmd") {
      requireServerId();
      const command = interaction.options.getString("command");
      await ptero("POST", `/servers/${SERVER_ID}/command`, { command });
      const embed = new EmbedBuilder().setColor(0x5865F2).setDescription(`✅ Ran command: \`${command}\``);
      await interaction.editReply({ embeds: [embed] });
    }

    // ── /servers ──────────────────────────────────────────────────────────
    else if (commandName === "servers") {
      const data = await ptero("GET", ""); // Endpoint for listing servers is /api/client
      const serverList = data.data;

      if (!serverList.length) {
        return interaction.editReply("No servers found for your API key.");
      }

      const embed = new EmbedBuilder()
        .setTitle("📋 All Pterodactyl Servers")
        .setColor(0x5865F2)
        .setDescription(
          serverList.map((s, i) => {
            const attr = s.attributes;
            return `**${i + 1}. ${attr.name}**\n\`${attr.identifier}\``;
          }).join("\n\n")
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    }

    // ── /console ──────────────────────────────────────────────────────────
    else if (commandName === "console") {
      requireServerId();
      const linesToShow = interaction.options.getInteger("lines") ?? 15;

      // The /files/contents endpoint only returns the beginning of a file.
      // To get the end, we must get a download URL and fetch the entire file.
      const downloadData = await ptero("GET", `/servers/${SERVER_ID}/files/download?file=logs/latest.log`);
      const downloadUrl = downloadData.attributes.url;

      // Fetch the full log content from the temporary URL
      const logRes = await fetch(downloadUrl);
      if (!logRes.ok) {
        throw new Error(`Failed to download log file: ${logRes.status} ${logRes.statusText}`);
      }
      const logContent = await logRes.text();

      // Process the text to get the last N non-empty lines
      const logLines = logContent.split("\n").filter(line => line.trim() !== '');

      // Build the output string from the end, respecting Discord's character limit.
      const linesToDisplay = logLines.slice(-linesToShow);
      let output = "";
      const limit = 4000; // Leave room for markdown formatting

      for (let i = linesToDisplay.length - 1; i >= 0; i--) {
        const line = linesToDisplay[i];
        const nextOutput = line + (output ? "\n" + output : "");
        if (nextOutput.length > limit) {
          output = "...\n" + output;
          break;
        }
        output = nextOutput;
      }

      const embed = new EmbedBuilder()
        .setTitle("📄 Server Console")
        .setColor(0x2B2D31) // A dark color for a console look
        .setDescription(output ? `\`\`\`log\n${output}\n\`\`\`` : "Log file appears to be empty.")
        .setFooter({ text: `Showing last ${linesToShow} lines of logs/latest.log` })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    }

    // ── /backup ───────────────────────────────────────────────────────────
    else if (commandName === "backup") {
      requireServerId();
      const subcommand = interaction.options.getSubcommand();

      if (subcommand === "list") {
        const backupData = await ptero("GET", `/servers/${SERVER_ID}/backups`);
        const backups = backupData.data;

        if (!backups.length) {
          return interaction.editReply({ embeds: [new EmbedBuilder().setColor(0x5865F2).setDescription("No backups found.")] });
        }

        const embed = new EmbedBuilder()
          .setTitle("🗄️ Server Backups")
          .setColor(0x5865F2)
          .setDescription(
            backups.map(b => {
              const attr = b.attributes;
              const size = (attr.bytes / 1024 / 1024).toFixed(2);
              const date = new Date(attr.created_at).toLocaleString();
              return `**${attr.name}** (${size} MB)\n*Created: ${date}*\n\`${attr.uuid}\``;
            }).join("\n\n")
          )
          .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
      }
      else if (subcommand === "create") {
        const backupName = interaction.options.getString("name");
        await ptero("POST", `/servers/${SERVER_ID}/backups`, { name: backupName });
        const embed = new EmbedBuilder().setColor(0x57F287).setDescription("✅ Backup creation started in the background.");
        await interaction.editReply({ embeds: [embed] });
      }
    }

  } catch (err) {
    console.error(`[ERROR] /${commandName}:`, err.message);
    await interaction.editReply(`❌ Error: \`${err.message}\``);
  }
});

// ─── LAUNCH ────────────────────────────────────────────────────────────────
(async () => {
  try {
    // Check for required env vars
    const required = ["DISCORD_TOKEN", "CLIENT_ID", "GUILD_ID", "PTERO_HOST", "PTERO_API_KEY"];
    for (const key of required) {
      if (!process.env[key]) {
        console.error(`[FATAL] Missing required environment variable: ${key}. Please check your .env file.`);
        process.exit(1);
      }
    }

    await registerCommands();
    await client.login(DISCORD_TOKEN);
  } catch (err) {
    console.error("[FATAL] An error occurred during bot startup:", err.message);
    if (err.code === 50001) {
      console.error("-> This 'Missing Access' error means the bot hasn't been invited with the correct permissions. Please re-invite it using the OAuth2 URL from the Discord Developer Portal, ensuring you grant the 'applications.commands' scope.");
    }
    process.exit(1);
  }
})();
