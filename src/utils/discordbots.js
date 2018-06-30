const Request = require("request");
const util = require("util");
const { discordbotsapi, discordbotsapi2 } = require("../../config.json");

const post = util.promisify(Request.post);

module.exports = (client) => {
    post(`https://bots.discord.pw/api/bots/${client.user.id}/stats`, {
        headers : {
            "Authorization" : discordbotsapi
        },
        json: true,
        body: {"server_count": client.guilds.size}
    }).catch((err) => Logger.error(`Shard[${client.shard.id}]: discordbotapi error?`));

    post(`https://discordbots.org/api/bots/${client.user.id}/stats`, {
        headers : {
            "Authorization" : discordbotsapi2
        },
        json: true,
        body: {"server_count": client.guilds.size}
    }).catch((err) => Logger.error(`Shard[${client.shard.id}]: discordbotapi error?`));
};
