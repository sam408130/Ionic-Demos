#!bin/bash

#ionic build --release android

VERSION=$1
APK_PATH=platforms/android/ant-build
NAME=$APK_PATH/CordovaApp-release-unsigned.apk
OUTPUT=$APK_PATH/ionic-nodeclub-$VERSION.apk
rm $OUTPUT
Jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore android-release-key.keystore $NAME alias_name
~/android/sdk/build-tools/21.1.2/zipalign -v 4 $NAME $OUTPUT
