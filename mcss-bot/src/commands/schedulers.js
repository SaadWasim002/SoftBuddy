const { SlashCommandBuilder } = require("discord.js");
const mcss                    = require("../services/mcss");
const { infoEmbed }           = require("../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("schedulers")
    .setDescription("List all scheduled tasks on the server"),

  async execute(interaction) {
    const data       = await mcss.listSchedulers();
    const schedulers = data.schedulers ?? data;

    if (!schedulers?.length) {
      return interaction.editReply("No schedulers configured.");
    }

    const lines = schedulers.map((s, i) =>
      `**${i + 1}. ${s.name}**\nID: \`${s.schedulerId}\` — ${s.enabled ? "✅ Enabled" : "❌ Disabled"}`
    );

    const embed = infoEmbed("🕐  Scheduled Tasks")
      .setDescription(lines.join("\n\n"));

    await interaction.editReply({ embeds: [embed] });
  },
};
