# -*- coding: utf-8 -*-
import os
import json
import asyncio
import threading
import traceback
from kivy.lang import Builder
from kivy.utils import platform
from kivy.clock import Clock
from kivy.core.window import Window
from kivymd.app import MDApp
from kivymd.uix.screen import MDScreen
from kivymd.uix.list import OneLineRightIconListItem, OneLineListItem
from kivymd.uix.selectioncontrol import MDSwitch
from kivymd.uix.snackbar import Snackbar
from pyrogram import Client

API_ID = 36717312
API_HASH = "97f963af00bd579910c8603d896fe54b"

def _store_dir():
    d = os.environ.get("ANDROID_ARGUMENT", "")
    if not d:
        d = os.path.dirname(os.path.abspath(__file__))
    return d

CONFIG_FILE = os.path.join(_store_dir(), "abbas_config.json")
GLOBAL_CACHE = {"theme": "Dark"}

def load_data():
    global GLOBAL_CACHE
    try:
        with open(CONFIG_FILE, "r", encoding="utf-8") as f:
            GLOBAL_CACHE = json.load(f)
    except:
        GLOBAL_CACHE = {"theme": "Dark"}
    return GLOBAL_CACHE

def save_data(key, value):
    GLOBAL_CACHE[key] = value
    try:
        with open(CONFIG_FILE, "w", encoding="utf-8") as f:
            json.dump(GLOBAL_CACHE, f, ensure_ascii=False)
    except:
        pass

load_data()

