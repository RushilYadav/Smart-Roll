import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',       // your postgres user
  host: 'localhost',      // local machine
  database: 'SmartRoll', // the database you just created
  password: 'Rushkush180206!', // the postgres password
  port: 5432,             // default
});

export default pool;
