# -*- coding: utf-8 -*-
# ==========================================================
#  features.py — كل الأزرار والميزات والمحرك (بدون أي واجهة)
#  تشتغل داخل service.py، والواجهة main.py تتواصل معها عبر ملفات JSON
# ==========================================================
import asyncio
import json
import os
import re
import time
import html
import random
import shutil

API_ID = 36717312
API_HASH = "97f963af00bd579910c8603d896fe54b"

# ==========================================================
# 1. التخزين (مشترك بين الواجهة والخدمة)
# ==========================================================


def store_dir():
    base = os.environ.get("ANDROID_PRIVATE") or os.path.dirname(os.path.abspath(__file__))
    d = os.path.join(base, "panel_data")
    try:
        os.makedirs(d, exist_ok=True)
    except Exception:
        d = "."
    return d


DATA = store_dir()
CONFIG_FILE = os.path.join(DATA, "abbas_config.json")
CMD_FILE = os.path.join(DATA, "cmd.json")
RESULT_FILE = os.path.join(DATA, "result.json")
STATUS_FILE = os.path.join(DATA, "status.json")

DEFAULTS = {
    "theme": "dark",
    "smart_typing": True,
    "engine_enabled": True,
    "welcome_text": "Hi 👋 I'll get back to you as soon as I can.",
}


def read_json(path, default=None):
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default


def write_json(path, obj):
    """كتابة ذرّية: لا يقرأ أحد ملفاً نصف مكتوب."""
    tmp = path + ".tmp"
    try:
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(obj, f, ensure_ascii=False)
        os.replace(tmp, path)
    except Exception:
        pass


GLOBAL_CACHE = {}
_LAST = {"t": 0.0, "m": None}


def load_data(force=False):
    """يعيد تحميل الإعدادات إذا تغيّر الملف (الواجهة تكتب والخدمة تقرأ)."""
    now = time.time()
    if not force and GLOBAL_CACHE and now - _LAST["t"] < 0.5:
        return GLOBAL_CACHE
    _LAST["t"] = now
    try:
        m = os.path.getmtime(CONFIG_FILE)
    except OSError:
        m = None
    if force or not GLOBAL_CACHE or m != _LAST["m"]:
        data = read_json(CONFIG_FILE, {}) or {}
        for k, v in DEFAULTS.items():
            data.setdefault(k, v)
        GLOBAL_CACHE.clear()
        GLOBAL_CACHE.update(data)
        _LAST["m"] = m
    return GLOBAL_CACHE


def save_data(key, value):
    data = read_json(CONFIG_FILE, {}) or {}
    for k, v in DEFAULTS.items():
        data.setdefault(k, v)
    data[key] = value
    write_json(CONFIG_FILE, data)
    GLOBAL_CACHE.clear()
    GLOBAL_CACHE.update(data)
    try:
        _LAST["m"] = os.path.getmtime(CONFIG_FILE)
    except OSError:
        pass
    _LAST["t"] = time.time()


def C(key, default=None):
    """قراءة قيمة إعداد."""
    return load_data().get(key, default)


def G(key):
    """قراءة مفتاح تشغيل/إيقاف."""
    return load_data().get(key, False)


