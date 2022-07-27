#!/bin/env node
import * as fs from "fs";
import * as path from "path"
import * as Mocha from "mocha";
import "../"
import { Chance } from "chance";
import { Config } from "./Config";
const MINEPRESS_FOLDER = 'minepress/'
const MINEPRESS_CONFIG_FILE = "./minepress/config.json"
async function main() {
    // Instantiate a Mocha instance.
    var mocha = new Mocha();


    // Add each .js file to the mocha instance
    fs.readdirSync(MINEPRESS_FOLDER).filter((file) => {

        // Only keep the .js files
        return file.substr(-3) === '.js';

    }).forEach(function (file) {
        mocha.addFile(
            path.join(MINEPRESS_FOLDER, file)
        );
    });
    let config: Config;
    if(fs.existsSync(MINEPRESS_CONFIG_FILE)){
        config = JSON.parse(fs.readFileSync(MINEPRESS_CONFIG_FILE, "utf-8").toString());
    } else {
        config = {};
    }
    await mi.joinServer({
        username: config.username || new Chance().name().replace(" ", ""),
        host: config.server?.host || "localhost",
        port: config.server?.port || 25565,
        auth: config.loginType,
        password: config.password,
    })
    // @ts-ignore
    global.Item = require("prismarine-item")(mi.bot.version)
    mocha.timeout(60000);
    
    // Run the tests.
    mocha.run(function (failures) {
        mi.quit()
        process.exit(failures ? 1 : 0)
    }).on("fail", (test, err) => {
        // @ts-ignore
        test.err.uncaught = false;
    });
}
main();