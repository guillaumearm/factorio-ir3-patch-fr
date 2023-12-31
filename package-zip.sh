#!/bin/bash

VERSION=$(cat info.json | jq -r .version || exit)
BUILD_FOLDER=build
MOD_DIRNAME=IR3_PatchFR_$VERSION
MOD_ZIPNAME=$MOD_DIRNAME.zip

rm -rf $BUILD_FOLDER
mkdir -p $BUILD_FOLDER/$MOD_DIRNAME

cp LICENSE $BUILD_FOLDER/$MOD_DIRNAME
cp info.json $BUILD_FOLDER/$MOD_DIRNAME
cp changelog.txt $BUILD_FOLDER/$MOD_DIRNAME
cp -r locale $BUILD_FOLDER/$MOD_DIRNAME

cd build
zip -r $MOD_ZIPNAME $MOD_DIRNAME/
cd - > /dev/null

echo "> Created package $MOD_DIRNAME.zip"

