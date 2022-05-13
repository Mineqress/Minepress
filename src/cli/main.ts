#!/bin/env node
import * as fs from "fs";
import * as path from "path"
import * as Mocha from "mocha";
import "../"
import { Chance } from "chance";

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

    await mi.joinServer({
        username: new Chance().name().replace(" ", ""),
        host: "localhost",
        port: 25565
    })
    // Run the tests.
    mocha.run(function (failures) {
        process.exitCode = failures ? 1 : 0;  // exit with non-zero status if there were failures
    });
    // Give some time for it to send some packets before leaving
    setTimeout(() => {
        mi.quit()
    }, 500)
})()