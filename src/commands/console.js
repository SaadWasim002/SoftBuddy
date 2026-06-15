const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { ptero, requireServerId } = require("../services/ptero.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("console")
    .setDescription("Show the last few lines from the server console")
    .addIntegerOption(opt =>
      opt.setName("lines").setDescription("Number of lines to show (default: 15)").setRequired(false)
    ),

  async execute(interaction) {
    requireServerId();
    const linesToShow = interaction.options.getInteger("lines") ?? 15;
    console.log(`[COMMAND] /console executed by ${interaction.user.tag} (lines: ${linesToShow})`);

    const downloadData = await ptero("GET", `/servers/${process.env.PTERO_SERVER_ID}/files/download?file=logs/latest.log`);
    const downloadUrl = downloadData.attributes.url;

    const logRes = await fetch(downloadUrl);
    if (!logRes.ok) {
      throw new Error(`Failed to download log file: ${logRes.status} ${logRes.statusText}`);
    }
    const logContent = await logRes.text();

    const logLines = logContent.split("\n").filter(line => line.trim() !== '');
    const linesToDisplay = logLines.slice(-linesToShow);
    let output = "";
    const limit = 4000;

    for (let i = linesToDisplay.length - 1; i >= 0; i--) {
      const line = linesToDisplay[i];
      const nextOutput = line + (output ? "\n" + output : "");
      if (nextOutput.length > limit) {
        output = "...\n" + output;
        break;
      }
      output = nextOutput;
    }

    const embed = new EmbedBuilder().setTitle("📄 Server Console").setColor(0x2B2D31).setDescription(output ? `\`\`\`log\n${output}\n\`\`\`` : "Log file appears to be empty.").setFooter({ text: `Showing last ${linesToShow} lines of logs/latest.log` }).setTimestamp();
    await interaction.editReply({ embeds: [embed] });
  },
};