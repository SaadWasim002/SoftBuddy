require("dotenv").config();

const required = [
  "DISCORD_TOKEN",
  "CLIENT_ID",
  "GUILD_ID",
  "MCSS_HOST",
  "MCSS_API_KEY",
  "MCSS_SERVER_ID",
];

for (const key of required) {
  if (!process.env[key]) {
    console.error(`[Config] Missing required env variable: ${key}`);
    process.exit(1);
  }
}

module.exports = {
  discord: {
    token:    process.env.DISCORD_TOKEN,
    clientId: process.env.CLIENT_ID,
    guildId:  process.env.GUILD_ID,
  },
  mcss: {
    host:     process.env.MCSS_HOST,
    apiKey:   process.env.MCSS_API_KEY,
    serverId: process.env.MCSS_SERVER_ID,
  },
};
