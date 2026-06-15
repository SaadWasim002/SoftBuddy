const { SlashCommandBuilder } = require("discord.js");
const mcss                    = require("../services/mcss");
const { successEmbed }        = require("../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop the Minecraft server"),

  async execute(interaction) {
    await mcss.sendPowerAction(mcss.PowerAction.STOP);
    await interaction.editReply({
      embeds: [successEmbed("Server Stopping", "The stop signal has been sent.")],
    });
  },
};
