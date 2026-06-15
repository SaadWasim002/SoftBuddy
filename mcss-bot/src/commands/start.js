const { SlashCommandBuilder } = require("discord.js");
const mcss                    = require("../services/mcss");
const { successEmbed }        = require("../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("Start the Minecraft server"),

  async execute(interaction) {
    await mcss.sendPowerAction(mcss.PowerAction.START);
    await interaction.editReply({
      embeds: [successEmbed("Server Starting", "The start signal has been sent. Give it a moment to come online.")],
    });
  },
};
