# Android GhostVM

#### I like to challenge other developers to make an app that can detect the GhostVM

#### Note: It is best to use Arm Based system since most Anti-VM apps will block x86

#### This is still in beta and will need a lot more contributions to bypass detections

<hr/>

[![Demo](http://img.youtube.com/vi/Q6lmCbhcKDc/0.jpg)](http://www.youtube.com/watch?v=Q6lmCbhcKDc "Undetectable Android Emulator")

<hr/>

### How to start:

```
Download frida server and move it to /redroid/frida-server

Start container via `sudo docker compose up --remove-orphans`

Connect to Display via ./screen.sh and install your APK by drag and drop

Stop the Container

Put APK Package Name in /ubuntu/setup.sh

Now start the container and frida should spawn the app
```
