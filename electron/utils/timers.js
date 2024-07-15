// timers.js
const { setInterval, clearInterval } = require('timers');

const timer = () => {
    let interval = null;


    const start = (event, timeMap,callback) => {
        interval = setInterval(() => {
            if (timeMap.get("seconds_2") > 0) {
                timeMap.set("seconds_2", timeMap.get("seconds_2") - 1);
            } else {
                if (timeMap.get("seconds_1") > 0) {
                    timeMap.set("seconds_1", timeMap.get("seconds_1") - 1);
                    timeMap.set("seconds_2", 9);
                } else {
                    if (timeMap.get("minutes_2") > 0) {
                        timeMap.set("minutes_2", timeMap.get("minutes_2") - 1);
                        timeMap.set("seconds_2", 9);
                        timeMap.set("seconds_1", 5);
                    } else {
                        if (timeMap.get("minutes_1") > 0) {
                            timeMap.set("minutes_1", timeMap.get("minutes_1") - 1);
                            timeMap.set("minutes_2", 9);
                            timeMap.set("seconds_1", 5);
                            timeMap.set("seconds_2", 9);
                        } else {
                            stop();
                            return;
                        }
                    }
                }
            }

            callback(event, timeMap);
        }, 1000);
    };

    const stop = () => {
        if (interval !== null) {
            clearInterval(interval);
            interval = null;
        }
    };

    return { start, stop };
};

module.exports = timer;
