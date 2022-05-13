/// <reference types="mocha"/>
import { Bot, BotEvents, BotOptions, createBot } from "mineflayer"
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
        this.bot!!.on("message", (jsonMsg, position) => {
            this.lastMsg = jsonMsg.toString();
        })
    }
    private waitForEvent(event: keyof BotEvents){
        return new Promise<void>(resolve => {
            this.bot?.once(event, () => {
                resolve()
            })
        })
    }
    expect(what: What) {
        let table = {
            "last.message": () => {
                return // expect (this.lastMsg);
            }
        }
        return table[what]();
    }
    sendMessage(message: string){
        this.bot!!.chat(message)
        console.log(this.bot!!.chat);
    }
    sendCommand(command: string){
        this.sendMessage("/" + command)
        return this.waitForEvent("chat");
    }
    quit() {
        this.bot!!.quit()
    }
}
// @ts-ignore
global.mi = new Minepress;

export type { Minepress };