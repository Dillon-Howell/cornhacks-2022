# cornhacks-2022
Our repo for cornhacks 2022. Dillon Howell and Nathan Kolbas.

# BigBrother

## What is it?
BigBrother leverages the way WiFi naturally works to our advantage. When connected to a network or searching for open networks, your device sends out packets of information that can be "sniffed" from the air. This includes data like your MAC Address and the strength of your signal (both of which we can take advantage of). Because of this, we can use relatively cheap hardware, networking, software engineering, and a bit of math to track your position in realtime. There have been attempts to help prevent tracking of your MAC Address as noted here: https://en.wikipedia.org/wiki/MAC_address#Randomization.

## Cool, but how?
Using both your MAC Address as your ID and the [rssi](https://en.wikipedia.org/wiki/Received_signal_strength_indication) strength we can use three (or more!) devices to sniff this information and then [triangulate](https://en.wikipedia.org/wiki/Triangulation) your location just like GPS.

## Arduino
You can find everything needed for Arduino development in the `arduino` folder. There you will find the firmware that we developed.

We used an [ESP8266](https://www.espressif.com/en/products/socs/esp8266) as our hardware. This allowed us to easily take advantage of the built-in WiFi module.

## Server
The server and all its respective files can be found in the `server` directory.

The server is developed using [NodeJS](https://nodejs.org/en/) with [TypeScript](https://www.typescriptlang.org/). We chose NodeJS for its simplicity, easy to set up, and easy to use. TypeScript allows us to catch errors before runtime that would otherwise appear with JavaScript.

`server.ts` is the starting point of the server. Everything is set up and ran here. You can find the scripts needed to run in `package.json`. Don't forget to `npm install`!

### Test Suite
The test suite can be found in `test`. The sub-folder `unit` is for unit tests. The file structure matches the rest of the server files for simplicity. Tests utilize jest, chai, and mocha. 

## Website
The website can be found in the `website` folder. You can find the scripts needed to run in `package.json`. Don't forget to `npm install`!

The website was developed with [React](https://reactjs.org/) and TypeScript for the same reasons as the server.
