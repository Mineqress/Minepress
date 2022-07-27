/// <reference types="mocha"/>
import { Chance } from "chance";
import { Minepress } from "./Minepress";
export const chance = new Chance();
// @ts-ignore
global.mi = new Minepress;

export type { Minepress };