const { ShardingManager } = require("discord.js");
const { token } = require("../config.json");
const Logger = require("./utils/logger");
const { Metrics } = require("./metrics/index");

const manager = new ShardingManager("./src/shard.js", {
    token,
});

Metrics(manager);

manager.on("launch", shard => Logger.info(`Shard[X]:[+]Launched Shard[${shard.id}]`));

manager.on("message", (shard, message) => {
    if (message && (message.type === "broadcast-request" || message.type === "broadcast-result" || "_eval" in message)) return;
    Logger.log(`Shard[${shard.id}:${message}]`);
});

manager.on("message", async (shard, message) => {
    if (message && message.type === "broadcast-request") {
        const shards = manager.shards.map(shard => broadcast(shard, message));
        const results = await Promise.all(shards);
        shard.send({
            success: true,
            id: message.id,
            type: "broadcast-result",
            results,
        });
    }
});

manager.spawn();

function broadcast(shard, message) {
    return new Promise(async (resolve, reject) => {
        const id = createId();

        const handler = (shard, message) => {
            if (message && message.type === "broadcast-result" && message.id === id) {
                clearTimeout(timeout);
                manager.removeListener("message", handler);
                resolve(message);
            }
        }

        manager.on("message", handler);

        await shard.send({
            id: id,
            type: "broadcast-request",
            request: message.request
        });

        const timeout = setTimeout(() => {
            manager.removeListener("message", handler);
            resolve({
                success: false,
                reason: "timeout",
            });
        }, 1500);
    });
}

function createId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
