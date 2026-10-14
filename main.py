import os
import time
from jnius import autoclass
from android.runnable import run_on_ui_thread

WebView = autoclass('android.webkit.WebView')
WebViewClient = autoclass('android.webkit.WebViewClient')
PythonActivity = autoclass('org.kivy.android.PythonActivity')
activity = PythonActivity.mActivity


@run_on_ui_thread
def show_game():
    webview = WebView(activity)
    settings = webview.getSettings()
    settings.setJavaScriptEnabled(True)
    settings.setDomStorageEnabled(True)
    settings.setAllowFileAccess(True)
    webview.setWebViewClient(WebViewClient())
    page = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'index.html')
    webview.loadUrl('file://' + page)
    activity.setContentView(webview)


show_game()

while True:
    time.sleep(60)
