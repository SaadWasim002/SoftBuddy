const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { sendPowerAction, requireServerId } = require("../services/ptero.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("restart")
    .setDescription("Restart the Minecraft server"),

  async execute(interaction) {
    console.log(`[COMMAND] /restart executed by ${interaction.user.tag}`);
    requireServerId();
    await sendPowerAction("restart");
    const embed = new EmbedBuilder().setColor(0xFEE75C).setDescription("🔄 **Restart** command sent to the server.");
    await interaction.editReply({ embeds: [embed] });
  },
};