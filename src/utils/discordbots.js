const Request = require("request");
const util = require("util");
const DBL = require("dblapi.js");
const Logger = require("./logger");

const { discordbotsapi, discordbotsapi2 } = require("../../config.json");

const post = util.promisify(Request.post);

module.exports = (client) => {
    if (discordbotsapi2) {
        new DBL(discordbotsapi2, client);
    }
    if (discordbotsapi) {
        client.on("ready", () => { pw(client); });
        client.on("guildCreate", () => { pw(client); });
    }
};

function pw(client) {
    post(`https://bots.discord.pw/api/bots/${client.user.id}/stats`, {
        headers : {
            "Authorization" : discordbotsapi
        },
        json: true,
        body: {
            "shard_id": client.shard.id,
            "shard_count": client.shard.count,
            "server_count": client.guilds.size
        }
    }).catch(() => Logger.error(`Shard[${client.shard.id}]: discordbotapi error?`));
}
