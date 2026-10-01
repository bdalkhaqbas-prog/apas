from kivy.app import App
from kivy.uix.label import Label
from kivy.utils import platform

class PanelApp(App):
    def build(self):
        if platform == "android":
            from jnius import autoclass
            from android.permissions import request_permissions, Permission
            request_permissions([Permission.POST_NOTIFICATIONS])
            svc = autoclass("org.vip.panel.ServiceMyservice")
            act = autoclass("org.kivy.android.PythonActivity").mActivity
            svc.start(act, "")
        return Label(text="التطبيق شغال")

PanelApp().run()
