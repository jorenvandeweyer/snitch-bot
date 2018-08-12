const Request = require("request");
const util = require("util");
const DBL = require("dblapi.js");

const { discordbotsapi, discordbotsapi2 } = require("../../config.json");

const post = util.promisify(Request.post);

module.exports = (client) => {
    if (discordbotsapi2) {
        const dbl = new DBL(discordbotsapi2, client);
    }
    if (discordbotsapi) {
        client.on("ready", () => { pw(client) });
        client.on("guildCreate", () => { pw(client) });
    }
};

function pw(client) {
    post(`https://bots.discord.pw/api/bots/${client.user.id}/stats`, {
        headers : {
            "Authorization" : discordbotsapi
        },
        json: true,
        body: {"server_count": client.guilds.size}
    }).catch((err) => Logger.error(`Shard[${client.shard.id}]: discordbotapi error?`));
}