# ==========================================================
# 2. قوائم الميزات (هذي الأزرار)
# ==========================================================
PAGE_1_MAP = [("Lock private chats", "pm_lock"), ("Force channel subscription", "force_sub"), ("Save self-destruct media", "save_media"), ("Always online", "always_online"), ("Name clock", "name_clock"), ("Auto read", "auto_read"), ("Block strangers", "auto_block"), ("Ghost delete (my PMs)", "ghost_delete_pm"), ("Block contacts", "anti_contact"), ("Block location", "anti_location"), ("Block polls", "anti_poll"), ("Block games", "anti_game"), ("Block dice", "anti_dice"), ("Block hashtags", "anti_hashtag"), ("Block mentions", "anti_mention"), ("Block phone numbers", "anti_phone"), ("Block emails", "anti_email"), ("Block crypto addresses", "anti_crypto"), ("Block commands", "anti_commands"), ("Block bad words", "anti_foul_pm"), ("Block links", "anti_links_pm"), ("Block bots", "anti_bot_pm"), ("Block ALL CAPS", "anti_caps_pm"), ("Block fake accounts", "anti_fake_acc"), ("Block long messages", "anti_long_msg"), ("Block forwards", "anti_fwd_pm"), ("Block forwards of my msgs", "anti_fwd_me"), ("Block replies to me", "anti_reply_me"), ("Block mentions of me", "anti_mention_me"), ("Pin my messages", "pin_my_pm"), ("Auto-delete my media", "auto_delete_my_media"), ("Mute private chats", "auto_mute_pm"), ("Status: sleeping", "auto_status_sleep"), ("Status: working", "auto_status_work"), ("Status: playing", "auto_status_play"), ("Read bots", "read_bots"), ("Auto welcome", "welcome_pm"), ("Block tags", "anti_tag_pm"), ("Auto-save contacts", "auto_save_contacts"), ("Always typing", "typing_always_pm"), ("Block Arabic", "anti_arabic_pm"), ("Block English", "anti_english_pm"), ("Auto pin", "auto_pin_pm"), ("Block Premium users", "anti_premium_pm"), ("Block spoilers", "anti_spoiler_pm"), ("Block inline bots", "anti_inline_pm"), ("React: heart", "auto_react_heart"), ("React: fire", "auto_react_fire"), ("Typing illusion", "smart_typing"), ("Edit detection", "anti_edit_pm")]
PAGE_2_MAP = [("Block voice", "anti_voice"), ("Block video notes", "anti_video_note"), ("Block stickers", "anti_stickers"), ("Block photos", "anti_photo"), ("Block videos", "anti_video"), ("Block files", "anti_document"), ("Block GIFs", "anti_gif"), ("Block audio", "anti_audio"), ("Block albums", "anti_albums"), ("Block APK", "anti_apk"), ("Block EXE", "anti_exe"), ("Block ZIP", "anti_zip"), ("Block long voice", "anti_voice_long"), ("Block long video", "anti_video_long"), ("Block large files", "anti_doc_large"), ("Block spoiler media", "anti_media_spoiler"), ("Group: block links", "anti_links_group"), ("Group: block forwards", "anti_fwd_group"), ("Group: block bots", "anti_bots_group"), ("Group: block Arabic", "anti_ar_group"), ("Group: block English", "anti_en_group"), ("Group: block stickers", "anti_sticker_group"), ("Group: block GIFs", "anti_gif_group"), ("Group: block photos", "anti_photo_group"), ("Group: block videos", "anti_video_group"), ("Group: block voice", "anti_voice_group"), ("Group: block files", "anti_doc_group"), ("Group: block contacts", "anti_contact_group"), ("Group: block polls", "anti_poll_group"), ("Group: block games", "anti_game_group"), ("Group: auto react", "auto_react_group"), ("Group: auto pin", "auto_pin_group"), ("React: like", "auto_react_thumbsup"), ("React: dislike", "auto_react_thumbsdown"), ("React: star", "auto_react_star"), ("React: laugh", "auto_react_laugh"), ("React: clown", "auto_react_clown"), ("React: vomit", "auto_react_vomit"), ("React: poop", "auto_react_poop"), ("React: moon", "auto_react_moon"), ("React: sun", "auto_react_sun"), ("Channels: block forwards", "anti_fwd_channel"), ("Channels: block links", "anti_links_channel"), ("Channels: block media", "anti_media_channel"), ("Channels: auto react", "auto_react_channels"), ("Forward to log", "auto_fwd_log"), ("Log deleted messages", "log_deleted_msgs"), ("Log edited messages", "log_edited_msgs"), ("Spam protection", "anti_spam_group"), ("Flood protection", "anti_flood_group")]
PAGE_3_MAP = [("Fake: recording voice", "sim_record_audio"), ("Fake: recording video", "sim_record_video"), ("Fake: playing game", "sim_play_game"), ("Fake: choosing sticker", "sim_choose_sticker"), ("Fake: uploading photo", "sim_upload_photo"), ("Fake: uploading file", "sim_upload_doc"), ("Fake: uploading audio", "sim_upload_audio"), ("Fake: video call", "sim_video_call"), ("Fake: voice call", "sim_voice_call"), ("Cancel fake actions", "sim_typing_cancel"), ("Parrot mode", "echo_mode"), ("Mirror reply", "mirror_reply"), ("Reversed reply", "reverse_reply"), ("Mocking reply", "mocking_reply"), ("Empty reply", "empty_reply"), ("Add dot at end", "auto_dot"), ("Add comma at end", "auto_comma"), ("Add ? at end", "auto_question"), ("Add ! at end", "auto_exclamation"), ("UPPERCASE", "auto_capitalize"), ("lowercase", "auto_lowercase"), ("Spaced letters", "auto_spaces"), ("Auto bold", "auto_bold"), ("Auto italic", "auto_italic"), ("Auto underline", "auto_underline"), ("Auto strikethrough", "auto_strike"), ("Auto spoiler", "auto_spoiler"), ("Auto quote", "auto_quote"), ("Auto code", "auto_code"), ("Reply: hello", "auto_reply_hello"), ("Reply: bye", "auto_reply_bye"), ("Reply: thanks", "auto_reply_thanks"), ("Reply: busy", "auto_reply_busy"), ("Reply: sleeping", "auto_reply_sleep"), ("Reply: at work", "auto_reply_work"), ("Reply: driving", "auto_reply_drive"), ("Reply: eating", "auto_reply_eat"), ("Reply: studying", "auto_reply_study"), ("Reply: at the gym", "auto_reply_gym"), ("Slow typing", "sim_typing_slow"), ("Fast typing", "sim_typing_fast"), ("Random typing", "sim_typing_random"), ("Loop: typing", "sim_typing_loop"), ("Loop: voice", "sim_audio_loop"), ("Loop: video", "sim_video_loop"), ("Loop: games", "sim_game_loop"), ("Loop: stickers", "sim_sticker_loop"), ("Loop: photos", "sim_photo_loop"), ("Loop: files", "sim_doc_loop"), ("Smart replies", "smart_ai_reply")]
PAGE_4_MAP = [("Read private", "bg_read_private"), ("Read channels", "bg_read_channels"), ("Read groups", "bg_read_groups"), ("Read bots", "bg_read_bots"), ("Read all", "bg_read_all"), ("Archive private", "bg_archive_private"), ("Archive channels", "bg_archive_channels"), ("Archive groups", "bg_archive_groups"), ("Archive bots", "bg_archive_bots"), ("Archive all", "bg_archive_all"), ("Unarchive all", "bg_unarchive_all"), ("Mute private", "bg_mute_private"), ("Mute channels", "bg_mute_channels"), ("Mute groups", "bg_mute_groups"), ("Mute all", "bg_mute_all"), ("Unmute all", "bg_unmute_all"), ("Pin private", "bg_pin_private"), ("Pin channels", "bg_pin_channels"), ("Pin groups", "bg_pin_groups"), ("Unpin all", "bg_unpin_all"), ("Delete profile photos", "bg_del_all_pfps"), ("Clear Saved Messages", "bg_clear_saved"), ("Clear cache", "bg_clear_cache"), ("Delete contacts", "bg_clear_contacts"), ("Save all as contacts", "bg_add_all_contacts"), ("Leave all channels", "bg_leave_all_channels"), ("Leave all groups", "bg_leave_all_groups"), ("Leave basic groups", "bg_leave_basic_groups"), ("Leave supergroups", "bg_leave_super_groups"), ("Delete my posts", "bg_delete_my_posts"), ("Random bio", "bg_random_bio"), ("Remove bio", "bg_remove_bio"), ("Ghost mode (Deleted Account)", "action_fake_deleted"), ("Fake admin", "action_fake_admin"), ("Restore profile", "action_restore_profile"), ("Broadcast to private", "ask_broadcast_pm"), ("Broadcast to groups", "ask_broadcast_groups"), ("Broadcast to all", "ask_broadcast_all"), ("Forward to all", "ask_broadcast_fwd"), ("Broadcast and pin", "ask_broadcast_pin"), ("Quick stats", "get_stats_fast"), ("Full stats", "get_stats_full"), ("Check limits (SpamBot)", "check_spam_bot"), ("Check Premium", "check_premium"), ("Check sessions", "check_sessions"), ("Set channel", "set_channel"), ("Set post", "set_post"), ("Set log channel", "set_log_channel"), ("Set bad words", "set_bad_words"), ("Change username", "ask_change_user"), ("Set welcome text", "set_welcome"), ("Publish post to channel", "publish_post")]

