require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const postgres = require('postgres');

const sqlFile = fs.readFileSync('seed_products.sql', 'utf8');
const sql = postgres(process.env.DATABASE_URL);

async function run() {
  try {
    console.log('Running seed_products.sql...');
    // postgres.js handles multiple queries if we use the simple string template `sql.unsafe`
    await sql.unsafe(sqlFile);
    console.log('Database updated successfully!');
  } catch (error) {
    console.error('Error executing SQL:', error);
  } finally {
    await sql.end();
  }
}

run();
