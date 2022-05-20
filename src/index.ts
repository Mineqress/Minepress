/// <reference types="mocha"/>
import { Bot, BotEvents, BotOptions, createBot } from "mineflayer"
import { Chance } from "chance";
import { Expect } from "@minepress/minexpect";
import { Item } from "prismarine-item";
const chance = new Chance();
type What = "last.message" | "hotbar.slot" | "hand.item.type" | "hand.item.displayname" | "hand.item.amount"
class Inventory {
    bot: Bot
    constructor(bot: Bot){
        this.bot = bot;
    }
    expect(what: "hasOpenWindow"){
        let openCb: () => void
        let closeCb: () => void
        return new Expect(this.bot.currentWindow != null, (retry) => {
            openCb = () => {
                retry(true);
            }
            closeCb = () => {
                retry(false)
            }
            this.bot.on("windowOpen", openCb);
            this.bot.on("windowClose", closeCb)
        }, (retry) => {
            this.bot.removeListener("windowOpen", openCb);
            this.bot.removeListener("windowClose", closeCb);
        }, 1990);
    }
    async currentWindowContains(item: Item){
        const containsItem = () => {
            let contains = false;
            this.bot.currentWindow?.slots.forEach((i) => {
                if(Item.equal(i, item, true)){
                    contains = true
                }
            })
            return contains;
        }
        let cb: (slot: number, _: Item, newItem: Item) => void;
        await new Expect(containsItem(), (retry) => {
            
            const inv = this.bot.currentWindow;
            cb = (slot, _, newItem) => {
                retry(containsItem())
            };
            inv?.on("updateSlot", cb)
        }, (retry) => {
            const inv = this.bot.currentWindow;
            inv?.removeListener("updateSlot", cb);
        }, 5000).toBe(true)
    }
    async contains(item: Item, options?: {ignoreAmount: boolean}){
        const containsItem = () => {
            let contains = false;
            this.bot.inventory.slots.forEach((i) => {
                if(Item.equal(i, item, options? options.ignoreAmount: true)){
                    contains = true
                }
            })
            return contains;
        }
        const inv = this.bot!!.inventory;
        let cb: (slot: number, _: Item, newItem: Item) => void;
        await new Expect(containsItem(), (retry) => {
            cb = (slot, _, newItem) => {
                retry(containsItem())
            };
            inv.on("updateSlot", cb)
        }, (retry) => {
            inv.removeListener("updateSlot", cb);
        }, 5000).toBe(true)
    }
}
class Minepress {
    /* Export the item class */
    inventory: Inventory | null = null;
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
                this.inventory = new Inventory(this.bot!!)
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