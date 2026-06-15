const { PTERO_HOST, PTERO_API_KEY, PTERO_SERVER_ID: SERVER_ID } = process.env;

// Pterodactyl API Helper
async function ptero(method, endpoint, body = null) {
  const url = `${PTERO_HOST}/api/client${endpoint}`;

  const res = await fetch(url, {
    method,
    headers: {
      "Authorization": `Bearer ${PTERO_API_KEY}`,
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : null,
  });

  if (res.status === 204) {
    return null;
  }

  const contentType = res.headers.get("content-type");

  if (!res.ok) {
    let errorJson;
    if (contentType && contentType.includes("application/json")) {
      errorJson = await res.json();
    }
    const error = errorJson?.errors?.[0]?.detail || `HTTP error ${res.status} - ${res.statusText}`;
    throw new Error(`Pterodactyl API Error: ${error}`);
  }

  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }
  return res.text();
}

// Power action helper
async function sendPowerAction(action) {
  return ptero("POST", `/servers/${SERVER_ID}/power`, { signal: action });
}

// Server ID check helper
function requireServerId() {
  if (!SERVER_ID || SERVER_ID === "your_pterodactyl_server_id") {
    throw new Error("`PTERO_SERVER_ID` is not set in your .env file. Please run `/servers` to find your server ID, then add it to your configuration and restart the bot.");
  }
}

// Status map
const STATUS_MAP = {
  running:   { label: "🟢 Online",   color: 0x57F287 },
  starting:  { label: "🟡 Starting",  color: 0xFEE75C },
  stopping:  { label: "🔴 Stopping",  color: 0xED4245 },
  offline:   { label: "⚫ Offline",   color: 0x555555 },
};

module.exports = { ptero, sendPowerAction, requireServerId, STATUS_MAP };