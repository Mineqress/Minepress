# MinePress
The minecraft testing framework

![Imgur](https://i.imgur.com/3nd2ASc.png)
# What's this?
Minepress allows you to make a minecraft bot which you can control
and make assertions of what it sees

# How to use
You just need to create a folder called `minepress`  
All files ending in `*.test.js` will be recognized by minepress
```console
 > npm install @minepress/minepress
 # If you're using npm
 > ./node_modules/.bin/minepress
 # If you're using pnpm or yarn
 > <package manager> minepress 
```
# Libraries
 - [Mineflayer](https://github.com/PrismarineJS/mineflayer): This is the main library of the project, it is an stable api for creating minecraft bots on javascript, which works on all versions. It's part of the Prismarine project
 - [MochaJS](https://github.com/mochajs/mocha): Test runner, without its flexible api it wouldn't be possible to make this project
 - [Minexpect](https://github.com/Mineqress/minexpect): Retry-and-timout assertion library made by me :)
# Why?
When i'm developing minecraft plugins, whenever i change something, i need recompile and do a bunch of crazy and repetitive things on the client, **i just need something to automate this**. its so exhausting and, also, if i'm doing it on recent versions of minecraft like 1.15-1.18, my pc **cries** with 4GB of ram

I just want to type a command and it tests everything without making my fingers or my pc scream in pain
