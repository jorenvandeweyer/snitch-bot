class Stats {
    constructor() {
        this.nextReset = 0;
        this.stats = [this._default(), this._default()];
        setInterval(() => {
            this.reset()
        },15000);
    }

    reset() {
        this.stats[this.nextReset] = this._default();
        this.nextReset = this.nextReset === 0 ? 1 : 0;
    }

    get(type) {
        const stat = this.stats[this.nextReset];
        const number = stat[type] / ((Date.now() - stat.lastReset)/1000) ;
        return (number * 60).toFixed(1);
    }

    _default() {
        return {
            messages: 0,
            hits: 0,
            lastReset: Date.now(),
        };
    }

    increase(type) {
        this.stats.forEach(stat => stat[type]++);
    }
}

const stats = new Stats();

module.exports = {
    update: (type) => { stats.increase(type) },
    get: (type) => { return stats.get(type) },
};
