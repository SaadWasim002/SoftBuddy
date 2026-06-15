const { Client, GatewayIntentBits, Collection } = require("discord.js");
const config                                     = require("./config");
const logger                                     = require("./utils/logger");
const { loadCommands }                           = require("./services/commandLoader");
const { errorEmbed }                             = require("./utils/embeds");

// ── Client setup ────────────────────────────────────────────────────────────
const client      = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands   = new Collection();

// ── Load all commands ────────────────────────────────────────────────────────
loadCommands(client);

// ── Ready ───────────────────────────────────────────────────────────────────
client.once("ready", () => {
  logger.info(`🤖 Logged in as ${client.user.tag}`);
  logger.info(`📡 Listening for interactions in guild ${config.discord.guildId}`);
});

// ── Handle interactions ─────────────────────────────────────────────────────
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await interaction.deferReply();
    await command.execute(interaction);
  } catch (err) {
    logger.error(`Error in /${interaction.commandName}: ${err.message}`, err);

    const reply = { embeds: [errorEmbed(err.message)], ephemeral: true };

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply(reply);
    } else {
      await interaction.reply(reply);
    }
  }
});

// ── Handle process errors ────────────────────────────────────────────────────
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled rejection:", err);
});

// ── Login ───────────────────────────────────────────────────────────────────
client.login(config.discord.token);
