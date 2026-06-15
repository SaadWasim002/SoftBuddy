const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { ptero, requireServerId } = require("../services/ptero.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("backup")
    .setDescription("Manage server backups")
    .addSubcommand(sub =>
      sub.setName("list").setDescription("List all available backups")
    )
    .addSubcommand(sub =>
      sub.setName("create")
        .setDescription("Create a new server backup")
        .addStringOption(opt => opt.setName("name").setDescription("Optional name for the backup"))
    ),

  async execute(interaction) {
    requireServerId();
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "list") {
      const backupData = await ptero("GET", `/servers/${process.env.PTERO_SERVER_ID}/backups`);
      const backups = backupData.data;

      if (!backups.length) {
        return interaction.editReply({ embeds: [new EmbedBuilder().setColor(0x5865F2).setDescription("No backups found.")] });
      }

      const embed = new EmbedBuilder().setTitle("🗄️ Server Backups").setColor(0x5865F2).setDescription(backups.map(b => {
        const attr = b.attributes;
        const size = (attr.bytes / 1024 / 1024).toFixed(2);
        const date = new Date(attr.created_at).toLocaleString();
        return `**${attr.name}** (${size} MB)\n*Created: ${date}*\n\`${attr.uuid}\``;
      }).join("\n\n")).setTimestamp();
      await interaction.editReply({ embeds: [embed] });
    } else if (subcommand === "create") {
      const backupName = interaction.options.getString("name");
      await ptero("POST", `/servers/${process.env.PTERO_SERVER_ID}/backups`, { name: backupName });
      const embed = new EmbedBuilder().setColor(0x57F287).setDescription("✅ Backup creation started in the background.");
      await interaction.editReply({ embeds: [embed] });
    }
  },
};