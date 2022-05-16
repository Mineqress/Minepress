import { Minepress } from ".";
import {Item as ITem} from "prismarine-item"
declare global {
    const mi: Minepress
    const Item: typeof ITem
}