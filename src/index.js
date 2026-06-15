const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
require("dotenv").config({ path: path.join(__dirname, '..', '.env')});

const { DISCORD_TOKEN } = process.env;

// Validate environment variables
const required = ["DISCORD_TOKEN", "CLIENT_ID", "GUILD_ID", "PTERO_HOST", "PTERO_API_KEY"];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`[FATAL] Missing required environment variable: ${key}. Please check your .env file.`);
    process.exit(1);
  }
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

client.once("ready", () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  await interaction.deferReply();

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`[ERROR] /${interaction.commandName}:`, error.message);
    await interaction.editReply({ content: `❌ Error: \`${error.message}\``, ephemeral: true });
  }
});

client.login(DISCORD_TOKEN);