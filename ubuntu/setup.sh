#!/bin/sh
set -e


PACKAGE_NAME="com.example"


DEBIAN_FRONTEND=noninteractive
TZ=Etc/UTC
ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ >/etc/timezone
apt-get update && apt-get install -y --no-install-recommends tzdata


echo "------------ Run Frida Server ------------"
apt-get -y install android-tools-adb
adb connect redroid:5555
adb shell "sh /redroid/run-frida.sh" &


echo "------------ Install Frida Client ------------"
apt-get -y install python3 python3-pip python3.13-venv
python3 -m venv .venv
. .venv/bin/activate
pip3 install frida frida-tools


echo "------------ Run Frida Script ------------"
mkdir -p /root/.cache/frida/
cp /ubuntu/gadget-android-arm64.so /root/.cache/frida/
frida -U -f $PACKAGE_NAME -l "/ubuntu/script.js"