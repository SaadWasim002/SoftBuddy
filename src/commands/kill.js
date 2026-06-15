const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { sendPowerAction, requireServerId } = require("../services/ptero.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kill")
    .setDescription("Force kill the Minecraft server"),

  async execute(interaction) {
    console.log(`[COMMAND] /kill executed by ${interaction.user.tag}`);
    requireServerId();
    await sendPowerAction("kill");
    const embed = new EmbedBuilder().setColor(0x2f3136).setDescription("💀 **Kill** command sent to the server. The process was force-stopped.");
    await interaction.editReply({ embeds: [embed] });
  },
};