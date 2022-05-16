#!/bin/env node
import * as fs from "fs";
import * as path from "path"
import * as Mocha from "mocha";
import "../"
import { Chance } from "chance";
interface Config {
    server?: {
        host: string,
        port: number
    },
    username?: string,
    password?: string,
    loginType?: "mojang" | "microsoft"
}
(async () => {
    // Instantiate a Mocha instance.
    var mocha = new Mocha();

    var testDir = 'minepress/'

    // Add each .js file to the mocha instance
    fs.readdirSync(testDir).filter((file) => {

        // Only keep the .js files
        return file.substr(-3) === '.js';

    }).forEach(function (file) {
        mocha.addFile(
            path.join(testDir, file)
        );
    });
    let config: Config;
    if(fs.existsSync("./minepress.json")){
        console.log("[INFO] 'minepress.json' detected! Using it.")
        config = JSON.parse(fs.readFileSync("./minepress.json", "utf-8").toString());
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
    // Run the tests.
    mocha.run(function (failures) {
        mi.quit()
        process.exitCode = failures ? 1 : 0;  // exit with non-zero status if there were failures
    });
})()