import EspData from "../types/espData";
import Probe from "../types/probe";

export default class DB {
    esps: Map<number, Map<string, Probe>>;

    constructor() {
        this.esps = new Map<number, Map<string, Probe>>();
    }

    public newData(data: EspData) {
        if (!this.esps.has(data.espID)) {
            this.esps.set(data.espID, new Map<string, Probe>());
        }

        data.probes.forEach((probe) => {
            if (probe.timestamp == undefined) {
                probe.timestamp = new Date();
            }

            this.esps.get(data.espID).set(probe.address, probe);
        }, this);
    }
}
