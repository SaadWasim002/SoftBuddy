const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { ptero } = require("../services/ptero.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("servers")
    .setDescription("List all servers your API key can access"),

  async execute(interaction) {
    console.log(`[COMMAND] /servers executed by ${interaction.user.tag}`);
    const data = await ptero("GET", "");
    const serverList = data.data;

    if (!serverList.length) {
      return interaction.editReply("No servers found for your API key.");
    }

    const embed = new EmbedBuilder().setTitle("📋 All Pterodactyl Servers").setColor(0x5865F2).setDescription(serverList.map((s, i) => {
      const attr = s.attributes;
      return `**${i + 1}. ${attr.name}**\n\`${attr.identifier}\``;
    }).join("\n\n")).setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};