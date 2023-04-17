#!/bin/bash

rm -rf ./out
mkdir out
cd ../orakul-ui 
if [ ! -d "./node_modules" ] 
then
    npm ci
fi
npm run build:extension
cp -r ./build/static ../architecture-view-nestjs/out