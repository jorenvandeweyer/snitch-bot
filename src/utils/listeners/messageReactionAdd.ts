import { User } from "discord.js";
import { Message } from "discord.js";
import { MessageReaction } from "discord.js";

const cache = require("../cache");

module.exports = async (reaction: MessageReaction, user: User) => {
    const msg = reaction.message;
    if (user.id === msg.client.user.id) return;
    if (msg.author.id !== msg.client.user.id) return;
    if (msg.channel.type !== "dm") return;
    if (!reaction.me) return;

    const data = <Array<string>> msg.embeds[0].footer.text.split(" ");
    const user_id = user.id;
    const guild_id = data.shift();
    const regex = parseInt(<any>data.shift());
    const keyword = data.join(" ");

    const result = await cache.delTrigger(guild_id, user_id, keyword, regex);

    let message_content;

    if (result.deleted) {
        message_content = `Removed the word **${keyword}** succesfully`;
    } else {
        message_content = `The word **${keyword}** is not on your trigger list`;
    }

    const message = <Message> await user.send(message_content);

    msg.delete();

    setTimeout(() => {
        message.delete();
    }, 3000);
};
