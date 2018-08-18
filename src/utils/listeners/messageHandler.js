const db = require("../database");

module.exports = async (msg) => {
    if (msg.client.user.id === msg.author.id) return;
    msg.client.metrics.incM();

    await msg.isCommand();

    if (msg.command) {
        if (msg.channel.type !== "text" && msg.command.guildOnly) {
            msg.reply("Please use this command in a guild");
        } else if (msg.command.args <= msg.command.params.length) {
            if (msg.command.vote) {
                const votes = await db.query("select * from discordbots.webhook_dbl where user=? AND bot='452042500828299264' AND type='upvote' limit 1", [msg.author.id]);
                if (votes.length) {
                    msg.command.execute(msg);
                } else {
                    msg.channel.send("To use this command you need to vote at https://discordbots.org/bot/snitch/vote?c \n This takes 15 seconds and will help to improve and add extra features to the bot! Thanks!");
                }
            } else {
                msg.command.execute(msg);
            }
        } else {
            msg.channel.send(`This command requires atleast ${msg.command.args} argument${msg.command.args === 1 ? "" : "s"}`);

        }
    }

    if (!(msg.channel.type !== "text")) msg.search();
};