VIEWS = [
    ("Private", "", PAGE_1_MAP),
    ("Groups", "", PAGE_2_MAP),
    ("Replies", "", PAGE_3_MAP),
    ("Commands", "", PAGE_4_MAP),
]

# أوامر خطيرة تحتاج ضغطتين للتأكيد (تستخدمها الواجهة)
DANGER = {
    "bg_del_all_pfps", "bg_clear_saved", "bg_clear_contacts", "bg_remove_bio",
    "bg_leave_all_channels", "bg_leave_all_groups", "bg_leave_basic_groups",
    "bg_leave_super_groups", "bg_delete_my_posts", "ask_broadcast_pm",
    "ask_broadcast_groups", "ask_broadcast_all", "ask_broadcast_fwd",
    "ask_broadcast_pin", "ask_change_user", "publish_post", "action_fake_deleted",
    "action_fake_admin",
}

# أوامر الإعدادات: تحفظ نصاً فقط وما تحتاج المحرك شغال
NO_CLIENT_OK = {"set_channel", "set_post", "set_log_channel", "set_bad_words", "set_welcome"}

# ==========================================================
# 3. حالة المحرك
# ==========================================================
bot_client_ref = [None]
TICKER = [None]
AUTH = {"client": None, "hash": None, "phone": None}

STATE = {
    "me_id": None,
    "me_username": None,
    "last_name_backup": "",
    "name_on": False,
    "bio_backup": None,
    "status_applied": None,
    "muted": set(),
    "sub_warned": {},
}

MSG_CACHE = {}
FLOOD = {}
CLOCK_RE = re.compile(r"^\| \d{1,2}:\d{2}$")

# ==========================================================
# 4. أدوات النصوص والفلاتر
# ==========================================================
LINK = re.compile(r"(https?://|www\.|t\.me/)", re.I)
PHONE = re.compile(r"\+?\d[\d\s\-]{8,}\d")
EMAIL = re.compile(r"[\w.+-]+@[\w-]+\.[\w.]+")
CRYPTO = re.compile(r"\b(0x[a-fA-F0-9]{40}|bc1[a-z0-9]{20,}|T[A-Za-z0-9]{33})\b")
ARABIC = re.compile(r"[\u0600-\u06FF]")
LATIN = re.compile(r"[A-Za-z]")

MEDIA_RULES = [
    ("anti_photo", "photo"), ("anti_video", "video"), ("anti_voice", "voice"),
    ("anti_document", "document"), ("anti_stickers", "sticker"),
    ("anti_gif", "animation"), ("anti_audio", "audio"),
    ("anti_video_note", "video_note"),
]
PM_ONLY_RULES = [
    ("anti_contact", "contact"), ("anti_location", "location"),
    ("anti_poll", "poll"), ("anti_game", "game"), ("anti_dice", "dice"),
]
GROUP_MEDIA_RULES = [
    ("anti_photo_group", "photo"), ("anti_video_group", "video"),
    ("anti_voice_group", "voice"), ("anti_doc_group", "document"),
    ("anti_sticker_group", "sticker"), ("anti_gif_group", "animation"),
    ("anti_contact_group", "contact"), ("anti_poll_group", "poll"),
    ("anti_game_group", "game"),
]

REACTIONS = [
    ("auto_react_heart", "❤️"), ("auto_react_fire", "🔥"),
    ("auto_react_thumbsup", "👍"), ("auto_react_thumbsdown", "👎"),
    ("auto_react_star", "⭐"), ("auto_react_laugh", "😂"),
    ("auto_react_clown", "🤡"), ("auto_react_vomit", "🤮"),
    ("auto_react_poop", "💩"), ("auto_react_moon", "🌙"),
    ("auto_react_sun", "☀️"),
]

REPLIES = [
    ("auto_reply_hello", "Hey there 👋"), ("auto_reply_bye", "Bye 👋"),
    ("auto_reply_thanks", "You're welcome 🙏"), ("auto_reply_busy", "Busy right now 🚫"),
    ("auto_reply_sleep", "Sleeping right now 😴"), ("auto_reply_work", "At work right now 💼"),
    ("auto_reply_drive", "Driving right now 🚗"), ("auto_reply_eat", "Eating right now 🍔"),
    ("auto_reply_study", "Studying right now 📚"), ("auto_reply_gym", "At the gym right now 🏋️"),
]

SIM_ACTIONS = [
    ("sim_record_audio", "RECORD_AUDIO"), ("sim_record_video", "RECORD_VIDEO"),
    ("sim_play_game", "PLAYING"), ("sim_choose_sticker", "CHOOSE_STICKER"),
    ("sim_upload_photo", "UPLOAD_PHOTO"), ("sim_upload_doc", "UPLOAD_DOCUMENT"),
    ("sim_upload_audio", "UPLOAD_AUDIO"), ("sim_video_call", "RECORD_VIDEO_NOTE"),
    ("sim_voice_call", "RECORD_AUDIO"), ("smart_typing", "TYPING"),
]
SIM_LOOPS = [
    ("sim_typing_loop", "TYPING"), ("sim_audio_loop", "RECORD_AUDIO"),
    ("sim_video_loop", "RECORD_VIDEO"), ("sim_game_loop", "PLAYING"),
    ("sim_sticker_loop", "CHOOSE_STICKER"), ("sim_photo_loop", "UPLOAD_PHOTO"),
    ("sim_doc_loop", "UPLOAD_DOCUMENT"),
]

STATUS_BIOS = [
    ("auto_status_sleep", "💤 Sleeping"),
    ("auto_status_work", "💼 Working"),
    ("auto_status_play", "🎮 Playing"),
]

