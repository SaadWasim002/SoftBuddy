const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { ptero, requireServerId, STATUS_MAP } = require("../services/ptero.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("Get the Minecraft server status, players, and resource usage"),

  async execute(interaction) {
    requireServerId();
    const [resources, details] = await Promise.all([
      ptero("GET", `/servers/${process.env.PTERO_SERVER_ID}/resources`),
      ptero("GET", `/servers/${process.env.PTERO_SERVER_ID}`)
    ]);

    const attr = resources.attributes;
    const statusInfo = STATUS_MAP[attr.current_state] ?? { label: `❓ ${attr.current_state}`, color: 0x99AAB5 };

    const embed = new EmbedBuilder()
      .setTitle(`🖥️ ${details.attributes.name}`)
      .setColor(statusInfo.color)
      .addFields(
        { name: "Status", value: statusInfo.label, inline: true },
        { name: "Players", value: `${attr.resources.players ?? 0} / ${details.attributes.limits.connections || "N/A"}`, inline: true },
        { name: "Server ID", value: `\`${process.env.PTERO_SERVER_ID}\``, inline: false },
        { name: "CPU", value: `${attr.resources.cpu_absolute.toFixed(2)}%`, inline: true },
        { name: "RAM", value: `${(attr.resources.memory_bytes / 1024 / 1024).toFixed(0)} MB`, inline: true },
        { name: "Disk", value: `${(attr.resources.disk_bytes / 1024 / 1024).toFixed(0)} MB`, inline: true },
      ).setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};