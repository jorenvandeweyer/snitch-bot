module.exports = async (client, message) => {
    if (message && message.type === "broadcast-request") {
        let data = undefined;

        if (message.request === "guilds") {
            data = {
                guilds: client.guilds.size
            };
        } else if (message.request === "members") {
            data = {
                members: client.guilds.map(guild => guild.memberCount).reduce((total, num) => total + num)
            }
        }

        await client.shard.send({
            success: true,
            id: message.id,
            type: "broadcast-result",
            data,
        });
    }
}
