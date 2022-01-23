const https = require('https')

export default class Device {
    // Esp locations which are hardcoded for simplicity.
    private static ESPS = {
        1: {
            x: 65,
            y: 60,
        },
        2: {
            x: 126,
            y: 43,
        },
        3: {
            x: 119,
            y: 78,
        },
    };

    macAddress: string;
    name: string;
    // The key is the ID of the esp and the value is the rssi
    espsStrength: Map<number, number>;


    constructor(macAddress?: string, espsStrength?: Map<number, number>) {
        this.macAddress = macAddress ?? "";
        if (this.macAddress) {
            // this.lookupMacAddress();
            this.name = "";
        } else {
            this.name = "";
        }
        this.espsStrength = espsStrength ?? new Map<number, number>();
    }

    /**
     * We calculated this by hand by getting data points and signal strengths
     * at distance intervals and then creating a function that matches this.
     *
     * @param rssi the negative value of the rssi which is the signal strength
     * @return the distance in feet
     */
    rssiToDistance(rssi: number) {
        return (1.5 * -rssi) - (43 * 1.5);
    }

    // Dubbed down to MOE (margin of error) for triangularization
    private static EPSILON = 50;

    /**
     * Some very helpful information and credit where credit is due:
     * https://stackoverflow.com/questions/19723641/find-intersecting-point-of-three-circles-programmatically
     *
     * @param x0
     * @param y0
     * @param r0
     * @param x1
     * @param y1
     * @param r1
     * @param x2
     * @param y2
     * @param r2
     */
    calculateThreeCircleIntersection(x0: number, y0: number, r0: number,
                                     x1: number, y1: number, r1: number,
                                     x2: number, y2: number, r2: number): Array<number> {
        let a: number;
        let dx: number;
        let dy: number;
        let d: number;
        let h: number;
        let rx: number;
        let ry: number;
        let point2_x: number;
        let point2_y: number;

        // dx and dy are the vertical and horizontal distances between the circle centers.
        dx = x1 - x0;
        dy = y1 - y0;

        // Determine the straight-line distance between the centers.
        d = Math.sqrt((dy*dy) + (dx*dx));

        // Check for solvability.
        if (d > (r0 + r1)) {
            // no solution. circles do not intersect.
            return null;
        }
        if (d < Math.abs(r0 - r1)) {
            // no solution. one circle is contained in the other
            return null;
        }

        // 'point 2' is the point where the line through the circle
        // intersection points crosses the line between the circle centers.

        // Determine the distance from point 0 to point 2.
        a = ((r0*r0) - (r1*r1) + (d*d)) / (2.0 * d);

        // Determine the coordinates of point 2.
        point2_x = x0 + (dx * a/d);
        point2_y = y0 + (dy * a/d);

        // Determine the distance from point 2 to either of the intersection points.
        h = Math.sqrt((r0*r0) - (a*a));

        // Now determine the offsets of the intersection points from point 2.
        rx = -dy * (h/d);
        ry = dx * (h/d);

        // Determine the absolute intersection points.
        let intersectionPoint1_x = point2_x + rx;
        let intersectionPoint2_x = point2_x - rx;
        let intersectionPoint1_y = point2_y + ry;
        let intersectionPoint2_y = point2_y - ry;

        console.log("INTERSECTION Circle1 AND Circle2:", "(" + intersectionPoint1_x + "," + intersectionPoint1_y + ")" + " AND (" + intersectionPoint2_x + "," + intersectionPoint2_y + ")");

        // Let's determine if circle 3 intersects at either of the above intersection points.
        dx = intersectionPoint1_x - x2;
        dy = intersectionPoint1_y - y2;
        let d1 = Math.sqrt((dy*dy) + (dx*dx));

        dx = intersectionPoint2_x - x2;
        dy = intersectionPoint2_y - y2;
        let d2 = Math.sqrt((dy*dy) + (dx*dx));

        if (Math.abs(d1 - r2) < Device.EPSILON) {
            console.log("INTERSECTION Circle1 AND Circle2 AND Circle3:", "(" + intersectionPoint1_x + "," + intersectionPoint1_y + ")");
            return [intersectionPoint1_x, intersectionPoint1_y];
        } else if(Math.abs(d2 - r2) < Device.EPSILON) {
            console.log("INTERSECTION Circle1 AND Circle2 AND Circle3:", "(" + intersectionPoint2_x + "," + intersectionPoint2_y + ")"); //here was an error
        } else {
            console.log("INTERSECTION Circle1 AND Circle2 AND Circle3:", "NONE");
        }
        return null;
    }

    lookupMacAddress() {
        https.get("https://macvendors.co/api/" + this.macAddress, (response) => {
            let chunks_of_data = [];

            response.on('data', (fragments) => {
                chunks_of_data.push(fragments);
            });

            response.on('end', () => {
                let response_body = Buffer.concat(chunks_of_data);
                this.name = JSON.parse(response_body.toString())['result']['company'] ?? this.macAddress;
            });

            response.on('error', (error) => {
                this.name = this.macAddress;
            });
        });
    }

    /**
     * Creates the needed data for the /devices path to be utilized for displaying location
     * of devices.
     */
    getData() {
        if (this.espsStrength.size < 3) {
            return null;
        }

        let xy = this.calculateThreeCircleIntersection(
            Device.ESPS["1"]["x"], Device.ESPS["1"]["y"], this.rssiToDistance(this.espsStrength.get(1)),
            Device.ESPS["2"]["x"], Device.ESPS["2"]["y"], this.rssiToDistance(this.espsStrength.get(2)),
            Device.ESPS["3"]["x"], Device.ESPS["3"]["y"], this.rssiToDistance(this.espsStrength.get(3)));
        if (xy == null) {
            return null;
        }
        const x = Math.round(xy[0]);
        const y = Math.round(xy[1]);

        return {
            macAddress: this.macAddress,
            name: this.name,
            xy: x + "-" + y,
        };
    }
}