SMART_RULES = [
    (("السلام عليكم", "assalamu alaikum"), "Wa alaikum assalam 🌹"),
    (("هلا", "مرحبا", "هاي", "hello", "hi", "hey"), "Hey there 👋"),
    (("شلونك", "كيفك", "شخبارك", "how are you"), "I'm good, thanks! How about you? 😊"),
    (("شكرا", "مشكور", "thanks", "thx"), "You're welcome 🙏"),
    (("صباح الخير", "good morning"), "Good morning ☀️"),
    (("مساء الخير", "good evening"), "Good evening 🌙"),
    (("تصبح على خير", "تصبحون على خير", "good night"), "Good night 🌙"),
    (("باي", "مع السلامة", "bye"), "See you 👋"),
]


def smart_reply(txt):
    t = (txt or "").strip().lower()
    if not t:
        return None
    tokens = set(re.findall(r"\w+", t))
    for keys, ans in SMART_RULES:
        for k in keys:
            hit = (k in t) if " " in k else (k in tokens)
            if hit:
                return ans
    if "؟" in t or "?" in t:
        return "Let me check and get back to you 🤔"
    return None


def make_reply_text(txt):
    if G("echo_mode") and txt:
        return txt
    if G("mirror_reply") and txt:
        return txt[::-1]
    if G("reverse_reply") and txt:
        return " ".join(reversed(txt.split()))
    if G("mocking_reply") and txt:
        return "".join(ch.upper() if i % 2 else ch.lower() for i, ch in enumerate(txt))
    if G("empty_reply"):
        return "\u200b"
    for key, answer in REPLIES:
        if G(key):
            return answer
    if G("smart_ai_reply"):
        return smart_reply(txt)
    return None


def entity_names(m):
    ents = list(m.entities or []) + list(m.caption_entities or [])
    return {str(e.type).split(".")[-1].upper() for e in ents}


def remember(m, txt):
    if not txt:
        return
    MSG_CACHE[(m.chat.id, m.id)] = txt
    if len(MSG_CACHE) > 3000:
        MSG_CACHE.pop(next(iter(MSG_CACHE)))


def log_target():
    t = C("log_channel") or "me"
    if isinstance(t, str) and t.lstrip("-").isdigit():
        return int(t)
    return t


def channel_ref():
    ch = C("channel")
    if isinstance(ch, str) and ch.lstrip("-").isdigit():
        return int(ch)
    return ch


def clock_text():
    """الساعة بنظام 12 ساعة (1 بدل 13)."""
    t = time.localtime()
    h = t.tm_hour % 12 or 12
    return f"| {h}:{t.tm_min:02d}"


async def attempt(coro):
    """تنفيذ آمن: أي خطأ يتجاهل ولا يوقف المحرك."""
    try:
        return await coro
    except Exception:
        return None


async def react(m, emoji):
    # تيليجرام يقبل الإيموجي بدون رمز التنسيق FE0F (إصلاح: ❤️ كانت ترفض)
    await attempt(m.react(emoji.replace("\ufe0f", "")))


# ==========================================================
# 5. محرك الفحص (حذف المخالفات)
# ==========================================================
def flood_hit(m, txt):
    u = m.from_user
    if not u or not (G("anti_flood_group") or G("anti_spam_group")):
        return False
    now = time.time()
    key = (m.chat.id, u.id)
    hist = [h for h in FLOOD.get(key, []) if now - h[0] < 6]
    hist.append((now, txt))
    FLOOD[key] = hist
    if len(FLOOD) > 5000:
        FLOOD.pop(next(iter(FLOOD)))
    if G("anti_flood_group") and len(hist) > 5:
        return True
    if G("anti_spam_group") and txt and len(hist) >= 3:
        if all(h[1] == txt for h in hist[-3:]):
            return True
    return False


def violates(m, txt, scope):
    u = m.from_user
    is_bot = bool(u and u.is_bot)
    fwd = bool(getattr(m, "forward_date", None) or getattr(m, "forward_origin", None))

    if scope in ("pm", "group"):
        for key, attr in MEDIA_RULES:
            if G(key) and getattr(m, attr, None):
                return True
        extra = PM_ONLY_RULES if scope == "pm" else GROUP_MEDIA_RULES
        for key, attr in extra:
            if G(key) and getattr(m, attr, None):
                return True

        doc = m.document
        if doc:
            name = (doc.file_name or "").lower()
            if G("anti_apk") and name.endswith(".apk"):
                return True
            if G("anti_exe") and name.endswith(".exe"):
                return True
            if G("anti_zip") and name.endswith((".zip", ".rar", ".7z")):
                return True
            if G("anti_doc_large") and (doc.file_size or 0) > 50 * 1024 * 1024:
                return True
        if G("anti_voice_long") and m.voice and (m.voice.duration or 0) > 60:
            return True
        if G("anti_video_long") and m.video and (m.video.duration or 0) > 300:
            return True
        if G("anti_albums") and m.media_group_id:
            return True
        if G("anti_media_spoiler") and getattr(m, "has_media_spoiler", False):
            return True

    if scope == "pm":
        bad = [w.strip() for w in str(C("bad_words", "")).split(",") if w.strip()]
        names = entity_names(m)
        checks = [
            ("anti_hashtag", "#" in txt),
            ("anti_mention", "@" in txt),
            ("anti_phone", bool(PHONE.search(txt))),
            ("anti_email", bool(EMAIL.search(txt))),
            ("anti_crypto", bool(CRYPTO.search(txt))),
            ("anti_commands", txt.startswith("/")),
            ("anti_links_pm", bool(LINK.search(txt))),
            ("anti_caps_pm", len(txt) > 3 and txt.isupper()),
            ("anti_long_msg", len(txt) > 1000),
            ("anti_fwd_pm", fwd),
            ("anti_arabic_pm", bool(ARABIC.search(txt))),
            ("anti_english_pm", bool(LATIN.search(txt))),
            ("anti_bot_pm", is_bot),
            ("anti_premium_pm", bool(u and getattr(u, "is_premium", False))),
            ("anti_spoiler_pm", bool(getattr(m, "has_media_spoiler", False))),
            ("anti_foul_pm", any(w in txt for w in bad)),
            ("anti_tag_pm", bool(names & {"HASHTAG", "CASHTAG"})),
            ("anti_inline_pm", bool(getattr(m, "via_bot", None))),
        ]
    elif scope == "group":
        checks = [
            ("anti_links_group", bool(LINK.search(txt))),
            ("anti_fwd_group", fwd),
            ("anti_bots_group", is_bot),
            ("anti_ar_group", bool(ARABIC.search(txt))),
            ("anti_en_group", bool(LATIN.search(txt))),
        ]
        if flood_hit(m, txt):
            return True
    else:
        checks = [
            ("anti_fwd_channel", fwd),
            ("anti_links_channel", bool(LINK.search(txt))),
            ("anti_media_channel", bool(m.media)),
        ]

    for key, hit in checks:
        if G(key) and hit:
            return True
    return False


