/// <reference types="jest"/>
import { Bot, BotOptions, createBot } from "mineflayer"
import { Chance } from "chance";
const chance = new Chance();
type What = "last.message"

class Minepress {

    private bot?: Bot;
    private lastMsg?: string;
    joinServer(server: BotOptions) {
        return new Promise<void>((resolve, reject) => {
            if (!this.bot) {
                this.bot = createBot({
                    ...server,
                    username: chance.name().replace(" ", "").substring(0, 16)
                })
                this.setupBot()
            } else {
                this.bot.connect(server);
            }
            this.bot.once("spawn", () => {
                resolve()
            })
            this.bot.once("error", (e) => {
                reject()
            })
        })
    }

    private setupBot() {
        this.bot!!.on("chat", (msg) => {
            this.lastMsg = msg;
        })
    }
    expect(what: What) {
        let table = {
            "last.message": () => {
                return expect(this.lastMsg);
            }
        }
        return table[what]();
    }
    quit() {
        return new Promise<void>(resolve => {
            this.bot?.once("end", () => {
                resolve()
            })
            this.bot!!.quit()
        })
    }
}
// @ts-ignore
globalThis.mi = new Minepress;
export type { Minepress };