import assert = require("assert");
import Device from "../../../dataStructures/device";

describe('Device', function () {
    describe('calculateThreeCircleIntersection', function () {
        it("calculates the center", async () => {
            const device = new Device();
            assert.equal(device.calculateThreeCircleIntersection(-2, 2, 2, 0, 0, 2, 2, 2, 2), 0);
        });
    });

    describe('lookupMacAddress', function () {
        // it("gets data from http request", async () => {
        //     const device = new Device("3c:22:fb:7d:bc:ba");
        //     const data: string = await device.lookupMacAddress();
        //     assert.equal(JSON.parse(data)['result']['company'], "Apple, Inc.");
        // });
        //
        // it("does not get data from http request", async () => {
        //     const device = new Device("c8:34:ee:43:11:18");
        //     const data: string = await device.lookupMacAddress();
        //     assert.equal(JSON.parse(data)['result']['company'], undefined);
        // });
    });
});
