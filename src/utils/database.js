const mysql = require("mysql");
const Logger = require("./logger");

const { mysql_host, mysql_user, mysql_pswd, mysql_db} = require("../../config.json");

const pool = mysql.createPool({
    host: mysql_host,
    user: mysql_user,
    password: mysql_pswd,
    database: mysql_db
});

function getConnection() {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) return reject(err);
            resolve(connection);
        });
    }).catch((err) => {
        Logger.error(err);
    });
}

function query(query, options) {
    return new Promise(async (resolve, reject) => {
        let connection = await getConnection();

        if (!connection) return reject("[-]Couldn't create database connection.");

        connection.query(query, options, (err, result) => {
            connection.release();

            if (err) return reject(err);
            resolve(result);
        });
    }).catch((err) => {
        Logger.error(err);
    });
}

function setup() {
    // let result = await query("CREATE DATABASE IF NOT EXISTS listen_bot;");
    if (result && !result.warningCount) Logger.info("[db]Created Database \"listen_bot\"");
}

module.exports = {

};
