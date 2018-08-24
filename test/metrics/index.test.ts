const metrics = require("../../src/metrics/index");
const Influx = require("influx");
const { query } = require("../../src/utils/database");
jest.mock("../../src/utils/database");
jest.mock("influx");
jest.useFakeTimers();

test("test shardmetrics message counter", () => {
    const shardMetrics = metrics.ShardMetrics();

    shardMetrics.incM();
    shardMetrics.incM();

    shardMetrics.incH(false);
    shardMetrics.incH(true);
    shardMetrics.incH(true);
    shardMetrics.incH(true);
    
    expect(shardMetrics.fetchM()).toBe(2);
    expect(shardMetrics.fetchM()).toBe(0);
    expect(shardMetrics.fetchH()).toBe(1);
    expect(shardMetrics.fetchH()).toBe(0);
    expect(shardMetrics.fetchHR()).toBe(3);
    expect(shardMetrics.fetchHR()).toBe(0);
});

test("upload to influx", async () => {
    const manager = {
        broadcastEval: jest.fn(),
        shards: {
            size: 2,
        },
        totalShards: 2
    }

    query.mockImplementationOnce(() => {
        return Promise.resolve([
            {
                triggers: 1234,
                users: 65,
                unique_users: 50,
                words: 234
            }
        ])
    });

    manager.broadcastEval.mockImplementationOnce(() => {
        return Promise.resolve([1, 2]);
    });
    manager.broadcastEval.mockImplementationOnce(() => {
        return Promise.resolve([[7], [5, 8]]);
    });
    manager.broadcastEval.mockImplementationOnce(() => {
        return Promise.resolve([100, 200]);
    });
    manager.broadcastEval.mockImplementationOnce(() => {
        return Promise.resolve([10, 20]);
    });
    manager.broadcastEval.mockImplementationOnce(() => {
        return Promise.resolve([5, 10]);
    });
    manager.broadcastEval.mockImplementationOnce(() => {
        return Promise.resolve([111, 113]);
    });

    const writePoints = jest.fn();
    writePoints.mockImplementationOnce(() => {
        return Promise.resolve();
    });
    Influx.InfluxDB.mockImplementationOnce(() => {
        return {
            writePoints,
        }
    });

    metrics.Metrics(manager);

    expect(writePoints).not.toBeCalled();
    jest.advanceTimersByTime(20000);
    jest.useRealTimers();

    await new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 50);
    });
    console.log(writePoints.mock.calls[0][0]);
    expect(writePoints).toBeCalled();
});
