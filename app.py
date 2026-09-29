import flet as ft
import asyncio
import threading
from pyrogram import Client

def main(page: ft.Page):
    page.title = "لوحة تحكم عباس"
    page.theme_mode = ft.ThemeMode.DARK
    page.rtl = True
    page.scroll = "adaptive"

    api_id_input = ft.TextField(label="API ID", keyboard_type=ft.KeyboardType.NUMBER)
    api_hash_input = ft.TextField(label="API HASH")
    phone_input = ft.TextField(label="رقم الهاتف (مثال: +964...)")
    code_input = ft.TextField(label="كود التليجرام", visible=False)
    status_text = ft.Text("أدخل معلوماتك واضغط إرسال الكود", color=ft.colors.AMBER)
    
    client = [None]
    phone_code_hash = [None]

    def send_code(e):
        status_text.value = "جاري إرسال الكود ⏳..."
        page.update()
        
        def run_send():
            try:
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                c = Client("user_session", api_id=int(api_id_input.value), api_hash=api_hash_input.value)
                client[0] = c
                loop.run_until_complete(c.connect())
                sent_code = loop.run_until_complete(c.send_code(phone_input.value))
                phone_code_hash[0] = sent_code.phone_code_hash
                status_text.value = "تم إرسال الكود! اكتبه جوة 📩."
                code_input.visible = True
                btn_login.visible = True
                btn_send.visible = False
            except Exception as ex:
                status_text.value = f"خطأ: {ex}"
            page.update()
        
        threading.Thread(target=run_send, daemon=True).start()

    def login(e):
        status_text.value = "جاري تسجيل الدخول ⏳..."
        page.update()
        
        def run_login():
            try:
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                c = client[0]
                loop.run_until_complete(c.sign_in(phone_input.value, phone_code_hash[0], code_input.value))
                
                # الانتقال للوحة التحكم بعد الدخول
                page.clean()
                page.add(
                    ft.Text("👑 لوحة تحكم عباس المليونية 👑", size=24, color=ft.colors.GREEN, weight="bold"),
                    ft.Text("البوت شغال محلياً 🟢", color=ft.colors.GREEN),
                    ft.ElevatedButton("تشغيل حفظ الميديا", bgcolor=ft.colors.BLUE, color=ft.colors.WHITE),
                    ft.ElevatedButton("قفل الخاص", bgcolor=ft.colors.RED, color=ft.colors.WHITE)
                )
            except Exception as ex:
                status_text.value = f"فشل الدخول: {ex}"
            page.update()
        
        threading.Thread(target=run_login, daemon=True).start()

    btn_send = ft.ElevatedButton("إرسال الكود", on_click=send_code, bgcolor=ft.colors.BLUE_700, color=ft.colors.WHITE)
    btn_login = ft.ElevatedButton("تأكيد الدخول", on_click=login, visible=False, bgcolor=ft.colors.GREEN_700, color=ft.colors.WHITE)

    page.add(
        ft.Text("تسجيل الدخول للتطبيق", size=28, weight="bold"),
        api_id_input,
        api_hash_input,
        phone_input,
        btn_send,
        code_input,
        btn_login,
        status_text
    )

ft.app(target=main)
