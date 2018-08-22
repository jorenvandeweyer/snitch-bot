import * as Discord from "discord.js";

const events:any = {
    MESSAGE_REACTION_ADD: "messageReactionAdd",
    MESSAGE_REACTION_REMOVE: "messageReactionRemove",
};

module.exports = async (client: Discord.Client, event: Discord.Event) => {
    if (!events.hasOwnProperty(event.t)) return;

    const { d: data } = event;
    const user = client.users.get(data.user_id);
    const channel = <Discord.TextChannel> client.channels.get(data.channel_id) || user && await user.createDM();

    if (channel && channel.messages.has(data.message_id)) return;

    const message = await channel.fetchMessage(data.message_id);

    const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
    const reaction = message.reactions.get(emojiKey);

    client.emit(events[event.t], reaction, user);
};
