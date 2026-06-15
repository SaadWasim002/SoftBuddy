const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { ptero, requireServerId } = require("../services/ptero.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cmd")
    .setDescription("Run a console command on the server")
    .addStringOption(opt =>
      opt.setName("command").setDescription("The command to run (without /)").setRequired(true)
    ),

  async execute(interaction) {
    requireServerId();
    const command = interaction.options.getString("command");
    console.log(`[COMMAND] /cmd executed by ${interaction.user.tag} (command: ${command})`);
    await ptero("POST", `/servers/${process.env.PTERO_SERVER_ID}/command`, { command });
    const embed = new EmbedBuilder().setColor(0x5865F2).setDescription(`✅ Ran command: \`${command}\``);
    await interaction.editReply({ embeds: [embed] });
  },
};