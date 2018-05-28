const EnrichMessage = require("./enrichMessage");

module.exports = async (msg) => {
    const Client = msg.client;

    if (Client.user.id === msg.author.id) return;

    const richMessage = await EnrichMessage(msg);

    if (richMessage.isCommand) {
        await richMessage.command.execute();
    }

    richMessage.search();

    richMessage.on("hit", (info) => {
        console.log(info);
    });

    richMessage.on("finished", () => {
        richMessage = null;
    });
}
