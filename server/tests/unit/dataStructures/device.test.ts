import assert = require("assert");
import Device from "../../../dataStructures/device";

describe('Device', function () {
    describe('calculateThreeCircleIntersection', function () {
        it("calculates the center", async () => {
            const device = new Device();
            assert.equal(device.calculateThreeCircleIntersection(-2, 2, 2, 0, 0, 2, 2, 2, 2), 0);
        });
    });
});
