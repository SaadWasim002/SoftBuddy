const { SlashCommandBuilder } = require("discord.js");
const mcss                    = require("../services/mcss");
const { infoEmbed }           = require("../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("players")
    .setDescription("Show online players, TPS, CPU and RAM usage"),

  async execute(interaction) {
    const stats = await mcss.getStats();

    const embed = infoEmbed("👥  Player Stats")
      .addFields(
        { name: "Online",  value: `${stats.playerCount    ?? 0}`,    inline: true },
        { name: "Max",     value: `${stats.maxPlayerCount ?? "?"}`,  inline: true },
        { name: "TPS",     value: `${stats.tps            ?? "?"}`,  inline: true },
        { name: "CPU",     value: `${stats.cpuUsage       ?? "?"}%`, inline: true },
        { name: "RAM",     value: `${stats.memoryUsage    ?? "?"} MB`, inline: true },
      );

    await interaction.editReply({ embeds: [embed] });
  },
};
