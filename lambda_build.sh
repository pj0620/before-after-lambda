#!/bin/bash

yarn build

cp -rf node_modules dist

zip -r lambda-function.zip ./dist