[app]

# اسم التطبيق
title =  control

# اسم الحزمة
package.name = abbasbot

# نطاق الحزمة
package.domain = org.kivy

# مجلد المشروع الذي يحتوي main.py
source.dir = .

# الملفات التي سيتم تضمينها
source.include_exts = py,png,jpg,kv,atlas,json

# إصدار التطبيق
version = 1.0

# المكتبات المطلوبة
requirements = python3,kivy,kivymd,pyrogram,tgcrypto,pyjnius

# اتجاه الشاشة
orientation = portrait

# تشغيل ملء الشاشة
fullscreen = 0


# ============================================================
# Android
# ============================================================

# الصلاحيات
android.permissions = INTERNET,FOREGROUND_SERVICE,WAKE_LOCK

# إصدار Android المستهدف
android.api = 33

# أقل إصدار Android مدعوم
android.minapi = 21

# نقطة تشغيل تطبيق Kivy
android.entrypoint = org.kivy.android.PythonActivity

# مظهر التطبيق
android.apptheme = @android:style/Theme.NoTitleBar

# خدمة الخلفية
services = pyservice:service.py

# إعدادات Logcat
android.logcat_filters = *:S python:D

# معماريات Android
android.archs = arm64-v8a,armeabi-v7a

# النسخ الاحتياطي
android.allow_backup = True


# ============================================================
# Buildozer
# ============================================================

# مستوى السجل
log_level = 2

# التحذير عند التشغيل كـ root
warn_on_root = 1
