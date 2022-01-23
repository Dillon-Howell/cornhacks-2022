import DB from "../../../db/db";
let chai = require('chai');
const assert = chai.assert;

describe('DB', function () {
    describe('newData', function () {
        it("properly loads data", async () => {
            const db = new DB();
            const data = {
                "espID": 1,
                    "probes": [
                    {
                        "address": "76:15:85:df:50:1e",
                        "rssi": -53
                    },
                    {
                        "address": "76:15:85:df:50:1e",
                        "rssi": -54
                    },
                    {
                        "address": "ce:95:4b:28:69:cc",
                        "rssi": -65
                    },
                    {
                        "address": "84:fd:d1:67:49:54",
                        "rssi": -65
                    }
                ]
            }
            db.newData(data);
            assert.equal(db.esps, {});
        });

        it("properly loads data and updates", async () => {
            const db = new DB();
            const data = {
                "espID": 1,
                "probes": [
                    {
                        "address": "76:15:85:df:50:1e",
                        "rssi": -53
                    },
                    {
                        "address": "76:15:85:df:50:1e",
                        "rssi": -54
                    },
                    {
                        "address": "ce:95:4b:28:69:cc",
                        "rssi": -65
                    },
                    {
                        "address": "84:fd:d1:67:49:54",
                        "rssi": -65
                    }
                ]
            };
            db.newData(data);
            const data2 = {
                "espID": 1,
                "probes": [
                    {
                        "address": "76:15:85:df:50:1e",
                        "rssi": -69
                    },
                    {
                        "address": "ce:95:4b:28:69:cc",
                        "rssi": -34
                    },
                ]
            };
            db.newData(data2);
            assert.equal(JSON.parse(db.esps), {
                1: {
                    "76:15:85:df:50:1e": {
                        "address": "76:15:85:df:50:1e",
                        "rssi": -69
                    },
                    "ce:95:4b:28:69:cc": {
                        "address": "ce:95:4b:28:69:cc",
                        "rssi": -34
                    },
                    "84:fd:d1:67:49:54": {
                        "address": "84:fd:d1:67:49:54",
                        "rssi": -65
                    }
                },
            });
        });

        it("test", async () => {
            const test = new Map<number, string>();
            test.has(1);
            test.set(1, "test");
            test.has(1);
        });
    });
});
