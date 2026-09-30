[app]

​(str) Title of your application 

​title = AbbasBot

​(str) Package name 

​package.name = abbasbot

​(str) Package domain (needed for android/ios packaging) 

​package.domain = org.kivy

​(str) Source code where the main.py live 

​source.dir = .

​(list) Source files to include (let empty to include all the files) 

​source.include_exts = py,png,jpg,kv,atlas,json

​(str) Application versioning 

​version = 1.0

​(list) Application requirements ​هذه أهم نقطة: هنا نضع المكتبات التي يحتاجها تطبيقك ليعمل بدون مشاكل 

​requirements = python3, kivy, kivymd, pyrogram, tgcrypto, jnius, asyncio

​(str) Supported orientations 

​orientation = portrait

​ ​Android specific ​ ​(bool) Indicate if the application should be fullscreen or not 

​fullscreen = 0

​(list) Permissions ​هذه الصلاحيات تسمح للتطبيق بالإنترنت، والبقاء في الخلفية، ومنع الشاشة من النوم 

​android.permissions = INTERNET, FOREGROUND_SERVICE, WAKE_LOCK

​(int) Target Android API, should be as high as possible. 

​android.api = 33

​(int) Minimum API your APK / AAB will support. 

​android.minapi = 21

​(str) Android entry point, default is ok for Kivy-based app 

​android.entrypoint = org.kivy.android.PythonActivity

​(str) Android app theme, default is ok for Kivy-based app 

​android.apptheme = "@android:style/Theme.NoTitleBar"

​(list) Services to declare ​هذا هو السطر السحري الذي يخبر الأندرويد أن ملف service.py هو خدمة خلفية لا تموت 

​services = pyservice:service.py

​(str) Android logcat filters to use 

​android.logcat_filters = *:S python:D

​(str) Android architecture to build for 

​android.archs = arm64-v8a, armeabi-v7a

​(bool) enables Android auto backup feature (Android API >=23) 

​android.allow_backup = True

​[buildozer]

​(int) Log level (0 = error only, 1 = info, 2 = debug) 

​log_level = 2

​(int) Display warning if buildozer is run as root 

​warn_on_root = 1
