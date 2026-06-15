const { SlashCommandBuilder } = require("discord.js");
const mcss                    = require("../services/mcss");
const { EmbedBuilder }        = require("discord.js");
const { Colors }              = require("../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kill")
    .setDescription("Force-kill the Minecraft server process (use as a last resort)"),

  async execute(interaction) {
    await mcss.sendPowerAction(mcss.PowerAction.KILL);

    const embed = new EmbedBuilder()
      .setColor(Colors.DANGER)
      .setTitle("💀  Server Killed")
      .setDescription("The server process was force-terminated. World data may not have been saved.")
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};
