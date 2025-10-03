#!/bin/sh
set -e

echo "setting permissions"
chmod 755 /redroid/frida-server

echo "starting frida-server in background"
/redroid/frida-server &