module.exports = async (client, message) => {
    if (message && message.type === "broadcast-request") {
        let data = undefined;

        if (message.request === "guilds") {
            data = {
                guilds: client.guilds.size
            };
        } else if (message.request === "members") {
            const guilds = client.guilds.map(guild => guild.memberCount);
            let members = 0;

            if (guilds.length) {
                members = guilds.reduce((total, num) => total + num);
            }
            
            data = {
                members
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
