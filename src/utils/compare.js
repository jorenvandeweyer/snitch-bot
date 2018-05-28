const EventEmitter = require('events');
const { Collection } = require("discord.js");
const cache = require("./cache");

module.exports = class CompareListener extends EventEmitter{
    constructor(shard) {
        this.triggers = new Collection();
    }

    compare() {

    }

}

async function createTriggers(shard) {

}