def special_block(m):
    """قواعد مرتبطة بحسابك أنت (توجيه/رد/منشن)."""
    me_id = STATE.get("me_id")
    if not me_id:
        return False
    if G("anti_fwd_me"):
        fu = getattr(m, "forward_from", None)
        if fu and fu.id == me_id:
            return True
        origin = getattr(m, "forward_origin", None)
        su = getattr(origin, "sender_user", None) if origin else None
        if su and su.id == me_id:
            return True
    if G("anti_reply_me"):
        r = m.reply_to_message
        if r and r.from_user and r.from_user.id == me_id:
            return True
    if G("anti_mention_me") and getattr(m, "mentioned", False):
        return True
    return False


async def not_subscribed(cli, uid):
    ch = channel_ref()
    if not ch:
        return False
    try:
        await cli.get_chat_member(ch, uid)
        return False
    except Exception as ex:
        return type(ex).__name__ == "UserNotParticipant"


async def set_mute(cli, chat_id, mute):
    from pyrogram.raw import functions, types
    peer = await cli.resolve_peer(chat_id)
    await cli.invoke(functions.account.UpdateNotifySettings(
        peer=types.InputNotifyPeer(peer=peer),
        settings=types.InputPeerNotifySettings(mute_until=2147483647 if mute else 0),
    ))


async def set_pin_dialog(cli, chat_id, pinned):
    from pyrogram.raw import functions, types
    peer = await cli.resolve_peer(chat_id)
    await cli.invoke(functions.messages.ToggleDialogPin(
        peer=types.InputDialogPeer(peer=peer), pinned=pinned))


async def delayed_delete(cli, m, secs):
    await asyncio.sleep(secs)
    await attempt(cli.delete_messages(m.chat.id, m.id))


def sim_plan():
    """تحديد نوع المحاكاة ومدتها وعدد تكرارها."""
    if G("sim_typing_cancel"):
        return None
    action, repeats = None, 1
    for key, name in SIM_ACTIONS:
        if G(key):
            action = name
            break
    for key, name in SIM_LOOPS:
        if G(key):
            action, repeats = name, 4
            break
    if action is None and G("typing_always_pm"):
        action, repeats = "TYPING", 3
    if action is None:
        return None
    if G("sim_typing_fast"):
        dur = 0.6
    elif G("sim_typing_slow"):
        dur = 4.0
    elif G("sim_typing_random"):
        dur = random.uniform(0.6, 4.0)
    else:
        dur = 1.5
    return action, dur, repeats


async def run_sim(cli, chat_id, enums):
    plan = sim_plan()
    if not plan:
        return
    name, dur, repeats = plan
    act = getattr(enums.ChatAction, name, None)
    if act is None:
        return
    for _ in range(repeats):
        await attempt(cli.send_chat_action(chat_id, act))
        await asyncio.sleep(dur)


# ==========================================================
# 6. معالجات الرسائل
# ==========================================================
async def handle_private(cli, m, enums):
    u = m.from_user
    if not u or u.is_self:
        return
    txt = m.text or m.caption or ""
    remember(m, txt)

    if G("anti_fake_acc") and (getattr(u, "is_fake", False) or getattr(u, "is_scam", False)):
        await attempt(cli.block_user(u.id))
        await attempt(m.delete())
        return

    if G("pm_lock") or violates(m, txt, "pm") or special_block(m):
        await attempt(m.delete())
        return

    if G("force_sub") and await not_subscribed(cli, u.id):
        await attempt(m.delete())
        last = STATE["sub_warned"].get(u.id, 0)
        if time.time() - last > 600:
            STATE["sub_warned"][u.id] = time.time()
            await attempt(cli.send_message(
                m.chat.id, f"🔔 Please subscribe to the channel {C('channel')} and try again."))
        return

    if G("auto_block") and not u.is_contact:
        await attempt(cli.block_user(u.id))
        return

    if G("auto_save_contacts") and not u.is_contact and not u.is_bot:
        await attempt(cli.add_contact(u.id, first_name=u.first_name or "User"))

    if G("auto_mute_pm") and m.chat.id not in STATE["muted"]:
        STATE["muted"].add(m.chat.id)
        await attempt(set_mute(cli, m.chat.id, True))

    if G("auto_read") or (G("read_bots") and u.is_bot):
        await attempt(cli.read_chat_history(m.chat.id))

    if G("auto_pin_pm"):
        await attempt(m.pin(disable_notification=True, both_sides=False))

    if G("welcome_pm"):
        welcomed = list(C("welcomed", []))
        if u.id not in welcomed:
            welcomed.append(u.id)
            save_data("welcomed", welcomed[-2000:])
            await attempt(m.reply_text(C("welcome_text") or DEFAULTS["welcome_text"]))

    await run_sim(cli, m.chat.id, enums)

    reply = make_reply_text(txt)
    if reply:
        await attempt(m.reply_text(reply))

    for key, emoji in REACTIONS:
        if G(key):
            await react(m, emoji)
            break


async def handle_group(cli, m, enums):
    txt = m.text or m.caption or ""
    remember(m, txt)
    if violates(m, txt, "group") or special_block(m):
        await attempt(m.delete())
        return
    if G("auto_react_group"):
        await react(m, "👍")
        return
    for key, emoji in REACTIONS:
        if G(key):
            await react(m, emoji)
            break


