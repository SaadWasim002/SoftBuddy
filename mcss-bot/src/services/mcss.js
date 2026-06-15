const config  = require("../config");
const logger  = require("../utils/logger");

const BASE_URL = `${config.mcss.host}/api/v2`;
const HEADERS  = {
  "apikey":       config.mcss.apiKey,
  "Content-Type": "application/json",
};

// Power action codes
const PowerAction = {
  STOP:    0,
  START:   1,
  RESTART: 2,
  KILL:    3,
};

async function request(method, path, body = null) {
  const url = `${BASE_URL}${path}`;
  logger.info(`MCSS ${method} ${path}`);

  const res = await fetch(url, {
    method,
    headers: HEADERS,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`MCSS ${res.status} on ${method} ${path}: ${text}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// ── Server ──────────────────────────────────────────────────────────────────

function getServer(serverId = config.mcss.serverId) {
  return request("GET", `/servers/${serverId}`);
}

function listServers() {
  return request("GET", "/servers");
}

function getStats(serverId = config.mcss.serverId) {
  return request("GET", `/servers/${serverId}/stats/latest`);
}

// ── Power ───────────────────────────────────────────────────────────────────

function sendPowerAction(action, serverId = config.mcss.serverId) {
  return request("POST", `/servers/${serverId}/power/${action}`);
}

// ── Console ─────────────────────────────────────────────────────────────────

function sendCommand(command, serverId = config.mcss.serverId) {
  return request("POST", `/servers/${serverId}/console`, { command });
}

// ── Schedulers ──────────────────────────────────────────────────────────────

function listSchedulers(serverId = config.mcss.serverId) {
  return request("GET", `/servers/${serverId}/schedulers`);
}

// ── Backups ─────────────────────────────────────────────────────────────────

function listBackups(serverId = config.mcss.serverId) {
  return request("GET", `/servers/${serverId}/backups`);
}

function runBackup(backupId, serverId = config.mcss.serverId) {
  return request("POST", `/servers/${serverId}/backups/${backupId}/run`);
}

module.exports = {
  PowerAction,
  getServer,
  listServers,
  getStats,
  sendPowerAction,
  sendCommand,
  listSchedulers,
  listBackups,
  runBackup,
};
