import flet as ft

def main(page: ft.Page):
    page.title = "عباس بطل"
    page.add(ft.Text("🚀 التطبيق فتح بدون مكتبة pyrofork! المشكلة جانت منها 100%", size=20, color=ft.colors.GREEN))

ft.app(target=main)
