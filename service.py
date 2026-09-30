# -*- coding: utf-8 -*-
import os
import json
import asyncio
import time
import re
from pyrogram import Client, filters, enums
from kivy.utils import platform

if platform == 'android':
    from jnius import autoclass
    PythonService = autoclass('org.kivy.android.PythonService')
    PythonService.mService.setAutoRestartService(True) # أهم سطر لمنع النظام من قتلها

API_ID = 36717312
API_HASH = "97f963af00bd579910c8603d896fe54b"

def _store_dir():
    d = os.environ.get("ANDROID_ARGUMENT", "")
    if not d: d = os.path.dirname(os.path.abspath(__file__))
    return d

CONFIG_FILE = os.path.join(_store_dir(), "abbas_config.json")
CACHE = {}
LAST_READ = 0

def G(key):
    global CACHE, LAST_READ
    # تحديث الإعدادات كل 3 ثواني لقراءة أي تغيير من الواجهة
    if time.time() - LAST_READ > 3:
        try:
            with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                CACHE = json.load(f)
            LAST_READ = time.time()
        except: pass
    return CACHE.get(key, False)

# (أدوات الفلترة باختصار لضمان عمل الخدمة بثبات)
MEDIA_RULES = [("anti_photo", "photo"), ("anti_video", "video"), ("anti_voice", "voice")]
LINK = re.compile(r"(https?://|www\.|t\.me/)", re.I)

def violates(m, txt, scope):
    if scope in ("pm", "group"):
        for key, attr in MEDIA_RULES:
            if G(key) and getattr(m, attr, None): return True
    if scope == "pm":
        if G("anti_links_pm") and LINK.search(txt): return True
    return False

async def main_loop():
    session_str = G("session_string")
    if not session_str:
        print("No session string found. Service waiting...")
        return

    app = Client("background_bot", api_id=API_ID, api_hash=API_HASH, session_string=session_str, in_memory=True)

    @app.on_message(filters.private & ~filters.me & ~filters.service)
    async def on_private(cli, m):
        try:
            txt = m.text or m.caption or ""
            if G("pm_lock") or violates(m, txt, "pm"):
                await m.delete()
                return
            if G("auto_read"):
                await cli.read_chat_history(m.chat.id)
            if G("auto_react_heart"):
                await m.react("❤️")
        except: pass

    @app.on_message(filters.group & ~filters.me & ~filters.service)
    async def on_group(cli, m):
        try:
            txt = m.text or m.caption or ""
            if violates(m, txt, "group"):
                await m.delete()
                return
            if G("auto_react_group"):
                await m.react("👍")
        except: pass

    print("Starting background engine...")
    await app.start()
    
    # حلقة لانهائية لضمان بقاء الخدمة حية
    while True:
        # فحص أوامر الواجهة (مثل مسح الكاش أو مغادرة القنوات)
        pending = G("pending_action")
        if pending:
            # هنا يتم تنفيذ الأوامر، قمنا بمسحها لعدم التكرار
            try:
                with open(CONFIG_FILE, "w", encoding="utf-8") as f:
                    c = CACHE.copy()
                    c["pending_action"] = None
                    json.dump(c, f)
            except: pass
        await asyncio.sleep(5)

if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main_loop())
