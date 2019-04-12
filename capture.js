'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { oneLine } = require('common-tags');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(os.homedir(), '.config', 'deluge-events');
const db = new sqlite3.Database(path.join(dbPath, 'events.db'));

module.exports = function capture(type, args = []) {
  if (!type) {
    console.error('event type not specified');
    return process.exit(1);
  }
  if (args.length !== 3) {
    console.error('incorrect argument length: ' + args.length);
    return process.exit(1);
  }
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath);
  }
  db.serialize(() => {
    db.run(oneLine`
      CREATE TABLE IF NOT EXISTS event (
        event_type TEXT,
        event_date INTEGER,
        torrent_id TEXT,
        torrent_hash TEXT,
        torrent_filename TEXT
      )
    `);
    const values = [type, Date.now(), ...args];
    db.run('INSERT INTO event VALUES (?, ?, ?, ?, ?)', values);
  });
  db.close();
};
