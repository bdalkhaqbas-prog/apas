# -*- coding: utf-8 -*-
# main.py — واجهة Kivy فقط. كل الأزرار تجي من features.py
import os
import re
import time

from kivy.app import App
from kivy.clock import Clock
from kivy.core.text import LabelBase
from kivy.core.window import Window
from kivy.graphics import Color, RoundedRectangle
from kivy.metrics import dp, sp
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.button import Button
from kivy.uix.label import Label
from kivy.uix.scrollview import ScrollView
from kivy.uix.switch import Switch
from kivy.uix.textinput import TextInput
from kivy.utils import get_color_from_hex as HEX
from kivy.utils import platform

import features as F

try:
    import arabic_reshaper
    from bidi.algorithm import get_display
except Exception:
    arabic_reshaper = None

# ---------------- الخط العربي ----------------
HERE = os.path.dirname(os.path.abspath(__file__))
for _p in (
    os.path.join(HERE, "font.ttf"),
    "/system/fonts/NotoNaskhArabic-Regular.ttf",
    "/system/fonts/NotoSansArabic-Regular.ttf",
    "/system/fonts/NotoSansArabicUI-Regular.ttf",
    "/system/fonts/DroidSansArabic.ttf",
):
    if os.path.exists(_p):
        LabelBase.register(name="Roboto", fn_regular=_p, fn_bold=_p)
        break

# Kivy ما يعرض الإيموجي الملوّن، فنشيله من العرض فقط (الأسماء الأصلية تبقى بـ features.py)
EMOJI = re.compile(
    "[\U0001F000-\U0001FAFF\U0001D400-\U0001D7FF\u2190-\u2BFF"
    "\u3030\u303d\u3297\u3299\ufe0f\u200d\u20e3\u200e\u200f]"
)


# طريقة معالجة العربي (غيّرها إذا ظهر ترتيب الكلمات غلط):
#   "raw"   = نص خام. الأفضل لو مولّد النصوص عند أندرويد يرتّب العربي بنفسه (حالتك)
#   "full"  = تشكيل + عكس الترتيب يدوياً (لو طلعت الحروف منفصلة ومعكوسة)
#   "shape" = تشكيل فقط بدون عكس
AR_MODE = "raw"


def ar(s):
    s = EMOJI.sub("", str(s)).strip()
    if AR_MODE == "raw" or not arabic_reshaper:
        return s
    try:
        s = arabic_reshaper.reshape(s)
        return get_display(s) if AR_MODE == "full" else s
    except Exception:
        return s


# ---------------- الثيمات ----------------
THEMES = {
    "dark": {
        "bg": "#131314", "surface": "#1E1F20", "surface2": "#2B2C2E",
        "text": "#E3E3E3", "sub": "#9AA0A6", "primary": "#8AB4F8",
        "on_primary": "#062E6F", "container": "#0B3A75", "green": "#81C995",
        "green_c": "#0F3D22", "red": "#F28B82", "red_c": "#5C2B29",
    },
    "light": {
        "bg": "#F8F9FA", "surface": "#FFFFFF", "surface2": "#E8EAED",
        "text": "#202124", "sub": "#5F6368", "primary": "#1A73E8",
        "on_primary": "#FFFFFF", "container": "#D2E3FC", "green": "#1E8E3E",
        "green_c": "#E6F4EA", "red": "#D93025", "red_c": "#FCE8E6",
    },
}


def T(name):
    return HEX(THEMES.get(F.C("theme", "dark"), THEMES["dark"])[name])


def kind_colors(kind):
    return {
        "filled": (T("primary"), T("on_primary")),
        "tonal": (T("container"), T("primary")),
        "surface": (T("surface2"), T("text")),
        "danger": (T("red_c"), T("red")),
        "success": (T("green_c"), T("green")),
    }[kind]


# ---------------- عناصر الواجهة ----------------
class RLabel(Label):
    def __init__(self, text="", size=15, color=None, bold=False, auto=True, halign="right", **kw):
        super().__init__(
            text=ar(text), color=color or T("text"), font_size=sp(size),
            bold=bold, halign=halign, valign="middle", **kw)
        self.bind(width=lambda i, w: setattr(i, "text_size", (w, None)))
        if auto:
            self.size_hint_y = None
            self.bind(texture_size=lambda i, ts: setattr(i, "height", ts[1] + dp(8)))
        else:
            self.bind(height=lambda i, h: setattr(i, "text_size", (i.width, h)))

    def set(self, value):
        self.text = ar(value)


