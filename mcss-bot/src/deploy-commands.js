const { REST, Routes } = require("discord.js");
const fs               = require("fs");
const path             = require("path");
const config           = require("./config");
const logger           = require("./utils/logger");

const commands = [];
const commandsPath = path.join(__dirname, "commands");
const files = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

for (const file of files) {
  const command = require(path.join(commandsPath, file));
  if (command.data) {
    commands.push(command.data.toJSON());
    logger.info(`Queued: /${command.data.name}`);
  }
}

const rest = new REST({ version: "10" }).setToken(config.discord.token);

(async () => {
  try {
    logger.info(`Deploying ${commands.length} slash commands to guild ${config.discord.guildId}...`);

    await rest.put(
      Routes.applicationGuildCommands(config.discord.clientId, config.discord.guildId),
      { body: commands }
    );

    logger.info("✅ All slash commands deployed successfully.");
  } catch (err) {
    logger.error("Failed to deploy commands:", err);
    process.exit(1);
  }
})();
