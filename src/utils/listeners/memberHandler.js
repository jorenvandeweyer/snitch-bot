const cache = require("../cache");

module.exports = async (member) => {
    cache.delTriggersOf(member.guild.id, member.id);
};
