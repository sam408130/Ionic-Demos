call cordova build --release android
call del OtrsApp-release-unsigned.apk
copy .\platforms\android\ant-build\OtrsApp-release-unsigned.apk .\OtrsApp-release-unsigned.apk
call jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore OtrsApp-release-unsigned.apk alias_name
del Otrs.apk
call zipalign -v 4 OtrsApp-release-unsigned.apk Otrs.apk
del OtrsApp-release-unsigned.apk