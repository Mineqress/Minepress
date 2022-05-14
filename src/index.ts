/// <reference types="mocha"/>
import { Bot, BotEvents, BotOptions, createBot } from "mineflayer"
import { Chance } from "chance";
import { Expect } from "@minepress/minexpect";

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
        this.bot!!.on("messagestr", (msg, position) => {
            this.lastMsg = msg;
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
                return new Expect(this.lastMsg, (retry) => {
                    this.bot?.on("messagestr", retry);
                }, (retry) => {
                    this.bot?.removeListener("chat", retry)
                });
            }
        }
        return table[what]();
    }
    sendMessage(message: string){
        this.bot!!.chat(message)
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