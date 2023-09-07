#!/bin/bash

rm -rf ./out
mkdir out
cd ../orakul-ui 
if [ ! -d "./node_modules" ] 
then
    npm ci
fi
npm run build:extension
cp -r ./build/assets ../architecture-view-nestjs/out