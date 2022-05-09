
import {Bot, BotOptions, createBot} from "mineflayer"
import {Chance} from "chance";
const chance = new Chance();
class Minepress {
    private bot?: Bot;
    private lastMsg?: string;
    joinServer(server: BotOptions) {
        this.bot = createBot({
            ...server,
            username: chance.name().replace(" ", "").substring(0, 16)
        })
        this.setupBot()
    }

    private setupBot(){
        this.bot!!.on("chat", (msg) => {
            this.lastMsg = msg;
        })
    }
}
// @ts-ignore
globalThis.mi = new Minepress;
export type {Minepress};