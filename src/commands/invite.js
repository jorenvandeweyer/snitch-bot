module.exports = {
    name: "invite",
    usage: "",
    args: 0,
    async execute (msg) {
        msg.author.send(`<https://discordapp.com/oauth2/authorize?client_id=${msg.original.client.user.id}&permissions=67497024&scope=bot>`)
    }
};
