const cache = require("../../src/utils/cache");
const STRINGS = require("../../src/strings/index");
const add = require("../../src/commands/add");

jest.mock("../../src/utils/cache");
const send = jest.fn();

beforeEach(() => {
    send.mockClear();
});

it("test add command", async () => {
    const keyword = "test";

    cache.setTrigger.mockImplementationOnce(() => {
        return Promise.resolve({
            added: true
        });
    });

    send.mockImplementationOnce(() => {
        return Promise.resolve();
    });

    await add.execute({
        guild: {
            id: "0",
        },
        author: {
            id: "1",
        },
        command: {
            params: [keyword]
        },
        channel: {
            send
        }
    });

    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith(STRINGS.COMMAND_ADD_SUCCESS.complete(keyword));
    
    expect(cache.setTrigger).toHaveBeenCalledTimes(1);
    expect(cache.setTrigger).toHaveBeenCalledWith("0", "1", "test", false);
});

// it("test add command already exists", async () => {
//     const keyword = "test";
    
// });
