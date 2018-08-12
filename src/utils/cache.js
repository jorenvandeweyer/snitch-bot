const db = require("./database");
const { Collection } = require("discord.js");

const triggers = new Collection();

async function setTrigger(guild, user, keyword, regex=false) {
    if (!triggers.has(guild)) {
        triggers.set(guild, new Collection());
    }

    if (!triggers.get(guild).has(keyword)) {
        triggers.get(guild).set(keyword, {
            regex: new RegExp(keyword),
            op: "00",
            users: [],
            usersR: []
        });
    }

    const trigger = triggers.get(guild).get(keyword);

    if (regex) {
        if (!trigger.usersR.includes(user)) {
            trigger.op = "1" + trigger.op[1];
            trigger.usersR.push(user);
            await db.setTrigger(guild, user, keyword, regex);
            return { added: true };
        }
    } else {
        if (!trigger.users.includes(user)) {
            trigger.op = trigger.op[0] + "1";
            trigger.users.push(user);
            await db.setTrigger(guild, user, keyword, regex);
            return { added: true };
        }
    }
    return { exists: true };
}

async function getTrigger(guild, user) {
    return await db.getTrigger(guild, user);
}

async function delTrigger(guild, user, keyword, regex) {
    if (triggers.has(guild)) {
        if (triggers.get(guild).has(keyword)) {
            const trigger = triggers.get(guild).get(keyword);
            if (regex) {
                if (trigger.usersR.includes(user)) {
                    trigger.usersR.splice(trigger.usersR.indexOf(user), 1);
                    await db.delTrigger(guild, user, keyword, regex);
                    if (!trigger.usersR.length) {
                        trigger.op = "0" + trigger.op[1];
                        if (!trigger.users.length) {
                            triggers.get(guild).delete(keyword);
                        }
                    }
                    return { deleted: true };
                }
            } else {
                if (trigger.users.includes(user)) {
                    trigger.users.splice(trigger.users.indexOf(user), 1);
                    if (!trigger.users.length) {
                        trigger.op = trigger.op[0] + "0";
                        if (!trigger.usersR.length) {
                            triggers.get(guild).delete(keyword);
                        }
                    }
                    await db.delTrigger(guild, user, keyword, regex);
                    return { deleted: true };
                }
            }


        }
    }

    return { deleted: false };
}

async function delTriggersOf(guild, user) {
    db.delTriggersOf(guild, user)
    if (triggers.has(guild)) {
        triggers.get(guild).forEach((trigger, keyword) => {
            if (trigger.usersR.includes(user)) {
                trigger.usersR.splice(trigger.usersR.indexOf(user), 1);
                if (!trigger.usersR.length) {
                    trigger.op = "0" + trigger.op[1];
                }
            }
            if (trigger.users.includes(user)) {
                trigger.users.splice(trigger.users.indexOf(user), 1);
                if (!trigger.users.length) {
                    trigger.op = trigger.op[0] + "0";

                }
            }

            if (!trigger.usersR.length && !trigger.users.length) {
                triggers.get(guild).delete(trigger.keyword);
            }
        });
    }
}

async function build(guilds) {
    const table = await db.allTriggers();

    for (let i = 0; i < table.length; i++) {
        const row = table[i];
        if (!guilds.has(row.guild)) continue;

        if (!triggers.has(row.guild)) {
            triggers.set(row.guild, new Collection());
        }

        if (!triggers.get(row.guild).has(row.keyword)) {
            triggers.get(row.guild).set(row.keyword, {
                regex: new RegExp(row.keyword),
                word: new RegExp(`\\b${row.keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`),
                op: "00",
                users: [],
                usersR: []
            });
        }

        const trigger = triggers.get(row.guild).get(row.keyword);

        if (row.regex) {
            trigger.op = "1" + trigger.op[1];
            trigger.usersR.push(row.user);
        } else {
            trigger.op = trigger.op[0] + "1";
            trigger.users.push(row.user);
        }
    }
}

module.exports = {
    build,
    setTrigger,
    getTrigger,
    delTrigger,
    delTriggersOf,
    triggers,
};