class Card(BoxLayout):
    def __init__(self, bg="surface", radius=14, **kw):
        super().__init__(**kw)
        with self.canvas.before:
            self._c = Color(*T(bg))
            self._r = RoundedRectangle(pos=self.pos, size=self.size, radius=[dp(radius)])
        self.bind(pos=self._upd, size=self._upd)

    def _upd(self, *a):
        self._r.pos = self.pos
        self._r.size = self.size


def pill(text, cb, kind="filled", **kw):
    bg, fg = kind_colors(kind)
    b = Button(
        text=ar(text), background_normal="", background_down="",
        background_color=bg, color=fg, font_size=sp(15),
        size_hint_y=None, height=dp(46), **kw)
    b.bind(on_release=lambda *_: cb())
    return b


def set_kind(b, kind):
    bg, fg = kind_colors(kind)
    b.background_color = bg
    b.color = fg


def field(hint, **kw):
    h = kw.pop("height", dp(46))
    return TextInput(
        hint_text=ar(hint), background_color=T("surface"), foreground_color=T("text"),
        hint_text_color=T("sub"), cursor_color=T("primary"), padding=[dp(12), dp(12)],
        size_hint_y=None, height=h, write_tab=False, **kw)


UI_ERR = os.path.join(F.DATA, "ui_error.txt")
SVC_ERR = os.path.join(F.DATA, "service_error.txt")


def last_error():
    """آخر خطأ من تشغيل الخدمة (من الواجهة أو من الخدمة نفسها)."""
    for p in (SVC_ERR, UI_ERR):
        try:
            with open(p, "r", encoding="utf-8") as f:
                t = f.read().strip()
            if t:
                return t[-350:]
        except Exception:
            pass
    return ""


def start_service():
    if platform != "android":
        return
    import traceback
    try:
        os.remove(UI_ERR)
    except Exception:
        pass
    try:
        from android.permissions import request_permissions
        request_permissions(["android.permission.POST_NOTIFICATIONS"])
    except Exception:
        pass
    try:
        from jnius import autoclass
        svc = autoclass("org.vip.panel.ServiceMyservice")
        act = autoclass("org.kivy.android.PythonActivity").mActivity
        svc.start(act, "")
    except Exception:
        try:
            with open(UI_ERR, "w", encoding="utf-8") as f:
                f.write("start_service: " + traceback.format_exc()[-300:])
        except Exception:
            pass


def open_battery_settings():
    if platform != "android":
        return
    try:
        from jnius import autoclass
        Intent = autoclass("android.content.Intent")
        Settings = autoclass("android.provider.Settings")
        act = autoclass("org.kivy.android.PythonActivity").mActivity
        act.startActivity(Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS))
    except Exception:
        pass


