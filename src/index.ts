/// <reference types="mocha"/>
import { Bot, BotEvents, BotOptions, createBot } from "mineflayer"
import { Chance } from "chance";
import { Expect } from "@minepress/minexpect";
import { Item } from "prismarine-item";

const chance = new Chance();
type What = "last.message" | "hotbar.slot" | "hand.item.type" | "hand.item.displayname" | "hand.item.amount"

class Minepress {

    private bot?: Bot;
    private lastMsg?: string;
    joinServer(server: BotOptions) {
        return new Promise<void>((resolve, reject) => {
            if (!this.bot) {
                this.bot = createBot({
                    ...server,
                    username: server.username || chance.name().replace(" ", "").substring(0, 16)
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
                    this.bot?.removeListener("messagestr", retry)
                }, 10000);
            },
            "hotbar.slot": () => { 

                const inv = this.bot!!.inventory;
                return new Expect(this.bot?.quickBarSlot, (retry) => {
                    inv.on("heldItemChanged", retry);
                }, (retry) => {
                    inv.removeListener("heldItemChanged", retry);
                }, 5000);
            },
            "hand.item.type": () => {
                const inv = this.bot!!.inventory;
                let cb: (slot: number, _: Item, newItem: Item) => void;
                const item = inv.slots[this.bot!!.quickBarSlot];
                return new Expect(item? item.type: 0, (retry) => {
                    cb = (slot, _, newItem) => {
                        if(slot-28 == this.bot!!.quickBarSlot){
                            retry(newItem.type)
                        }
                    };
                    inv.on("updateSlot", cb)
                }, (retry) => {
                    inv.removeListener("updateSlot", cb);
                }, 5000)
            },

            "hand.item.displayname": () => {
                const inv = this.bot!!.inventory;
                let cb: (slot: number, _: Item, newItem: Item) => void;
                const item = inv.slots[this.bot!!.quickBarSlot];
                return new Expect(item?.displayName, (retry) => {
                    cb = (slot, _, newItem) => {
                        if(slot == this.bot!!.quickBarSlot){
                            retry(newItem.displayName)
                        }
                    };
                    inv.on("updateSlot", cb)
                }, (retry) => {
                    inv.removeListener("updateSlot", cb);
                }, 5000)
            },
            "hand.item.amount": () => {
                const inv = this.bot!!.inventory;
                let cb: (slot: number, _: Item, newItem: Item) => void;
                const item = inv.slots[this.bot!!.quickBarSlot];
                return new Expect(item? item.count: 0, (retry) => {
                    cb = (slot, _, newItem) => {
                        if(slot-28 == this.bot!!.quickBarSlot){
                            retry(newItem.count)
                        }
                    };
                    inv.on("updateSlot", cb)
                }, (retry) => {
                    inv.removeListener("updateSlot", cb);
                }, 5000)
            }
        }
        return table[what]();
    }
    setHotbarSlot(slot: number) {
        this.bot!!.setQuickBarSlot(slot)
    }
    clickHandItem(){
        this.bot!!.activateItem()
    }
    clickOnInventory(slot: number, button: "left" | "right"){
        let map = {
            left: 0,
            right: 1
        }
        this.bot!!.clickWindow(slot, map[button], 0)
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