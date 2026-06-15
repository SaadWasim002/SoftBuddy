const { EmbedBuilder } = require("discord.js");

const Colors = {
  SUCCESS: 0x57F287,  // green
  DANGER:  0xED4245,  // red
  WARNING: 0xFEE75C,  // yellow
  INFO:    0x5865F2,  // blurple
  OFFLINE: 0x555555,  // grey
};

const ServerStatus = {
  0: { label: "⚫ Offline",  color: Colors.OFFLINE },
  1: { label: "🟢 Online",   color: Colors.SUCCESS },
  2: { label: "🟡 Starting", color: Colors.WARNING },
  3: { label: "🔴 Stopping", color: Colors.DANGER },
};

function successEmbed(title, description) {
  return new EmbedBuilder()
    .setColor(Colors.SUCCESS)
    .setTitle(`✅ ${title}`)
    .setDescription(description)
    .setTimestamp();
}

function errorEmbed(message) {
  return new EmbedBuilder()
    .setColor(Colors.DANGER)
    .setTitle("❌ Error")
    .setDescription(`\`\`\`${message}\`\`\``)
    .setTimestamp();
}

function infoEmbed(title) {
  return new EmbedBuilder()
    .setColor(Colors.INFO)
    .setTitle(title)
    .setTimestamp();
}

module.exports = { Colors, ServerStatus, successEmbed, errorEmbed, infoEmbed };
