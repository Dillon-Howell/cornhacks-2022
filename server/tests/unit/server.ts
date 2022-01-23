import {IncomingMessage, ServerResponse} from "http";
import { run } from "../../server";
import {Socket} from "net";

let chai = require('chai');
const assert = chai.assert;

describe('server', function () {
    describe('received new data', function () {
        it("properly loads data", async () => {
            run(new IncomingMessage(new Socket()), new ServerResponse(new IncomingMessage(new Socket())));
        });
    });
});
