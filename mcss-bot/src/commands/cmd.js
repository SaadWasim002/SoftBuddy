const { SlashCommandBuilder } = require("discord.js");
const mcss                    = require("../services/mcss");
const { successEmbed }        = require("../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cmd")
    .setDescription("Run a command in the Minecraft server console")
    .addStringOption(opt =>
      opt
        .setName("command")
        .setDescription("The command to run (without the leading /). E.g: say Hello!")
        .setRequired(true)
    ),

  async execute(interaction) {
    const command = interaction.options.getString("command");
    await mcss.sendCommand(command);
    await interaction.editReply({
      embeds: [successEmbed("Command Sent", `\`${command}\` was sent to the console.`)],
    });
  },
};