async def handle_channel(cli, m, enums):
    txt = m.text or m.caption or ""
    if violates(m, txt, "channel"):
        await attempt(m.delete())
        return
    if G("auto_react_channels"):
        await react(m, "❤️")


def transform_text(t):
    new = t
    if G("auto_capitalize"):
        new = new.upper()
    if G("auto_lowercase"):
        new = new.lower()
    if G("auto_spaces"):
        new = " ".join(new)
    if G("auto_dot"):
        new += "."
    if G("auto_comma"):
        new += ","
    if G("auto_question"):
        new += "?"
    if G("auto_exclamation"):
        new += "!"
    wraps = [
        ("auto_bold", "b"), ("auto_italic", "i"), ("auto_underline", "u"),
        ("auto_strike", "s"), ("auto_spoiler", "tg-spoiler"),
        ("auto_quote", "blockquote"), ("auto_code", "code"),
    ]
    active = [tag for key, tag in wraps if G(key)]
    if new == t and not active:
        return None
    new = html.escape(new)
    for tag in active:
        new = f"<{tag}>{new}</{tag}>"
    return new


async def handle_mine(cli, m, enums):
    CT = enums.ChatType
    chat_id = m.chat.id
    in_saved = chat_id == STATE.get("me_id")
    private = m.chat.type == CT.PRIVATE
    in_group = m.chat.type in (CT.GROUP, CT.SUPERGROUP)

    if m.text and not m.text.startswith(("/", ".")):
        new = transform_text(m.text)
        if new:
            await attempt(m.edit_text(new, parse_mode=enums.ParseMode.HTML))

    if private and not in_saved:
        if G("ghost_delete_pm"):
            asyncio.ensure_future(delayed_delete(cli, m, 30))
        if G("pin_my_pm"):
            await attempt(m.pin(disable_notification=True, both_sides=False))

    if in_group and G("auto_pin_group"):
        await attempt(m.pin(disable_notification=True))

    if G("auto_delete_my_media") and m.media and not m.text and not in_saved:
        asyncio.ensure_future(delayed_delete(cli, m, 60))


async def handle_edited(cli, m, enums):
    if not (G("anti_edit_pm") or G("log_edited_msgs")):
        return
    u = m.from_user
    if not u or u.is_self:
        return
    is_private = m.chat.type == enums.ChatType.PRIVATE
    if not is_private and not G("log_edited_msgs"):
        return
    new = m.text or m.caption or ""
    old = MSG_CACHE.get((m.chat.id, m.id))
    MSG_CACHE[(m.chat.id, m.id)] = new
    if old and old != new:
        who = u.first_name or "User"
        place = "" if is_private else f" in \"{m.chat.title}\""
        await attempt(cli.send_message(
            log_target(), f"✏️ {who}{place} edited a message:\nBefore: {old}\nAfter: {new}"))


# ==========================================================
# 7. المهام الدورية (متصل دائماً / اسم وساعة / حالة البايو)
# ==========================================================
async def ticker(app):
    from pyrogram.raw import functions
    tick = 0
    while True:
        try:
            if G("always_online"):
                await attempt(app.invoke(functions.account.UpdateStatus(offline=False)))

            if tick % 3 == 0:
                if G("name_clock"):
                    await attempt(app.update_profile(last_name=clock_text()))
                    STATE["name_on"] = True
                elif STATE["name_on"]:
                    await attempt(app.update_profile(last_name=STATE.get("last_name_backup") or ""))
                    STATE["name_on"] = False

            desired = None
            for key, text in STATUS_BIOS:
                if G(key):
                    desired = text
                    break
            if desired and STATE["status_applied"] != desired:
                if STATE["bio_backup"] is None:
                    chat = await attempt(app.get_chat("me"))
                    STATE["bio_backup"] = (getattr(chat, "bio", "") or "") if chat else ""
                    save_data("bio_backup", STATE["bio_backup"])
                await attempt(app.update_profile(bio=desired))
                STATE["status_applied"] = desired
                save_data("status_applied", desired)
            elif not desired and STATE["status_applied"] is not None:
                await attempt(app.update_profile(bio=STATE["bio_backup"] or ""))
                STATE["status_applied"] = None
                STATE["bio_backup"] = None
                save_data("status_applied", None)
        except asyncio.CancelledError:
            raise
        except Exception:
            pass
        tick += 1
        await asyncio.sleep(20)


async def start_engine():
    from pyrogram import Client, filters, enums

    session_str = C("session_string", "")
    if not session_str:
        # بدون هذا الفحص كان pyrogram يطلب تسجيل دخول تفاعلي ويعلق للأبد
        raise RuntimeError("No session: log in first")
    app = Client("abbas_bot", api_id=API_ID, api_hash=API_HASH,
                 session_string=session_str, in_memory=True)

    @app.on_message(filters.private & ~filters.me & ~filters.service)
    async def on_private(cli, m):
        try:
            await handle_private(cli, m, enums)
        except Exception:
            pass

    @app.on_message(filters.group & ~filters.me & ~filters.service)
    async def on_group(cli, m):
        try:
            await handle_group(cli, m, enums)
        except Exception:
            pass

    @app.on_message(filters.channel)
    async def on_channel(cli, m):
        try:
            await handle_channel(cli, m, enums)
        except Exception:
            pass

    @app.on_message(filters.me & ~filters.service)
    async def on_mine(cli, m):
        try:
            await handle_mine(cli, m, enums)
        except Exception:
            pass

    @app.on_edited_message(~filters.me)
    async def on_edited(cli, m):
        try:
            await handle_edited(cli, m, enums)
        except Exception:
            pass

    await app.start()
    me = await app.get_me()
    STATE["me_id"] = me.id
    STATE["me_username"] = me.username

    # إصلاح: لو التطبيق انقتل والساعة بالاسم، لا نحفظ الساعة كأنها اسمك الحقيقي
    ln = me.last_name or ""
    if CLOCK_RE.match(ln):
        STATE["last_name_backup"] = C("last_name_backup", "")
        STATE["name_on"] = True
    else:
        STATE["last_name_backup"] = ln
        STATE["name_on"] = False
        save_data("last_name_backup", ln)
    STATE["status_applied"] = C("status_applied")
    STATE["bio_backup"] = C("bio_backup") if STATE["status_applied"] else None

    TICKER[0] = asyncio.ensure_future(ticker(app))
    return app


