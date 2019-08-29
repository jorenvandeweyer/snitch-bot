const { Collection } = require("discord.js");
const { isCommand, search } = require("../../src/utils/extenders/Message");

const database = require("../../src/utils/database");
jest.mock("../../src/utils/database");

module.exports = {
    id: "3",
    client: {
        metrics: {
            incH: jest.fn(),
        },
        shard: {
            id: 0
        }
    },
    author: {
        id: "0",
        tag: "SENDER#0000",
    },
    content: "",
    prefix: "",
    channel: {
        send: jest.fn(() => { return Promise.resolve() }),
        id: "2",
        type: "text",
    },
    guild: {
        id: "10",
        fetchMember: jest.fn(),
        members: new Collection([["1", {
            permissionsIn: jest.fn().mockReturnValue(new Collection([["VIEW_CHANNEL", {}]])),
            send: jest.fn().mockImplementationOnce(() => {
                return Promise.resolve({
                    react: jest.fn(),
                });
            }),
            user: {
                tag: "RECEIVER#0000"
            },
        }]])
    },
    member: {
        id: "1",
        send: jest.fn(() => { return Promise.resolve() }),
    },
    isCommand,
    search,
    command: {
        name: "",
        params: [],
    },
};
