require('dotenv').config();
const Pool = require("pg").Pool;

const pool = new Pool({
  user: `${PGUSER}`,
  password: `${PGPASSWORD}`,
  host: `${PGHOST}`,
  port: `${PGPORT}`,
  database: `${PGDATABASE}`
});

module.exports = pool;
