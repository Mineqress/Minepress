
import {Bot, BotOptions, createBot} from "mineflayer"
import {Chance} from "chance";
const chance = new Chance();

let bot: Bot;
let lastMsg: string;
function joinServer(server: BotOptions) {
    bot = createBot({
        ...server,
        username: chance.name().replace(" ", "").substring(0, 16)
    })
    setupBot()
}
function setupBot(){
    bot.on("chat", (msg) => {
        lastMsg = msg;
    })
}

module.exports = {joinServer}