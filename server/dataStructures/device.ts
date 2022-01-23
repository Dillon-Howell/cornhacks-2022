export default class Device {
    macAddress: string;
    espsStrength: Map<number, number>;


    constructor(macAddress?: string, espsStrength?: Map<number, number>) {
        this.macAddress = macAddress ?? "";
        this.espsStrength = espsStrength ?? new Map<number, number>();
    }
}
