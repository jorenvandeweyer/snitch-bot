module.exports = {
    guild: {
        id: "0",
    },
    author: {
        id: "1",
    },
    command: {
        params: []
    },
    channel: {
        send: jest.fn(() => { return Promise.resolve() })
    }
};
