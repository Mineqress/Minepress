#!/bin/bash

set -e
cd server/plugin
mvn package
cp target/*.jar ../plugins/