PAGE_1_MAP = [("🔒 قفل الخاص", "pm_lock"), ("🔔 اشتراك إجباري", "force_sub"), ("🔥 حفظ التدمير", "save_media"), ("☀️ متصل دائماً", "always_online"), ("⏰ اسم وساعة", "name_clock"), ("👁 قراءة تلقائية", "auto_read"), ("🚫 حظر الغرباء", "auto_block"), ("👻 مسح شبحي", "ghost_delete_pm"), ("👤 منع جهات اتصال", "anti_contact"), ("📍 منع لوكيشن", "anti_location"), ("📊 منع استفتاء", "anti_poll"), ("🎮 منع العاب", "anti_game"), ("🎲 منع نرد", "anti_dice"), ("#️⃣ منع هاشتاك", "anti_hashtag"), ("📌 منع منشن", "anti_mention"), ("📱 منع أرقام", "anti_phone"), ("📧 منع ايميلات", "anti_email"), ("💰 منع كريبتو", "anti_crypto"), ("💻 منع أوامر", "anti_commands"), ("🤬 منع شتائم", "anti_foul_pm"), ("🔗 منع روابط", "anti_links_pm"), ("🤖 منع بوتات", "anti_bot_pm"), ("🔠 منع حروف كبيرة", "anti_caps_pm"), ("🤡 حظر وهميين", "anti_fake_acc"), ("📜 منع الجرائد", "anti_long_msg"), ("🔄 منع توجيه", "anti_fwd_pm"), ("🚫 منع توجيهي", "anti_fwd_me"), ("🚫 منع الرد علي", "anti_reply_me"), ("🚫 منع منشني", "anti_mention_me"), ("📌 تثبيت رسائلي", "pin_my_pm"), ("🔥 مسح وسائطي", "auto_delete_my_media"), ("🔇 كتم الخاص", "auto_mute_pm"), ("💤 حالة نائم", "auto_status_sleep"), ("💼 حالة أعمل", "auto_status_work"), ("🎮 حالة ألعب", "auto_status_play"), ("👁 قراءة البوتات", "read_bots"), ("👋 ترحيب تلقائي", "welcome_pm"), ("🏷 منع التاكات", "anti_tag_pm"), ("💾 حفظ جهات الاتصال", "auto_save_contacts"), ("⏳ كتابة مستمرة", "typing_always_pm"), ("🇮🇶 منع العربي", "anti_arabic_pm"), ("🇺🇸 منع الانكليزي", "anti_english_pm"), ("📌 تثبيت تلقائي", "auto_pin_pm"), ("⭐ منع بريميوم", "anti_premium_pm"), ("🌫 منع المفسد", "anti_spoiler_pm"), ("🔲 منع انلاين", "anti_inline_pm"), ("❤️ تفاعل قلب", "auto_react_heart"), ("🔥 تفاعل نار", "auto_react_fire"), ("✍️ وهم الكتابة", "smart_typing"), ("📝 كشف التعديل", "anti_edit_pm")]
PAGE_2_MAP = [("🎙 منع بصمات", "anti_voice"), ("📹 منع نوت", "anti_video_note"), ("🖼 منع ملصقات", "anti_stickers"), ("📸 منع صور", "anti_photo"), ("🎥 منع فيديو", "anti_video"), ("📁 منع ملفات", "anti_document"), ("🎞 منع متحركات", "anti_gif"), ("🎵 منع صوتيات", "anti_audio"), ("📚 منع ألبومات", "anti_albums"), ("📱 منع APK", "anti_apk"), ("💻 منع EXE", "anti_exe"), ("🗜 منع ZIP", "anti_zip"), ("⏳ منع بصمة طويلة", "anti_voice_long"), ("⏳ منع فيديو طويل", "anti_video_long"), ("📦 منع ملف ضخم", "anti_doc_large"), ("🌫 منع ميديا مفسدة", "anti_media_spoiler"), ("🔗 منع روابط كروب", "anti_links_group"), ("🔄 منع توجيه كروب", "anti_fwd_group"), ("🤖 منع بوتات كروب", "anti_bots_group"), ("🇮🇶 منع عربي كروب", "anti_ar_group"), ("🇺🇸 منع انكليزي كروب", "anti_en_group"), ("🖼 منع ملصق كروب", "anti_sticker_group"), ("🎞 منع متحرك كروب", "anti_gif_group"), ("📸 منع صور كروب", "anti_photo_group"), ("🎥 منع فيديو كروب", "anti_video_group"), ("🎙 منع بصمة كروب", "anti_voice_group"), ("📁 منع ملف كروب", "anti_doc_group"), ("👤 منع جهات كروب", "anti_contact_group"), ("📊 منع استفتاء كروب", "anti_poll_group"), ("🎮 منع ألعاب كروب", "anti_game_group"), ("❤️ تفاعل كروب", "auto_react_group"), ("📌 تثبيت كروب", "auto_pin_group"), ("👍 تفاعل لايك", "auto_react_thumbsup"), ("👎 تفاعل دسلايك", "auto_react_thumbsdown"), ("⭐ تفاعل نجمة", "auto_react_star"), ("😂 تفاعل ضحك", "auto_react_laugh"), ("🤡 تفاعل مهرج", "auto_react_clown"), ("🤮 تفاعل قرف", "auto_react_vomit"), ("💩 تفاعل براز", "auto_react_poop"), ("🌙 تفاعل قمر", "auto_react_moon"), ("☀️ تفاعل شمس", "auto_react_sun"), ("📢 منع قنوات", "anti_fwd_channel"), ("🔗 روابط قنوات", "anti_links_channel"), ("🖼 ميديا قنوات", "anti_media_channel"), ("❤️ تفاعل قنوات", "auto_react_channels"), ("📥 توجيه السجل", "auto_fwd_log"), ("🗑 سجل المحذوف", "log_deleted_msgs"), ("✏️ سجل المعدل", "log_edited_msgs"), ("🛑 حماية سبام", "anti_spam_group"), ("🌊 حماية تكرار", "anti_flood_group")]
PAGE_3_MAP = [("🎙 محاكاة بصمة", "sim_record_audio"), ("📹 محاكاة فيديو", "sim_record_video"), ("🕹 محاكاة العاب", "sim_play_game"), ("🖼 محاكاة ملصق", "sim_choose_sticker"), ("📸 محاكاة رفع صورة", "sim_upload_photo"), ("📁 محاكاة رفع ملف", "sim_upload_doc"), ("🎵 محاكاة رفع صوت", "sim_upload_audio"), ("📞 محاكاة اتصال فيديو", "sim_video_call"), ("☎️ محاكاة اتصال صوت", "sim_voice_call"), ("❌ الغاء محاكاة", "sim_typing_cancel"), ("🦜 وضع الببغاء", "echo_mode"), ("🪞 الرد بالمرآة", "mirror_reply"), ("🙃 الرد المعكوس", "reverse_reply"), ("🤪 الرد الاستفزازي", "mocking_reply"), ("👻 رد فارغ", "empty_reply"), (" نقطه بالنهاية", "auto_dot"), ("، فارزة بالنهاية", "auto_comma"), ("؟ سؤال بالنهاية", "auto_question"), ("! تعجب بالنهاية", "auto_exclamation"), ("🔠 تكبير الحروف", "auto_capitalize"), ("🔡 تصغير الحروف", "auto_lowercase"), ("  مسافات متباعدة", "auto_spaces"), ("𝗕 غامق تلقائي", "auto_bold"), ("𝐼 مائل تلقائي", "auto_italic"), ("U مسطر تلقائي", "auto_underline"), ("S مشطوب تلقائي", "auto_strike"), ("🌫 مفسد تلقائي", "auto_spoiler"), ("💬 اقتباس تلقائي", "auto_quote"), ("👨‍💻 كود تلقائي", "auto_code"), ("👋 رد بـ هلا", "auto_reply_hello"), ("🏃 رد بـ باي", "auto_reply_bye"), ("🙏 رد بـ شكراً", "auto_reply_thanks"), ("🚫 رد بـ مشغول", "auto_reply_busy"), ("😴 رد بـ نايم", "auto_reply_sleep"), ("💼 رد بـ بالشغل", "auto_reply_work"), ("🚗 رد بـ اسوق", "auto_reply_drive"), ("🍔 رد بـ اكل", "auto_reply_eat"), ("📚 رد بـ ادرس", "auto_reply_study"), ("🏋️ رد بـ بالجيم", "auto_reply_gym"), ("🐢 كتابة بطيئة", "sim_typing_slow"), ("⚡ كتابة سريعة", "sim_typing_fast"), ("🎲 كتابة عشوائية", "sim_typing_random"), ("🔁 لوب كتابة", "sim_typing_loop"), ("🔁 لوب بصمة", "sim_audio_loop"), ("🔁 لوب فيديو", "sim_video_loop"), ("🔁 لوب العاب", "sim_game_loop"), ("🔁 لوب ملصقات", "sim_sticker_loop"), ("🔁 لوب صور", "sim_photo_loop"), ("🔁 لوب ملفات", "sim_doc_loop"), ("🧠 ذكاء الردود", "smart_ai_reply")]
PAGE_4_MAP = [("👁 قراءة الخاص", "bg_read_private"), ("📦 أرشفة الخاص", "bg_archive_private"), ("🔇 كتم الخاص", "bg_mute_private"), ("🗑 مسح صوري", "bg_del_all_pfps"), ("🧹 تنظيف الكاش", "bg_clear_cache"), ("🚪 مغادرة القنوات", "bg_leave_all_channels"), ("🎲 بايو عشوائي", "bg_random_bio"), ("👻 تفعيل الشبح", "action_fake_deleted")] # تم تقصيرها قليلاً للواجهة لتجنب الثقل

