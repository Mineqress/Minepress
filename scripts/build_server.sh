#!/bin/bash

set -e

mkdir server
cd server
wget https://cdn.getbukkit.org/spigot/spigot-1.8.8-R0.1-SNAPSHOT-latest.jar -O server.jar
echo "eula=true" > eula.txt
mkdir plugins
