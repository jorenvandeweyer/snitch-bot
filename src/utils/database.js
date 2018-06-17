const mysql = require("mysql");
const Logger = require("./logger");

const { mysql_host, mysql_user, mysql_pswd, mysql_db} = require("../../config.json");

const pool = mysql.createPool({
    host: mysql_host,
    user: mysql_user,
    password: mysql_pswd,
    database: mysql_db,
    charset : 'utf8mb4'
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
            if (err) return reject(err);
            resolve(result);

            connection.release();
        });
    }).catch((err) => {
        Logger.error(err);
    });
}

async function setup() {
    let result = await query("CREATE DATABASE IF NOT EXISTS listen_bot;");
    if (result && !result.warningCount) Logger.info("[db]Created Database \"listen_bot\"");

    result = await query("CREATE TABLE IF NOT EXISTS guilds (`guild_id` INT UNSIGNED AUTO_INCREMENT, `guild` VARCHAR(32) UNIQUE, PRIMARY KEY (`guild_id`))");
    if (result && !result.warningCount) Logger.info("[db]Created table \"guilds\"");

    result = await query("CREATE TABLE IF NOT EXISTS users (`user_id` INT UNSIGNED AUTO_INCREMENT, `user` VARCHAR(32) UNIQUE, PRIMARY KEY (`user_id`))");
    if (result && !result.warningCount) Logger.info("[db]Created table \"users\"");

    result = await query("CREATE TABLE IF NOT EXISTS keywords (`keyword_id` INT UNSIGNED AUTO_INCREMENT, `keyword` VARCHAR(64) UNIQUE, PRIMARY KEY (`keyword_id`))");
    if (result && !result.warningCount) Logger.info("[db]Created table \"keywords\"");

    result = await query("CREATE TABLE IF NOT EXISTS triggers (`trigger_id` INT UNSIGNED AUTO_INCREMENT, `guild_id` INT UNSIGNED, `user_id` INT UNSIGNED, `keyword_id` INT UNSIGNED, FOREIGN KEY (`guild_id`) REFERENCES guilds(`guild_id`) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY (`user_id`) REFERENCES users(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY (`keyword_id`) REFERENCES keywords(`keyword_id`) ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY (`trigger_id`), UNIQUE `combined_index` (`guild_id`, `user_id`, `keyword_id`))");
    if (result && !result.warningCount) Logger.info("[db]Created table \"triggers\"");

}

async function getUser(user) {
    let result = await query("SELECT * FROM users WHERE user = ?", [user]);

    if (result && result.length) {
        return result[0].user_id;
    } else {
        await query("INSERT INTO users (`user`) VALUES (?)", [user]);
        return getUser(user);
    }
}

async function getGuild(guild) {
    let result = await query("SELECT * FROM guilds WHERE guild = ?", [guild]);

    if (result && result.length) {
        return result[0].guild_id;
    } else {
        await query("INSERT INTO guilds (`guild`) VALUES (?)", [guild]);
        return getGuild(guild);
    }
}

async function getKeyword(keyword) {
    let result = await query("SELECT * FROM keywords WHERE keyword = ?", [keyword]);

    if (result && result.length) {
        return result[0].keyword_id;
    } else {
        await query("INSERT INTO keywords (`keyword`) VALUES (?)", [keyword]);
        return getKeyword(keyword);
    }
}

async function setTrigger(guild, user, keyword) {
    const guild_id = await getGuild(guild);
    const user_id = await getUser(user);
    const keyword_id = await getKeyword(keyword);

    return await query("INSERT INTO triggers (`guild_id`, `user_id`, `keyword_id`) VALUES (?, ?, ?)", [guild_id, user_id, keyword_id]);
}

async function getTrigger(guild, user) {
    const guild_id = await getGuild(guild);
    const user_id = await getUser(user);

    return await query("SELECT keywords.keyword FROM triggers INNER JOIN keywords ON keywords.keyword_id = triggers.keyword_id WHERE guild_id = ? AND user_id = ?", [guild_id, user_id]);
}

async function delTrigger(guild, user, keyword) {
    const guild_id = await getGuild(guild);
    const user_id = await getUser(user);
    const keyword_id = await getKeyword(keyword);

    return await query("DELETE FROM triggers WHERE guild_id = ? AND user_id = ? AND keyword_id = ?", [guild_id, user_id, keyword_id]);
}

async function allTriggers() {
    return await query("SELECT keywords.keyword, users.user, guilds.guild FROM triggers INNER JOIN keywords ON keywords.keyword_id = triggers.keyword_id INNER JOIN users ON users.user_id = triggers.user_id INNER JOIN guilds ON guilds.guild_id = triggers.guild_id");
}

setup();

module.exports = {
    setTrigger,
    getTrigger,
    delTrigger,
    allTriggers,
};
