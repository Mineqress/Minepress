#!/bin/bash

set -e
git clone https://github.com/Mineqress/plugin-template server/plugin
scripts/compile-testing-plugin.sh
