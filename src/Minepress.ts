import { Bot, BotEvents, BotOptions, createBot } from "mineflayer";
import { Expect } from "@minepress/minexpect";
import { Item } from "prismarine-item";
import { Inventory } from "./Inventory";
import { chance } from "./index";
import {pathfinder, Movements, goals} from "mineflayer-pathfinder"
import MinecraftData from "minecraft-data"
export type ThingToCheck = "last.message" | "hotbar.slot" | "hand.item.type" | "hand.item.displayname" | "hand.item.amount"
const ITEM_CHECK_TIMEOUT = 5000;
const LAST_MESSAGE_CHECK_TIMEOUT = 10000;
export class Minepress {
    /* Export the item class */
    inventory: Inventory | null = null;
    private bot?: Bot;
    private lastMsg?: string;
    async joinServer(server: BotOptions) {
        return new Promise<void>((resolve, reject) => {
            if (!this.bot) {
                this.bot = createBot({
                    ...server,
                    username: server.username || chance.name().replace(" ", "").substring(0, 16)
                });
                this.setupBot();
            } else {
                this.bot.connect(server);
            }
            this.bot.once("spawn", () => {
                this.inventory = new Inventory(this.bot!!);
                resolve();
            });
            this.bot.once("error", (e) => {
                reject();
            });
        });
    }

    private setupBot() {
        this.bot!!.on("messagestr", (msg, position) => {
            this.lastMsg = msg;
        });
        this.bot!!.loadPlugin(pathfinder)
    }
    expect(what: ThingToCheck) {
        switch (what) {
            case "last.message": {
                return new Expect(this.lastMsg, (retry) => {
                    this.bot?.on("messagestr", retry);
                }, (retry) => {
                    this.bot?.removeListener("messagestr", retry);
                }, LAST_MESSAGE_CHECK_TIMEOUT);
            }
            case "hotbar.slot": {

                const inv = this.bot!!.inventory;
                return new Expect(this.bot?.quickBarSlot, (retry) => {
                    inv.on("heldItemChanged", retry);
                }, (retry) => {
                    inv.removeListener("heldItemChanged", retry);
                }, ITEM_CHECK_TIMEOUT);
            }
            case "hand.item.type": {
                const inv = this.bot!!.inventory;
                let cb: (slot: number, _: Item, newItem: Item) => void;
                const item = inv.slots[this.bot!!.quickBarSlot+36];
                return new Expect(item ? item.type : 0, (retry) => {
                    cb = (slot, _, newItem) => {
                        if (slot - 36 == this.bot!!.quickBarSlot) {
                            retry(newItem.type);
                        }
                    };
                    inv.on("updateSlot", cb);
                }, (retry) => {
                    inv.removeListener("updateSlot", cb);
                }, ITEM_CHECK_TIMEOUT);
            }

            case "hand.item.displayname": {
                const inv = this.bot!!.inventory;
                let cb: (slot: number, _: Item, newItem: Item) => void;
                const item = inv.slots[this.bot!!.quickBarSlot+36];
                return new Expect(item?.displayName, (retry) => {
                    cb = (slot, _, newItem) => {
                        if (slot-36 == this.bot!!.quickBarSlot) {
                            retry(newItem.displayName);
                        }
                    };
                    inv.on("updateSlot", cb);
                }, (retry) => {
                    inv.removeListener("updateSlot", cb);
                }, ITEM_CHECK_TIMEOUT);
            }
            case "hand.item.amount": {
                const inv = this.bot!!.inventory;
                let cb: (slot: number, _: Item, newItem: Item) => void;
                const item = inv.slots[this.bot!!.quickBarSlot+36];
                return new Expect(item ? item.count : 0, (retry) => {
                    cb = (slot, _, newItem) => {
                        if (slot - 36 == this.bot!!.quickBarSlot) {
                            retry(newItem.count);
                        }
                    };
                    inv.on("updateSlot", cb);
                }, (retry) => {
                    inv.removeListener("updateSlot", cb);
                }, ITEM_CHECK_TIMEOUT);
            }
        };
    }
    setHotbarSlot(slot: number) {
        this.bot!!.setQuickBarSlot(slot);
    }
    clickHandItem() {
        this.bot!!.activateItem();
    }
    clickOnInventory(slot: number, button: "left" | "right") {
        this.bot!!.clickWindow(slot, button == "left" ? 0 : 1, 0);
    }
    sendMessage(message: string) {
        this.bot!!.chat(message);
    }
    sendCommand(command: string) {
        this.sendMessage("/" + command);
    }
    quit() {
        this.bot!!.quit();
    }
    walkTo(position: {x: number, y: number, z: number}){
        const bot = this.bot!!;
        const mcData = MinecraftData(bot.version)
        const defaultMove = new Movements(bot, mcData);
        defaultMove.scafoldingBlocks = mcData.blocksArray.map(block => block.id);
        bot.pathfinder.setMovements(defaultMove)
        bot.pathfinder.setGoal(new goals.GoalBlock(position.x, position.y, position.z))
    }
}
