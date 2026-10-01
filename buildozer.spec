[app]
title = VIP Panel
package.name = panel
package.domain = org.vip
source.dir = .
source.include_exts = py,png,jpg,kv
version = 1.0
requirements = python3,kivy,telethon,pyaes,rsa,pyasn1
orientation = portrait
services = myservice:service.py:foreground
android.permissions = INTERNET,FOREGROUND_SERVICE,POST_NOTIFICATIONS,WAKE_LOCK
android.api = 33
android.minapi = 24
android.archs = arm64-v8a
android.accept_sdk_license = True

[buildozer]
log_level = 2
warn_on_root = 1
