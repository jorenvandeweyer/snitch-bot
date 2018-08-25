import { ShardingManager } from "discord.js";

class Messages {
    private messages: number;
    private hits: number;
    private hits_regex: number;

    public constructor() {
        this.messages = 0;
        this.hits = 0;
        this.hits_regex = 0;
    }

    public incM() {
        this.messages++;
    }

    public incH(regex:boolean) {
        if (regex) {
            this.hits_regex++;
        } else {
            this.hits++;
        }
    }

    public fetchM() {
        const m = this.messages;
        this.messages = 0;
        return m;
    }

    public fetchH() {
        const h = this.hits;
        this.hits = 0;
        return h;
    }

    public fetchHR() {
        const hr = this.hits_regex;
        this.hits_regex = 0;
        return hr;
    }
}

module.exports.ShardMetrics = () => {
    return new Messages();
};

module.exports.Metrics = (manager:ShardingManager) => {
    const Influx = require("influx");
    const { query } = require("../utils/database");

    const client = new Influx.InfluxDB({
        host: "influxdb",
        database: "snitch_bot",
        schema: [
            {
                measurement: "guilds",
                fields: {
                    count: Influx.FieldType.INTEGER
                },
                tags: [],
            },
            {
                measurement: "users",
                fields: {
                    count: Influx.FieldType.INTEGER
                },
                tags: [],
            },
            {
                measurement: "triggers",
                fields: {
                    triggers: Influx.FieldType.INTEGER,
                    users: Influx.FieldType.INTEGER,
                    unique_users: Influx.FieldType.INTEGER,
                    words: Influx.FieldType.INTEGER
                },
                tags: [],
            },
            {
                measurement: "messages",
                fields: {
                    messages: Influx.FieldType.INTEGER,
                    hits: Influx.FieldType.INTEGER,
                    hits_regex: Influx.FieldType.INTEGER,
                },
                tags: [],
            },
            {
                measurement: "heartbeat",
                fields: {
                    avg: Influx.FieldType.FLOAT,
                    min: Influx.FieldType.FLOAT,
                    max: Influx.FieldType.FLOAT,
                },
                tags: [],
            }
        ]
    });

    setInterval(async () => {
        if (manager.shards.size !== manager.totalShards) return;
        const guilds = manager.broadcastEval("this.guilds.size").then(guilds => guilds.reduce((total, num) => total + num));
        const users = manager.broadcastEval("this.guilds.map(guild => guild.memberCount)").then(members => members.filter(arr => arr.length).map(arr => arr.reduce((total:number, num:number) => total + num)).reduce((total, num) => total + num));
        const messages = manager.broadcastEval("this.metrics.fetchM()").then(messages => messages.reduce((total, num) => total + num));
        const hits = manager.broadcastEval("this.metrics.fetchH()").then(hits => hits.reduce((total, num) => total + num));
        const hits_regex = manager.broadcastEval("this.metrics.fetchHR()").then(hits => hits.reduce((total, num) => total + num));
        const heartbeats = manager.broadcastEval("this.pings[0]");

        const result = await query("SELECT (SELECT COUNT(DISTINCT user_id) FROM triggers) as unique_users, (SELECT COUNT(DISTINCT user_id, guild_id) FROM triggers) as users, (SELECT COUNT(*) FROM triggers) as triggers, (SELECT COUNT(DISTINCT keyword_id) FROM triggers) as words").then((result:any) => result[0]);
        client.writePoints([
            {
                measurement: "heartbeat",
                fields: {
                    avg: (await heartbeats).reduce((total, num) => total+num)/(await heartbeats).length,
                    min: Math.min(...await heartbeats),
                    max: Math.min(...await heartbeats),
                }
            },
            {
                measurement: "guilds",
                fields: {
                    count: await guilds,
                }
            },
            {
                measurement: "users",
                fields: {
                    count: await users,
                }
            },
            {
                measurement: "shards",
                fields: {
                    count: manager.shards.size,
                }
            },
            {
                measurement: "messages",
                fields: {
                    messages: await messages,
                    hits: await hits,
                    hits_regex: await hits_regex,
                }
            },
            {
                measurement: "triggers",
                fields: {
                    triggers: result.triggers,
                    users: result.users,
                    unique_users: result.unique_users,
                    words: result.words
                }
            }
        ]).catch(() => null);
    }, 15000);

};
