const db = require("./database");
const { Collection } = require("discord.js");

const users = [
    "323614795750178816"
];

const trigger = new Collection();
trigger.set("pong", users);

const triggers = new Collection();
triggers.set("323614795750178816", trigger)

module.exports = {
    get: db,
    set: db,
    triggers
};
