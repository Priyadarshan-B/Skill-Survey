const mysql = require("mysql2");
const path = require("path");
const util = require("util");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const createDBConnection = () => {
  const dbConnection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000, 
    acquireTimeout: 10000, 
  });

  const pool = dbConnection.promise();

  dbConnection.on('error', (err) => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error("MySQL connection was closed.");
    } else if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error("MySQL has too many connections.");
    } else if (err.code === 'ECONNREFUSED') {
      console.error("MySQL connection was refused.");
    } else {
      console.error("MySQL error:", err);
    }
  });

  dbConnection.on('acquire', (connection) => {
    console.log(`Connection ${connection.threadId} acquired`);
  });

  dbConnection.on('release', (connection) => {
    console.log(`Connection ${connection.threadId} released`);
  });

  return pool;
};

const handleDisconnect = (retries = 5) => {
  const pool = createDBConnection();

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to the database:", err);
      
      if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNREFUSED') {
        if (retries > 0) {
          console.log(`Reconnecting to MySQL... Retries left: ${retries}`);
          setTimeout(() => handleDisconnect(retries - 1), 2000);
        } else {
          console.error("All retries exhausted. Could not reconnect to MySQL.");
        }
      }
    }

    if (connection) {
      console.log("Connected to MySQL Database successfully.");
      connection.release();
    }
  });

  pool.on('error', (err) => {
    console.error("MySQL Pool Error:", err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNREFUSED') {
      console.log("Reconnecting to MySQL...");
      handleDisconnect(retries - 1);
    }
  });

  return pool;
};

const pool = handleDisconnect();

process.on('SIGINT', () => {
  pool.end((err) => {
    if (err) {
      console.error("Error during disconnection:", err);
    } else {
      console.log("MySQL pool closed.");
    }
    process.exit(0);
  });
});

module.exports = { pool };
