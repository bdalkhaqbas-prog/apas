[app]
title = VIP Panel
package.name = panel
package.domain = org.vip
source.dir = .
source.include_exts = py,png,jpg,kv
version = 1.0
requirements = python3,kivy,telethon
orientation = portrait
services = myservice:service.py:foreground
android.permissions = INTERNET,FOREGROUND_SERVICE,POST_NOTIFICATIONS,WAKE_LOCK
android.api = 33
android.minapi = 24
android.archs = arm64-v8a

[buildozer]
log_level = 2
