# cornhacks-2022
Our repo for cornhacks 2022. Dillon Howell and Nathan Kolbas.

# Arduino
You can find everything needed for Arduino development in the `arduino` folder. There you will find the firmware that we developed.

We used an [ESP8266](https://www.espressif.com/en/products/socs/esp8266) as our hardware. This allowed us to easily take advantage of the built-in WiFi module.

# Server
The server and all its respective files can be found in the `server` directory.

The server is developed using [NodeJS](https://nodejs.org/en/) with [TypeScript](https://www.typescriptlang.org/). We chose NodeJS for its simplicity, easy to set up, and easy to use. TypeScript allows us to catch errors before runtime that would otherwise appear with JavaScript.

`server.ts` is the starting point of the server. Everything is set up and ran here. You can find the scripts needed to run in `package.json`. Don't forget to `npm install`!

### Test Suite
The test suite can be found in `test`. The sub-folder `unit` is for unit tests. The file structure matches the rest of the server files for simplicity. Tests utilize jest, chai, and mocha. 

# Website
The website can be found in the `website` folder. You can find the scripts needed to run in `package.json`. Don't forget to `npm install`!

The website was developed with [React](https://reactjs.org/) and TypeScript for the same reasons as the server.