async def stop_engine():
    app = bot_client_ref[0]
    if TICKER[0]:
        TICKER[0].cancel()
        TICKER[0] = None
    if app:
        await attempt(app.stop())
    bot_client_ref[0] = None


# ==========================================================
# 8. أوامر صفحة الأوامر
# ==========================================================
ACTS = {}
for _k in ["private", "channels", "groups", "bots", "all"]:
    ACTS["bg_read_" + _k] = ("read", _k)
    ACTS["bg_archive_" + _k] = ("archive", _k)
for _k in ["private", "channels", "groups", "all"]:
    ACTS["bg_mute_" + _k] = ("mute", _k)
for _k in ["private", "channels", "groups"]:
    ACTS["bg_pin_" + _k] = ("pin", _k)
ACTS["bg_unarchive_all"] = ("unarchive", "all")
ACTS["bg_unmute_all"] = ("unmute", "all")
ACTS["bg_leave_all_channels"] = ("leave", "channels")
ACTS["bg_leave_all_groups"] = ("leave", "groups")
ACTS["bg_leave_basic_groups"] = ("leave", "basic")
ACTS["bg_leave_super_groups"] = ("leave", "super")


async def each_chat(kind):
    from pyrogram import enums
    CT = enums.ChatType
    kinds = {
        "private": [CT.PRIVATE], "bots": [CT.BOT], "channels": [CT.CHANNEL],
        "groups": [CT.GROUP, CT.SUPERGROUP], "basic": [CT.GROUP],
        "super": [CT.SUPERGROUP],
        "all": [CT.PRIVATE, CT.BOT, CT.CHANNEL, CT.GROUP, CT.SUPERGROUP],
        "talk": [CT.PRIVATE, CT.GROUP, CT.SUPERGROUP],
    }[kind]
    async for d in bot_client_ref[0].get_dialogs():
        if d.chat.type in kinds:
            yield d.chat


async def act_bulk(verb, kind):
    c = bot_client_ref[0]
    n = 0
    async for chat in each_chat(kind):
        try:
            if verb == "read":
                await c.read_chat_history(chat.id)
            elif verb == "archive":
                await c.archive_chats(chat.id)
            elif verb == "unarchive":
                await c.unarchive_chats(chat.id)
            elif verb == "leave":
                await c.leave_chat(chat.id)
            elif verb == "mute":
                await set_mute(c, chat.id, True)
            elif verb == "unmute":
                await set_mute(c, chat.id, False)
            elif verb == "pin":
                await set_pin_dialog(c, chat.id, True)
            n += 1
        except Exception:
            pass
        await asyncio.sleep(0.3)
    return f"✅ Done on {n} chats"


async def act_profile(key, text):
    c = bot_client_ref[0]

    if key == "bg_del_all_pfps":
        ids = [p.file_id async for p in c.get_chat_photos("me")]
        if ids:
            await c.delete_profile_photos(ids)
        return f"✅ Deleted {len(ids)} photos"

    if key == "bg_random_bio":
        bio = random.choice(["☀️ New day", "🔥 Keep smiling", "✨ Grateful always", "🚀 Onward and upward"])
        await c.update_profile(bio=bio)
        return f"✅ Bio set to: {bio}"

    if key == "bg_remove_bio":
        await c.update_profile(bio="")
        return "✅ Bio removed"

    if key == "ask_change_user":
        if not text:
            return "⚠️ Type the new username in the text box first"
        await c.set_username(text.lstrip("@"))
        return f"✅ Username changed to @{text.lstrip('@')}"

    if key in ("action_fake_deleted", "action_fake_admin"):
        me = await c.get_me()
        chat = await c.get_chat("me")
        if not C("profile_backup"):
            save_data("profile_backup", {
                "first": me.first_name or "",
                "last": me.last_name or "",
                "bio": getattr(chat, "bio", "") or "",
            })
        if key == "action_fake_deleted":
            await c.update_profile(first_name="Deleted Account", last_name="", bio="")
            return "👻 Ghost mode on (tap Restore profile to undo)"
        first = C("profile_backup")["first"]
        await c.update_profile(first_name=first, last_name="👑 Admin")
        return "👑 Fake admin on (tap Restore profile to undo)"

    if key == "action_restore_profile":
        b = C("profile_backup")
        if not b:
            return "ℹ️ No profile backup found"
        await c.update_profile(first_name=b["first"], last_name=b["last"], bio=b["bio"])
        save_data("profile_backup", None)
        return "✅ Name and bio restored"

    return None


async def act_data(key, text):
    c = bot_client_ref[0]

    if key == "bg_clear_saved":
        ids = [m.id async for m in c.get_chat_history("me")]
        for i in range(0, len(ids), 100):
            await c.delete_messages("me", ids[i:i + 100])
        return f"✅ Deleted {len(ids)} saved messages"

    if key == "bg_clear_cache":
        shutil.rmtree("downloads", ignore_errors=True)
        MSG_CACHE.clear()
        FLOOD.clear()
        return "✅ Cache cleared"

    if key == "bg_clear_contacts":
        users = await c.get_contacts()
        if users:
            await c.delete_contacts([u.id for u in users])
        return f"✅ Deleted {len(users)} contacts"

    if key == "bg_add_all_contacts":
        n = 0
        async for chat in each_chat("private"):
            try:
                await c.add_contact(chat.id, first_name=chat.first_name or "User")
                n += 1
            except Exception:
                pass
            await asyncio.sleep(0.3)
        return f"✅ Saved {n} contacts"

    if key == "bg_unpin_all":
        from pyrogram.raw import functions
        await c.invoke(functions.messages.ReorderPinnedDialogs(folder_id=0, order=[], force=True))
        return "✅ Unpinned all chats"

    if key == "bg_delete_my_posts":
        n = 0
        async for chat in each_chat("groups"):
            ids = []
            try:
                async for mm in c.search_messages(chat.id, from_user="me", limit=200):
                    ids.append(mm.id)
                if ids:
                    await c.delete_messages(chat.id, ids)
                    n += len(ids)
            except Exception:
                pass
        return f"✅ Deleted {n} messages from your groups"

    return None


