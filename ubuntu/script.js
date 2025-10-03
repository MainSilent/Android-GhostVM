
// ------------------------------------- Device Information -------------------------------------
Java.performNow(function() {
  const Build = Java.use('android.os.Build')

  Build.MANUFACTURER.value = "Samsung"
  Build.MODEL.value = "SM-G973F"
  Build.BRAND.value = "samsung"
  Build.DEVICE.value = "beyond1"
  Build.PRODUCT.value = "beyond1lte"
  Build.HARDWARE.value = "qcom"
  Build.FINGERPRINT.value = "samsung/beyond1ltexx/beyond1:10/QP1A.190711.020/G973FXXS8DTA2:user/release-keys"
  Build.ID.value = "QP1A.190711.020.G973FXXS8DTA2"
  Build.TAGS.value = "release-keys"
  Build.TYPE.value = "user"

  console.log("Device Information Changed.")
})


// ------------------------------------- Anti-Root Bypass -------------------------------------
const ReadOnly = ["/system", "/system/bin", "/system/sbin", "/system/xbin", "/vendor/bin", "/sbin", "/etc"]

const RootBin = [
  "/data/local/su", "/data/local/bin/su", "/data/local/xbin/su",
  "/sbin/su", "/system/bin/su", "/system/bin/.ext/su", "/system/bin/failsafe/su", "/system/sd/xbin/su",
  "/su/xbin/su", "/su/bin/su", "/magisk/.core/bin/su", "/system/usr/we-need-root/su", "/system/xbin/su"
]

Java.perform(function() {
  const libc = Process.getModuleByName('libc.so')
  if (libc) {
    try {
      const accessSymbol = libc.getExportByName('access')
      Interceptor.attach(accessSymbol, {
        onEnter(args) {
          const path = args[0].readUtf8String()
          if (RootBin.includes(path)) {
            this.block = true
            console.log("[!] File Check Intercepted")
          }
        },
        onLeave(retval) {
          retval.replace(1)
        }
      })
    }
    catch(e) {
      console.log("Failed to Intercept 'access'")
      console.log(e)
    }


    try {
      const fopenSymbol = libc.getExportByName('fopen')
      Interceptor.attach(fopenSymbol, {
        onEnter(args) {
          if (args[0].readUtf8String() == "/proc/mounts")
            this.block = true
        },
        onLeave(retval) {
          if (this.block)
            retval.replace(ptr(0))
        }
      })
    }
    catch(e) {
      console.log("Failed to Intercept 'fopen'")
      console.log(e)
    }
  }
})


// ------------------------------------- Anti-Debug Bypass -------------------------------------
Java.perform(function() {
  const libc = Process.getModuleByName('libc.so')
  if (libc) {
    try {
      const open = libc.getExportByName('__system_property_get')
      Interceptor.attach(open, {
        onEnter(args) {
          this.keys = args[0].readUtf8String()
          this.resultPtr = new NativePointer(args[1])
        },
        onLeave(retval) {
          switch (this.keys) {
            case "ro.build.tags":
              const newVal = "release-keys"
              this.resultPtr.writeUtf8String(newVal)
              retval.replace(ptr(newVal.length))
              break
            case "ro.debuggable":
              this.resultPtr.writeInt(0)
              retval.replace(0x1)
              break
            case "ro.secure":
              this.resultPtr.writeInt(1)
              retval.replace(0x1)
              break
          }

          // console.log(this.keys)
          // console.log(this.resultPtr.readUtf8String()+'\n')
        }
      })
    }
    catch(e) {
      console.log("Failed to Intercept '__system_property_get'")
      console.log(e)
    }
  }
})