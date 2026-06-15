const { SlashCommandBuilder } = require("discord.js");
const mcss                    = require("../services/mcss");
const { ServerStatus, infoEmbed } = require("../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("Get the current Minecraft server status"),

  async execute(interaction) {
    const server = await mcss.getServer();
    const st     = ServerStatus[server.status] ?? { label: "❓ Unknown", color: 0x99AAB5 };

    const embed = infoEmbed(`🖥️  ${server.name}`)
      .setColor(st.color)
      .addFields(
        { name: "Status",      value: st.label,                  inline: true },
        { name: "Description", value: server.description || "—", inline: true },
      );

    await interaction.editReply({ embeds: [embed] });
  },
};