async def act_info(key, text):
    c = bot_client_ref[0]

    if key in ("get_stats_fast", "get_stats_full"):
        counts = {"private": 0, "bots": 0, "groups": 0, "channels": 0}
        for k in counts:
            async for _ in each_chat(k):
                counts[k] += 1
        msg = (f"Private: {counts['private']} | Bots: {counts['bots']} | "
               f"Groups: {counts['groups']} | Channels: {counts['channels']}")
        if key == "get_stats_full":
            msg += f" | Contacts: {len(await c.get_contacts())}"
        return msg

    if key == "check_premium":
        me = await c.get_me()
        return "Your account is Premium" if getattr(me, "is_premium", False) else "Your account is not Premium"

    if key == "check_spam_bot":
        await c.send_message("SpamBot", "/start")
        await asyncio.sleep(3)
        async for mm in c.get_chat_history("SpamBot", limit=1):
            return "SpamBot: " + (mm.text or "")[:300]
        return "No reply from SpamBot"

    if key == "check_sessions":
        from pyrogram.raw import functions
        r = await c.invoke(functions.account.GetAuthorizations())
        lines = []
        for a in r.authorizations:
            s = f"{a.device_model} • {a.platform}"
            if a.current:
                s += " (current)"
            lines.append(s)
        return f"Sessions ({len(lines)}): " + " | ".join(lines)

    return None


async def act_broadcast(key, text):
    c = bot_client_ref[0]

    if key in ("ask_broadcast_pm", "ask_broadcast_groups", "ask_broadcast_all", "ask_broadcast_pin"):
        if not text:
            return "⚠️ Type the broadcast text in the box first"
        kind = {
            "ask_broadcast_pm": "private", "ask_broadcast_groups": "groups",
            "ask_broadcast_all": "talk", "ask_broadcast_pin": "groups",
        }[key]
        n = 0
        async for chat in each_chat(kind):
            try:
                sent = await c.send_message(chat.id, text)
                if key == "ask_broadcast_pin":
                    await attempt(sent.pin(disable_notification=True))
                n += 1
            except Exception:
                pass
            await asyncio.sleep(1.5)
        return f"✅ Broadcast sent to {n} chats"

    if key == "ask_broadcast_fwd":
        last = [mm async for mm in c.get_chat_history("me", limit=1)]
        if not last:
            return "⚠️ Saved Messages is empty: put a message there first"
        n = 0
        async for chat in each_chat("talk"):
            try:
                await c.forward_messages(chat.id, "me", last[0].id)
                n += 1
            except Exception:
                pass
            await asyncio.sleep(1.5)
        return f"✅ Forwarded your last saved message to {n} chats"

    if key == "publish_post":
        ch, post = channel_ref(), C("post_text")
        if not ch or not post:
            return "⚠️ Set the channel and the post first (Set channel / Set post)"
        await c.send_message(ch, post)
        return "✅ Post published to the channel"

    return None


async def act_settings(key, text):
    mapping = {
        "set_channel": ("channel", "✅ Channel set"),
        "set_post": ("post_text", "✅ Post text saved"),
        "set_log_channel": ("log_channel", "✅ Log channel set"),
        "set_bad_words": ("bad_words", "✅ Bad words saved (separate with commas)"),
        "set_welcome": ("welcome_text", "✅ Welcome text saved"),
    }
    if key not in mapping:
        return None
    if not text:
        return "⚠️ Type the value in the box first"
    field, done = mapping[key]
    save_data(field, text)
    return done


# ==========================================================
# 9. تسجيل الدخول (يتم داخل الخدمة، والواجهة ترسل الأوامر فقط)
# ==========================================================
async def _finish_auth():
    c = AUTH["client"]
    save_data("session_string", await c.export_session_string())
    save_data("engine_enabled", True)
    await attempt(c.disconnect())
    AUTH.update(client=None, hash=None, phone=None)
    return "LOGGED_IN"


async def act_auth(key, text):
    from pyrogram import Client

    if key == "auth_send_code":
        if not text:
            return "❌ Enter your phone number"
        phone = "+" + text.strip().lstrip("+").replace(" ", "")
        if AUTH["client"]:
            await attempt(AUTH["client"].disconnect())
        c = Client("temp_sess", api_id=API_ID, api_hash=API_HASH, in_memory=True)
        await c.connect()
        sent = await c.send_code(phone)
        AUTH.update(client=c, hash=sent.phone_code_hash, phone=phone)
        return "CODE_SENT"

    if key == "auth_sign_in":
        c = AUTH["client"]
        if not c:
            return "❌ Request the code first"
        try:
            await c.sign_in(AUTH["phone"], AUTH["hash"], text.strip())
        except Exception as ex:
            if "SessionPasswordNeeded" in type(ex).__name__:
                return "NEED_PASSWORD"
            raise
        return await _finish_auth()

    if key == "auth_password":
        c = AUTH["client"]
        if not c:
            return "❌ Request the code first"
        await c.check_password(text)
        return await _finish_auth()

    if key == "logout":
        await stop_engine()
        save_data("session_string", "")
        save_data("status_applied", None)
        return "LOGGED_OUT"

    return None


async def do_action(key, text):
    """نقطة الدخول الوحيدة: الواجهة ترسل (key, text) والخدمة تنفذها هنا."""
    text = (text or "").strip()
    if key.startswith("auth_") or key == "logout":
        return await act_auth(key, text)
    if key not in NO_CLIENT_OK and bot_client_ref[0] is None:
        return "⚠️ Start the engine first!"
    if key in ACTS:
        verb, kind = ACTS[key]
        return await act_bulk(verb, kind)
    for fn in (act_profile, act_data, act_info, act_broadcast, act_settings):
        result = await fn(key, text)
        if result is not None:
            return result
    return "ℹ️ This feature is not available in this version"
