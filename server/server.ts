import DB from "./dataStructures/db";
import {IncomingMessage, ServerResponse} from "http";
import Device from "./dataStructures/device";
import Probe from "./types/probe";
var http = require('http');

var postHTML =
  '<html><head><title>Post Example</title></head>' +
  '<body>' +
  '<form method="post">' +
  'Input 1: <input name="input1"><br>' +
  'Input 2: <input name="input2"><br>' +
  '<input type="submit">' +
  '</form>' +
  '</body></html>';

// The database data structure
export const db = new DB();

// Function to run for the server
export function run(req: IncomingMessage, res: ServerResponse) {
  let body = "";
  req.on('data', function (chunk) {
    body += chunk;
  });
  req.on('end', function () {
    console.log('Body: ' + body);

    try {
      db.newData(JSON.parse(body));
    } catch (e) {
      // Yeah do nothing as usual
      console.log('Something bad happened: ' + e);
    }

    res.writeHead(200);
    res.end(postHTML);
  });
}

http.createServer(run).listen(8080);

// Create a map of devices
const devices = new Map<string, Device>();
export function updateDevices() {
  const keys = Array.from(db.esps.keys());
  const firstKey = keys.shift();

  if (firstKey != undefined) {
    // Iterate through each MAC address in the current table
    db.esps.get(firstKey).forEach((value: Probe, macAddress: string) => {
      // Create the new device if it does not exist
      if (!devices.has(macAddress)) {
        devices.set(macAddress, new Device());
      }
      // Add the first key
      devices.get(macAddress).espsStrength.set(firstKey, value.rssi);
      // Now go to each esp and get the data from it
      keys.forEach((key) => {
        devices.get(macAddress).espsStrength.set(key, db.esps.get(key).get(macAddress).rssi);
      });
    });
  }
}

// Runs every x ms
setInterval(updateDevices, 3000);
