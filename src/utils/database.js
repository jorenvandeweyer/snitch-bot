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

    result = await query("CREATE TABLE IF NOT EXISTS keywords (`keyword_id` INT UNSIGNED AUTO_INCREMENT, `keyword` VARCHAR(64), `regex` BOOLEAN, PRIMARY KEY (`keyword_id`), UNIQUE `combined_index` (`keyword`, `regex`))");
    if (result && !result.warningCount) Logger.info("[db]Created table \"keywords\"");

    result = await query("CREATE TABLE IF NOT EXISTS triggers (`trigger_id` INT UNSIGNED AUTO_INCREMENT, `guild_id` INT UNSIGNED, `user_id` INT UNSIGNED, `keyword_id` INT UNSIGNED, FOREIGN KEY (`guild_id`) REFERENCES guilds(`guild_id`) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY (`user_id`) REFERENCES users(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY (`keyword_id`) REFERENCES keywords(`keyword_id`) ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY (`trigger_id`), UNIQUE `combined_index` (`guild_id`, `user_id`, `keyword_id`))");
    if (result && !result.warningCount) Logger.info("[db]Created table \"triggers\"");

    result = await query("CREATE TABLE IF NOT EXISTS ignores (`ignore_id` INT UNSIGNED AUTO_INCREMENT, `guild_id` INT UNSIGNED, `user_id` INT UNSIGNED, `ignore` INT UNSIGNED, FOREIGN KEY (`guild_id`) REFERENCES guilds(`guild_id`) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY (`user_id`) REFERENCES users (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY (`ignore`) REFERENCES users (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY (`ignore_id`), UNIQUE `combined_index` (`guild_id`, `user_id`, `ignore`));");
    if (result && !result.warningCount) Logger.info("[db]Created table \"ignores\"");

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

async function getKeyword(keyword, regex=false) {
    let result = await query("SELECT * FROM keywords WHERE keyword = ? AND regex = ?", [keyword, regex]);

    if (result && result.length) {
        return result[0].keyword_id;
    } else {
        await query("INSERT INTO keywords (`keyword`, `regex`) VALUES (?, ?)", [keyword, regex]);
        return getKeyword(keyword, regex);
    }
}

async function setTrigger(guild, user, keyword, regex) {
    const guild_id = await getGuild(guild);
    const user_id = await getUser(user);
    const keyword_id = await getKeyword(keyword, regex);

    return await query("INSERT INTO triggers (`guild_id`, `user_id`, `keyword_id`) VALUES (?, ?, ?)", [guild_id, user_id, keyword_id]);
}

async function getTriggers(guild, user) {
    return await query("SELECT keywords.keyword, keywords.regex FROM triggers INNER JOIN keywords ON keywords.keyword_id = triggers.keyword_id INNER JOIN guilds ON guilds.guild_id = triggers.guild_id INNER JOIN users ON users.user_id = triggers.user_id WHERE guilds.guild=? AND users.user=?", [guild, user]);
}

async function delTrigger(guild, user, keyword, regex) {
    return await query("DELETE triggers FROM triggers INNER JOIN guilds on guilds.guild_id = triggers.guild_id INNER JOIN users ON users.user_id = triggers.user_id INNER JOIN keywords ON keywords.keyword_id = triggers.keyword_id WHERE guilds.guild = ? AND users.user = ? AND keywords.keyword = ? AND keywords.regex=?", [guild, user, keyword, regex]);
}

async function delTriggersOf(guild, user) {
    return await query("DELETE triggers FROM triggers INNER JOIN guilds ON guilds.guild_id = triggers.guild_id INNER JOIN users ON users.user_id = triggers.user_id WHERE guilds.guild=? AND users.user=?", [guild, user]);
}

async function allTriggers() {
    return await query("SELECT keywords.keyword, users.user, guilds.guild, keywords.regex FROM triggers INNER JOIN keywords ON keywords.keyword_id = triggers.keyword_id INNER JOIN users ON users.user_id = triggers.user_id INNER JOIN guilds ON guilds.guild_id = triggers.guild_id");
}

async function setIgnore(guild, user, ignore) {
    const guild_id = await getGuild(guild);
    const user_id = await getUser(user);
    const ignore_user_id = await getUser(ignore);

    return await query("INSERT INTO ignores (`guild_id`, `user_id`, `ignore`) VALUES (?, ?, ?)", [guild_id, user_id, ignore_user_id]);
}

async function getIgnores(guild, user) {
    return await query("SELECT U1.user FROM ignores INNER JOIN users AS U1 ON ignores.ignore=U1.user_id INNER JOIN users AS U2 ON U2.user_id = ignores.user_id INNER JOIN guilds ON guilds.guild_id = ignores.guild_id WHERE guilds.guild=? AND U2.user=?", [guild, user]);
}

async function delIgnore(guild, user, ignore) {
    return await query("DELETE ignores FROM ignores INNER JOIN guilds ON guilds.guild_id = ignores.guild_id INNER JOIN users AS U1 ON U1.user_id = ignores.user_id INNER JOIN users AS U2 ON U2.user_id = ignores.ignore WHERE guilds.guild=? AND U1.user=? AND U2.user=?", [guild, user, ignore]);
}

async function delIgnoresOf(guild, user) {
    return await query("DELETE ignores FROM ignores INNER JOIN guilds ON guilds.guild_id = ignores.guild_id INNER JOIN users ON users.user_id = ignores.user_id WHERE guilds.guild=? AND users.user=?",[guild, user]);
}

async function allIgnores() {
    return await query("SELECT guilds.guild, U1.user, U2.user AS `ignore` FROM ignores INNER JOIN guilds ON guilds.guild_id=ignores.guild_id INNER JOIN users AS U1 ON U1.user_id=ignores.user_id INNER JOIN users AS U2 ON U2.user_id=ignores.ignore");
}

async function getMagnitudeKeywords() {
    return await query("SELECT keyword, COUNT(*) AS magnitude FROM triggers INNER JOIN keywords ON triggers.keyword_id = keywords.keyword_id GROUP BY triggers.keyword_id ORDER BY magnitude DESC");
}

setup();

module.exports = {
    query,
    setTrigger,
    getTriggers,
    delTrigger,
    delTriggersOf,
    allTriggers,
    setIgnore,
    getIgnores,
    delIgnore,
    delIgnoresOf,
    allIgnores,
};
