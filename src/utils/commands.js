const fs = require("fs");
const { Collection } = require("discord.js");
const commands = new Collection();

function addDirToCommands(path) {
    let files = fs.readdirSync(path);
    for (let file of files) {
        if (fs.lstatSync(`${path}/${file}`).isDirectory()) {
            addDirToCommands(`${path}/${file}`);
        } else {
            let command = require(`${path}/${file}`);
            commands.set(command.name, command);
        }
    }
}

addDirToCommands(`${__dirname}/../commands`);

module.exports = commands;
