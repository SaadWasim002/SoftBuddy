const { SlashCommandBuilder } = require("discord.js");
const mcss                    = require("../services/mcss");
const { infoEmbed }           = require("../utils/embeds");
const { ServerStatus }        = require("../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("servers")
    .setDescription("List all servers managed by MCSS"),

  async execute(interaction) {
    const data       = await mcss.listServers();
    const serverList = data.servers ?? data;

    if (!serverList?.length) {
      return interaction.editReply("No servers found in MCSS.");
    }

    const lines = serverList.map((s, i) => {
      const st = ServerStatus[s.status]?.label ?? "❓ Unknown";
      return `**${i + 1}. ${s.name}** — ${st}\n\`${s.serverId}\``;
    });

    const embed = infoEmbed("📋  All MCSS Servers")
      .setDescription(lines.join("\n\n"));

    await interaction.editReply({ embeds: [embed] });
  },
};
