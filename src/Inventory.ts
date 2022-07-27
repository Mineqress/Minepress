import { Bot } from "mineflayer";
import { Expect } from "@minepress/minexpect";
import { Item } from "prismarine-item";

export class Inventory {
    bot: Bot;
    constructor(bot: Bot) {
        this.bot = bot;
    }
    expect(what: "hasOpenWindow") {
        let openCb: () => void;
        let closeCb: () => void;
        return new Expect(this.bot.currentWindow != null, (retry) => {
            openCb = () => {
                retry(true);
            };
            closeCb = () => {
                retry(false);
            };
            this.bot.on("windowOpen", openCb);
            this.bot.on("windowClose", closeCb);
        }, (retry) => {
            this.bot.removeListener("windowOpen", openCb);
            this.bot.removeListener("windowClose", closeCb);
        }, 1990);
    }
    async currentWindowContains(item: Item) {
        const containsItem = () => {
            let contains = false;
            this.bot.currentWindow?.slots.forEach((i) => {
                if (Item.equal(i, item, true)) {
                    contains = true;
                }
            });
            return contains;
        };
        let cb: (slot: number, _: Item, newItem: Item) => void;
        await new Expect(containsItem(), (retry) => {

            const inv = this.bot.currentWindow;
            cb = (slot, _, newItem) => {
                retry(containsItem());
            };
            inv?.on("updateSlot", cb);
        }, (retry) => {
            const inv = this.bot.currentWindow;
            inv?.removeListener("updateSlot", cb);
        }, 5000).toBe(true);
    }
    async contains(item: Item, options?: { ignoreAmount: boolean; }) {
        const containsItem = () => {
            let contains = false;
            this.bot.inventory.slots.forEach((i) => {
                if (Item.equal(i, item, options ? options.ignoreAmount : true)) {
                    contains = true;
                }
            });
            return contains;
        };
        const inv = this.bot!!.inventory;
        let cb: (slot: number, _: Item, newItem: Item) => void;
        await new Expect(containsItem(), (retry) => {
            cb = (slot, _, newItem) => {
                retry(containsItem());
            };
            inv.on("updateSlot", cb);
        }, (retry) => {
            inv.removeListener("updateSlot", cb);
        }, 5000).toBe(true);
    }
}
