const { SlashCommandBuilder } = require("discord.js");
const mcss                    = require("../services/mcss");
const { infoEmbed, successEmbed } = require("../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("backups")
    .setDescription("Manage server backups")
    .addSubcommand(sub =>
      sub.setName("list").setDescription("List all backups")
    )
    .addSubcommand(sub =>
      sub
        .setName("run")
        .setDescription("Trigger a backup by its ID")
        .addStringOption(opt =>
          opt.setName("id").setDescription("Backup ID from /backups list").setRequired(true)
        )
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === "list") {
      const data    = await mcss.listBackups();
      const backups = data.backups ?? data;

      if (!backups?.length) {
        return interaction.editReply("No backups configured.");
      }

      const lines = backups.map((b, i) =>
        `**${i + 1}. ${b.name}**\nID: \`${b.backupId}\` — ${b.enabled ? "✅ Enabled" : "❌ Disabled"}`
      );

      const embed = infoEmbed("💾  Server Backups")
        .setDescription(lines.join("\n\n"));

      await interaction.editReply({ embeds: [embed] });
    }

    if (sub === "run") {
      const id = interaction.options.getString("id");
      await mcss.runBackup(id);
      await interaction.editReply({
        embeds: [successEmbed("Backup Started", `Backup \`${id}\` has been triggered.`)],
      });
    }
  },
};
