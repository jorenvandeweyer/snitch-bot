const db = require("./database");
const { Collection } = require("discord.js");

const triggers = new Collection();

async function setTrigger(guild, user, keyword) {
    if (!triggers.has(guild)) {
        triggers.set(guild, new Collection());
    }

    if (!triggers.get(guild).has(keyword)) {
        triggers.get(guild).set(keyword, []);
    }

    if (!triggers.get(guild).get(keyword).includes(user)) {
        triggers.get(guild).get(keyword).push(user);
        await db.setTrigger(guild, user, keyword);
        return { added: true };
    } else {
        return { exists: true };
    }
}

async function getTrigger(guild, user) {
    return await db.getTrigger(guild, user);
}

async function delTrigger(guild, user, keyword) {
    if (triggers.has(guild)) {
        if (triggers.get(guild).has(keyword)) {
            if (triggers.get(guild).get(keyword).includes(user)) {
                const array = triggers.get(guild).get(keyword);
                const index = array.indexOf(user);
                array.splice(index, 1);
                await db.delTrigger(guild, user, keyword);
                return { deleted: true };
            }
        }
    }

    return { deleted: false };
}

async function build() {
    const table = await db.allTriggers();

    for (let i = 0; i < table.length; i++) {
        const row = table[i]
        if (!triggers.has(row.guild)) {
            triggers.set(row.guild, new Collection());
        }

        if (!triggers.get(row.guild).has(row.keyword)) {
            triggers.get(row.guild).set(row.keyword, []);
        }

        triggers.get(row.guild).get(row.keyword).push(row.user);
    }
}

build();

module.exports = {
    setTrigger,
    getTrigger,
    delTrigger,
    triggers,
};