# ---------------- التطبيق ----------------
class PanelApp(App):
    title = "VIP Panel"

    def build(self):
        Window.softinput_mode = "below_target"
        Window.clearcolor = T("bg")
        self.box = BoxLayout(orientation="vertical", padding=dp(10), spacing=dp(8))
        self.view = F.VIEWS[0][0]
        self.query = ""
        self.pending = None
        self.pending_t = 0
        self.cb = None
        self.alive = False
        self.st = {}
        self.status_lbl = None
        self.refresh_engine = None
        return self.box

    def on_start(self):
        start_service()
        Clock.schedule_interval(self.tick, 1)
        if F.C("session_string"):
            self.show_dashboard()
        else:
            self.show_login()

    # ---- التواصل مع الخدمة ----
    def send(self, key, text="", cb=None):
        if not self.alive:
            err = last_error()
            self.show_status(("❌ الخدمة متوقفة:\n" + err) if err
                             else "⏳ الخدمة تبدأ... جرّب بعد ثوانٍ")
            return
        cid = int(time.time() * 1000)
        F.write_json(F.CMD_FILE, {"id": cid, "key": key, "text": text})
        self.pending, self.cb, self.pending_t = cid, cb, time.time()
        self.show_status("⏳ جاري التنفيذ...")

    def show_status(self, msg):
        if self.status_lbl:
            self.status_lbl.set(msg)

    def tick(self, dt):
        self.st = F.read_json(F.STATUS_FILE, {}) or {}
        self.alive = time.time() - self.st.get("ts", 0) < 8
        if self.pending:
            res = F.read_json(F.RESULT_FILE, {}) or {}
            if res.get("id") == self.pending:
                cb, msg = self.cb, res.get("msg", "")
                self.pending = self.cb = None
                (cb or self.show_status)(msg)
            elif time.time() - self.pending_t > 600:
                self.pending = self.cb = None
                self.show_status("⚠️ انتهت المهلة")
        if self.refresh_engine:
            self.refresh_engine()

    def new_screen(self):
        self.refresh_engine = None
        self.status_lbl = RLabel("", size=13, color=T("primary"))
        Window.clearcolor = T("bg")
        self.box.clear_widgets()

    # ---- تسجيل الدخول ----
    def show_login(self):
        self.new_screen()
        col = BoxLayout(orientation="vertical", spacing=dp(12), size_hint_y=None)
        col.bind(minimum_height=col.setter("height"))
        col.add_widget(RLabel("تسجيل الدخول", size=26, bold=True, halign="center"))
        col.add_widget(RLabel("استخدم حساب تيليجرام الخاص بك", size=13, color=T("sub"), halign="center"))
        phone = field("رقم الهاتف مع رمز الدولة (بدون +)", multiline=False,
                      input_filter=lambda s, u: "".join(c for c in s if c.isdigit() or c == " "))
        col.add_widget(phone)
        steps = {"code": None, "pw": None}

        def cooldown(n=60):
            def step(dt):
                nonlocal n
                n -= 1
                if n <= 0:
                    btn.disabled = False
                    btn.text = ar("إرسال الرمز مجدداً")
                    return False
                btn.text = ar(f"إعادة الإرسال بعد {n} ثانية")
            btn.disabled = True
            Clock.schedule_interval(step, 1)

        def after_send(msg):
            if msg == "CODE_SENT":
                self.show_status("تم إرسال الرمز بنجاح")
                if not steps["code"]:
                    steps["code"] = field("رمز التحقق", multiline=False,
                                          input_filter="int")
                    col.add_widget(steps["code"])
                    col.add_widget(pill("تأكيد الرمز", lambda: self.send(
                        "auth_sign_in", steps["code"].text, after_login), "success"))
                cooldown()
            else:
                self.show_status(msg)

        def after_login(msg):
            if msg == "LOGGED_IN":
                self.show_dashboard()
            elif msg == "NEED_PASSWORD":
                self.show_status("مطلوب كلمة مرور التحقق بخطوتين")
                if not steps["pw"]:
                    steps["pw"] = field("كلمة المرور", multiline=False, password=True)
                    col.add_widget(steps["pw"])
                    col.add_widget(pill("دخول", lambda: self.send(
                        "auth_password", steps["pw"].text, after_login), "filled"))
            else:
                self.show_status(msg)

        btn = pill("متابعة", lambda: self.send("auth_send_code", phone.text, after_send), "filled")
        col.add_widget(btn)
        col.add_widget(self.status_lbl)
        sv = ScrollView()
        sv.add_widget(col)
        self.box.add_widget(sv)

    # ---- لوحة التحكم ----
    def show_dashboard(self):
        self.new_screen()
        self.logout_armed = False

        # شريط العنوان
        bar = BoxLayout(size_hint_y=None, height=dp(48), spacing=dp(6))
        self.btn_logout = pill("خروج", self.logout_click, "danger", size_hint_x=None, width=dp(72))
        bar.add_widget(self.btn_logout)
        bar.add_widget(pill("ثيم", self.toggle_theme, "surface", size_hint_x=None, width=dp(64)))
        bar.add_widget(RLabel("لوحة المطور @qs_66", size=18, bold=True, auto=False))
        self.box.add_widget(bar)

        main = BoxLayout(orientation="vertical", spacing=dp(8), size_hint_y=None)
        main.bind(minimum_height=main.setter("height"))

        # بطاقة المحرك
        eng = Card(orientation="horizontal", size_hint_y=None, height=dp(80),
                   padding=dp(12), spacing=dp(8))
        self.btn_engine = pill("تشغيل", self.toggle_engine, "filled", size_hint_x=None, width=dp(100))
        eng.add_widget(self.btn_engine)
        info = BoxLayout(orientation="vertical")
        self.eng_title = RLabel("", size=17, bold=True, auto=False)
        self.eng_sub = RLabel("", size=12, color=T("sub"), auto=False)
        info.add_widget(self.eng_title)
        info.add_widget(self.eng_sub)
        eng.add_widget(info)
        main.add_widget(eng)

        if platform == "android":
            main.add_widget(pill("استثناء التطبيق من توفير البطارية", open_battery_settings, "tonal"))

        main.add_widget(self.status_lbl)

        # البحث والتبويبات
        search = field("ابحث عن ميزة", multiline=False)
        search.bind(text=lambda i, v: self.on_search(v))
        main.add_widget(search)

        self.tabs = {}
        tabs_row = BoxLayout(size_hint_y=None, height=dp(44), spacing=dp(6))
        for name, _icon, _items in reversed(F.VIEWS):
            b = pill(name, lambda n=name: self.open_view(n), "surface")
            b.height = dp(44)
            self.tabs[name] = b
            tabs_row.add_widget(b)
        main.add_widget(tabs_row)

        self.counter = RLabel("", size=12, color=T("sub"))
        main.add_widget(self.counter)

        self.cmd_input = field("نص للأوامر (إذاعة / يوزر / قناة / كلمات / ترحيب)",
                               multiline=True, height=dp(90))
        self.list_box = BoxLayout(orientation="vertical", spacing=dp(6), size_hint_y=None)
        self.list_box.bind(minimum_height=self.list_box.setter("height"))
        main.add_widget(self.list_box)

        sv = ScrollView()
        sv.add_widget(main)
        self.box.add_widget(sv)

        self.refresh_engine = self.update_engine_card
        self.rebuild_list()
        self.style_tabs()
        self.update_engine_card()

    def update_engine_card(self):
        enabled = bool(F.C("engine_enabled", True))
        st = self.st
        if not self.alive:
            t, s = "الخدمة غير شغالة", "انتظر ثوانٍ أو افتح التطبيق من جديد"
        elif st.get("running"):
            t, s = "المحرك يعمل", "البوت متصل ويستقبل الرسائل"
        elif st.get("err"):
            t, s = "المحرك متوقف", st["err"][:90]
        elif enabled:
            t, s = "جاري الاتصال...", "ثوانٍ ويشتغل"
        else:
            t, s = "المحرك متوقف", "اضغط تشغيل لبدء العمل بالخلفية"
        self.eng_title.set(t)
        self.eng_sub.set(s)
        self.btn_engine.text = ar("إيقاف" if enabled else "تشغيل")
        set_kind(self.btn_engine, "danger" if enabled else "filled")

    def toggle_engine(self):
        F.save_data("engine_enabled", not bool(F.C("engine_enabled", True)))
        self.update_engine_card()

    def toggle_theme(self):
        F.save_data("theme", "light" if F.C("theme", "dark") == "dark" else "dark")
        self.show_dashboard()

    def logout_click(self):
        if not self.logout_armed:
            self.logout_armed = True
            self.btn_logout.text = ar("تأكيد؟")

            def reset(dt):
                self.logout_armed = False
                self.btn_logout.text = ar("خروج")
            Clock.schedule_once(reset, 5)
            return
        self.send("logout", "", lambda m: self.show_login())

    # ---- القوائم ----
    def items_of(self, view):
        for name, _icon, items in F.VIEWS:
            if name == view:
                return items
        return []

    def open_view(self, name):
        self.view = name
        self.rebuild_list()
        self.style_tabs()

    def on_search(self, value):
        self.query = value or ""
        self.rebuild_list()

    def style_tabs(self):
        for name, b in self.tabs.items():
            set_kind(b, "tonal" if name == self.view else "surface")

    def update_counter(self):
        items = self.items_of(self.view)
        if self.view == "الأوامر":
            self.counter.set(f"{len(items)} أمر")
        else:
            on = sum(1 for _l, k in items if F.G(k))
            self.counter.set(f"{on} مفعّل من {len(items)}")

    def rebuild_list(self):
        lb = self.list_box
        lb.clear_widgets()
        q = self.query.strip()
        items = [(l, k) for l, k in self.items_of(self.view) if q in l]
        if self.view == "الأوامر":
            lb.add_widget(self.cmd_input)
            for label, key in items:
                lb.add_widget(self.action_row(label, key))
        else:
            for label, key in items:
                lb.add_widget(self.switch_row(label, key))
        if not items:
            lb.add_widget(RLabel("لا توجد نتائج", color=T("sub")))
        self.update_counter()

    def switch_row(self, label, key):
        row = Card(orientation="horizontal", size_hint_y=None, height=dp(52),
                   padding=[dp(10), dp(4)], spacing=dp(8))
        sw = Switch(active=bool(F.G(key)), size_hint_x=None, width=dp(90))
        sw.bind(active=lambda i, v, k=key: self.on_switch(k, v))
        row.add_widget(sw)
        row.add_widget(RLabel(label, size=15, auto=False))
        return row

    def on_switch(self, key, value):
        F.save_data(key, bool(value))
        self.update_counter()

    def action_row(self, label, key):
        armed = {"on": False}

        def click():
            if key in F.DANGER and not armed["on"]:
                armed["on"] = True
                btn.text = ar("اضغط مرة ثانية للتأكيد")
                set_kind(btn, "danger")

                def reset(dt):
                    armed["on"] = False
                    btn.text = ar(label)
                    set_kind(btn, "tonal")
                Clock.schedule_once(reset, 6)
                return
            armed["on"] = False
            btn.text = ar(label)
            set_kind(btn, "tonal")
            self.send(key, self.cmd_input.text)

        btn = pill(label, click, "tonal")
        return btn


if __name__ == "__main__":
    PanelApp().run()