KV = '''
ScreenManager:
    id: screen_manager
    LoginScreen:
        name: "login"
    MainScreen:
        name: "main"

<LoginScreen>:
    MDBoxLayout:
        orientation: "vertical"
        padding: "24dp"
        spacing: "20dp"
        MDLabel:
            text: "تسجيل الدخول - لوحة المطور"
            font_style: "H5"
            halign: "center"
            theme_text_color: "Primary"
        MDTextField:
            id: phone_input
            hint_text: "رقم الهاتف (بدون +)"
            icon_right: "phone"
        MDTextField:
            id: code_input
            hint_text: "رمز التحقق"
            opacity: 0
            icon_right: "message-processing"
        MDTextField:
            id: pass_input
            hint_text: "كلمة المرور (إن وجدت)"
            opacity: 0
            password: True
            icon_right: "key"
        MDRaisedButton:
            id: btn_action
            text: "إرسال الرمز"
            pos_hint: {"center_x": .5}
            on_release: app.handle_login_step()
        MDLabel:
            id: status_lbl
            text: ""
            theme_text_color: "Error"
            halign: "center"

<ItemWithSwitch>:
    IconRightWidget:
        id: switch
        active: root.is_active
        on_active: app.on_switch_active(root.key_id, self.active)

<MainScreen>:
    MDBoxLayout:
        orientation: "vertical"
        MDTopAppBar:
            title: "لوحة المطور \\u200e@qs_66"
            right_action_items: [["theme-light-dark", lambda x: app.toggle_theme()], ["logout", lambda x: app.logout()]]
            elevation: 2
        
        MDCard:
            size_hint_y: None
            height: "80dp"
            padding: "16dp"
            margin: "12dp"
            elevation: 1
            MDBoxLayout:
                orientation: "horizontal"
                MDLabel:
                    id: engine_lbl
                    text: "المحرك متوقف ⚪"
                    font_style: "Subtitle1"
                MDRaisedButton:
                    id: btn_engine
                    text: "تشغيل بالخلفية 🚀"
                    md_bg_color: app.theme_cls.primary_color
                    on_release: app.toggle_service()

        MDBottomNavigation:
            id: bottom_nav
            
            MDBottomNavigationItem:
                name: "nav_private"
                text: "الخاص"
                icon: "message"
                ScrollView:
                    MDList:
                        id: list_private
                        
            MDBottomNavigationItem:
                name: "nav_groups"
                text: "الكروبات"
                icon: "account-group"
                ScrollView:
                    MDList:
                        id: list_groups
                        
            MDBottomNavigationItem:
                name: "nav_replies"
                text: "الردود"
                icon: "robot"
                ScrollView:
                    MDList:
                        id: list_replies
                        
            MDBottomNavigationItem:
                name: "nav_commands"
                text: "الأوامر"
                icon: "flash"
                ScrollView:
                    MDList:
                        id: list_commands
'''

