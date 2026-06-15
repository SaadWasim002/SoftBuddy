const { SlashCommandBuilder } = require("discord.js");
const mcss                    = require("../services/mcss");
const { successEmbed }        = require("../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("restart")
    .setDescription("Restart the Minecraft server"),

  async execute(interaction) {
    await mcss.sendPowerAction(mcss.PowerAction.RESTART);
    await interaction.editReply({
      embeds: [successEmbed("Server Restarting", "The restart signal has been sent.")],
    });
  },
};
