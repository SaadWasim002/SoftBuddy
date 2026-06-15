const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { sendPowerAction, requireServerId } = require("../services/ptero.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop the Minecraft server"),

  async execute(interaction) {
    requireServerId();
    await sendPowerAction("stop");
    const embed = new EmbedBuilder().setColor(0xED4245).setDescription("🛑 **Stop** command sent to the server.");
    await interaction.editReply({ embeds: [embed] });
  },
};