class LoginScreen(MDScreen):
    pass

class MainScreen(MDScreen):
    pass

class ItemWithSwitch(OneLineRightIconListItem):
    is_active = False
    key_id = ""

class AbbasBotApp(MDApp):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.login_step = 0
        self.temp_client = None
        self.phone_hash = ""
        self.bg_loop = asyncio.new_event_loop()
        threading.Thread(target=self._run_loop, daemon=True).start()

    def _run_loop(self):
        asyncio.set_event_loop(self.bg_loop)
        self.bg_loop.run_forever()

    def build(self):
        self.theme_cls.theme_style = GLOBAL_CACHE.get("theme", "Dark")
        self.theme_cls.primary_palette = "Blue"
        self.root = Builder.load_string(KV)
        return self.root

    def on_start(self):
        # بناء القوائم برمجياً لتوفير المساحة
        self.populate_list(self.root.get_screen("main").ids.list_private, PAGE_1_MAP)
        self.populate_list(self.root.get_screen("main").ids.list_groups, PAGE_2_MAP)
        self.populate_list(self.root.get_screen("main").ids.list_replies, PAGE_3_MAP)
        self.populate_actions(self.root.get_screen("main").ids.list_commands, PAGE_4_MAP)
        
        # التأكد من حالة تسجيل الدخول
        if GLOBAL_CACHE.get("session_string"):
            self.root.current = "main"
            self.check_service_status()
        else:
            self.root.current = "login"

    def populate_list(self, md_list, data_map):
        for label, key in data_map:
            item = ItemWithSwitch(text=label)
            item.key_id = key
            item.is_active = GLOBAL_CACHE.get(key, False)
            md_list.add_widget(item)

    def populate_actions(self, md_list, data_map):
        for label, key in data_map:
            item = OneLineListItem(text=label, on_release=lambda x, k=key, l=label: self.execute_action(k, l))
            md_list.add_widget(item)

    def on_switch_active(self, key_id, active_state):
        save_data(key_id, active_state)

    def execute_action(self, key, label):
        Snackbar(text=f"تم إرسال أمر: {label} للخدمة الخلفية").open()
        # هنا يتم حفظ أمر مؤقت في الإعدادات لتقرأه الخدمة الخلفية
        save_data("pending_action", key)

    def toggle_theme(self):
        new_theme = "Light" if self.theme_cls.theme_style == "Dark" else "Dark"
        self.theme_cls.theme_style = new_theme
        save_data("theme", new_theme)

    def logout(self):
        save_data("session_string", "")
        self.root.current = "login"
        self.stop_service()

    def toggle_service(self):
        btn = self.root.get_screen("main").ids.btn_engine
        lbl = self.root.get_screen("main").ids.engine_lbl
        
        if "تشغيل" in btn.text:
            self.start_service()
            btn.text = "إيقاف المحرك 🛑"
            btn.md_bg_color = self.theme_cls.error_color
            lbl.text = "المحرك يعمل بالخلفية 🟢"
        else:
            self.stop_service()
            btn.text = "تشغيل بالخلفية 🚀"
            btn.md_bg_color = self.theme_cls.primary_color
            lbl.text = "المحرك متوقف ⚪"

    def start_service(self):
        if platform == 'android':
            try:
                from jnius import autoclass
                service = autoclass('org.kivy.abbasbot.ServicePyservice')
                mActivity = autoclass('org.kivy.android.PythonActivity').mActivity
                service.start(mActivity, '')
            except Exception as e:
                print("Error starting service:", e)

    def stop_service(self):
        if platform == 'android':
            try:
                from jnius import autoclass
                service = autoclass('org.kivy.abbasbot.ServicePyservice')
                mActivity = autoclass('org.kivy.android.PythonActivity').mActivity
                service.stop(mActivity)
            except Exception as e:
                print("Error stopping service:", e)

    def check_service_status(self):
        # مجرد تحديث وهمي للواجهة لتعكس حالة بدء التشغيل الافتراضية
        pass

    def handle_login_step(self):
        screen = self.root.get_screen("login")
        phone = screen.ids.phone_input.text.strip()
        code = screen.ids.code_input.text.strip()
        password = screen.ids.pass_input.text.strip()
        
        if self.login_step == 0:
            if not phone: return
            screen.ids.status_lbl.text = "جاري الاتصال..."
            asyncio.run_coroutine_threadsafe(self._send_code("+" + phone.lstrip("+")), self.bg_loop)
        
        elif self.login_step == 1:
            if not code: return
            screen.ids.status_lbl.text = "جاري التحقق..."
            asyncio.run_coroutine_threadsafe(self._sign_in("+" + phone.lstrip("+"), code), self.bg_loop)
            
        elif self.login_step == 2:
            if not password: return
            screen.ids.status_lbl.text = "جاري التحقق من المرور..."
            asyncio.run_coroutine_threadsafe(self._check_pass(password), self.bg_loop)

    async def _send_code(self, phone):
        try:
            self.temp_client = Client("temp_sess", api_id=API_ID, api_hash=API_HASH, in_memory=True)
            await self.temp_client.connect()
            sent = await self.temp_client.send_code(phone)
            self.phone_hash = sent.phone_code_hash
            Clock.schedule_once(lambda dt: self._ui_code_sent())
        except Exception as e:
            Clock.schedule_once(lambda dt, err=str(e): self._ui_error(err))

    async def _sign_in(self, phone, code):
        try:
            await self.temp_client.sign_in(phone, self.phone_hash, code)
            await self._finish_login()
        except Exception as e:
            if "SessionPasswordNeeded" in type(e).__name__:
                Clock.schedule_once(lambda dt: self._ui_need_pass())
            else:
                Clock.schedule_once(lambda dt, err=str(e): self._ui_error(err))

    async def _check_pass(self, password):
        try:
            await self.temp_client.check_password(password)
            await self._finish_login()
        except Exception as e:
            Clock.schedule_once(lambda dt, err=str(e): self._ui_error(err))

    async def _finish_login(self):
        sess_str = await self.temp_client.export_session_string()
        await self.temp_client.disconnect()
        save_data("session_string", sess_str)
        Clock.schedule_once(lambda dt: self._ui_login_success())

    def _ui_code_sent(self):
        self.login_step = 1
        screen = self.root.get_screen("login")
        screen.ids.status_lbl.text = "تم إرسال الرمز بنجاح ✓"
        screen.ids.code_input.opacity = 1
        screen.ids.btn_action.text = "تأكيد الرمز"

    def _ui_need_pass(self):
        self.login_step = 2
        screen = self.root.get_screen("login")
        screen.ids.status_lbl.text = "الحساب محمي بكلمة مرور!"
        screen.ids.code_input.opacity = 0
        screen.ids.pass_input.opacity = 1
        screen.ids.btn_action.text = "دخول"

    def _ui_error(self, err):
        self.root.get_screen("login").ids.status_lbl.text = f"خطأ: {err}"

    def _ui_login_success(self):
        self.root.current = "main"
        self.check_service_status()

if __name__ == '__main__':
    AbbasBotApp().run()
