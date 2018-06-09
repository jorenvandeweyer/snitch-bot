const cache = require("../cache");

module.exports = async (reaction, user) => {
    const msg = reaction.message;
    if (user.id === msg.client.user.id) return;
    if (msg.author.id !== msg.client.user.id) return;
    if (msg.channel.type !== "dm") return;
    if (!reaction.me) return;

    const keyword = msg.embeds[0].footer.text.split(" ")[0];
    const user_id = user.id;
    const guild = msg.embeds[0].footer.text.split(" ")[1];

    const result = await cache.delTrigger(guild, user_id, keyword);

    let message_content;

    if (result.deleted) {
        message_content = `Removed the word **${keyword}** succesfully`;
    } else {
        message_content = `The word **${keyword}** is not on your trigger list`;
    }

    const message = await user.send(message_content);

    msg.delete();

    setTimeout(() => {
        message.delete();
    }, 3000);
};
