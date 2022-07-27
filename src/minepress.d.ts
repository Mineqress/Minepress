import { Minepress } from "Minepress";
import {Item as ITem} from "prismarine-item"
declare global {
    const mi: Minepress
    const Item: typeof ITem
}