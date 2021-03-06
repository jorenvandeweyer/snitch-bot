const Console = console;
const date = {
    toString: () => {
        return new Date().toString().split(" GMT")[0];
    }
};
const Colors = {
    BLACK: "\x1b[30m",
    RED: "\x1b[31m",
    GREEN: "\x1b[32m",
    YELLOW: "\x1b[33m",
    BLUE: "\x1b[34m",
    MAGENTA: "\x1b[35m",
    CYAN: "\x1b[36m",
    WHITE: "\x1b[37m",
};

function error (err: string) {
    output(Colors.RED, err);
}

function info (inf: string) {
    output(Colors.BLUE, inf);
}

function log (stream: string) {
    output(Colors.WHITE, stream);
}

function success (stream: string) {
    output(Colors.GREEN, stream);
}

function output(color: string, text: string) {
    Console.log(`${color}${date} | ${text}\x1b[0m`);
}

module.exports = {
    error,
    info,
    log,
    success,
};
