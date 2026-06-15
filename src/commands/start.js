const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { sendPowerAction, requireServerId } = require("../services/ptero.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("Start the Minecraft server"),

  async execute(interaction) {
    requireServerId();
    await sendPowerAction("start");
    const embed = new EmbedBuilder().setColor(0x57F287).setDescription("✅ **Start** command sent to the server.");
    await interaction.editReply({ embeds: [embed] });
  },
};