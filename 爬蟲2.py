from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium import webdriver
from selenium.webdriver.common.by import By
import winsound
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time
import json
import requests
import os
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import shutil

service = Service(ChromeDriverManager().install())
options = Options()
options.add_experimental_option("debuggerAddress", "127.0.0.1:9222")
driver = webdriver.Chrome(service=service, options=options)

config = {"DM 設計":"1086563916287871575",
          "菜單設計":"1086563916287872060",
          "名片設計":"1086563916287871592",
          "廣告美編設計":"1086563916287872062",
          "海報設計":"1086563916287871581",
          "logo-極簡風":"1086563916287871540",
          "logo-科技風":"1086563916287871543",
          "logo-現代風":"1086563916287871541",
          "logo-字母風":"1086563916287871547",
          "logo-圖像風":"1086563916287871542",

          "logo-經典風":"1086563916287871539",
          "logo-中文風":"1086563916287871548",
          "logo-自然風":"1086563916287871545",
          "logo-可愛風":"1086563916287871549",
          "logo-手繪風":"1086563916287871546",
          }

filename = "logo-手繪風"
times = 25
id = config[filename]
url = f'https://www.pinterest.com/bei_overworked/{filename}/'

if os.path.exists(f"幸福more/test/{filename}"):
    shutil.rmtree(f"幸福more/test/{filename}")
os.makedirs(f"幸福more/test/{filename}")

driver.get(url)
time.sleep(5)

count = 0
for i in range(1,times+1):
    try:
        time.sleep(2)
        path =  f'//*[@id="boardfeed:{id}"]/div/div/div/div/div[{i}]/div/div/div/div/div/div[1]/div[1]/a/div/div/div/div/div[1]/div/div/div[1]/div/div/div/img'
        img = driver.find_element(By.XPATH,path)
        srcset = img.get_attribute("srcset")
        srcset = img.get_attribute("src")
        print(srcset)

        img_data = requests.get(srcset).content
        with open(f"幸福more/test/{filename}/{i}.jpg", 'wb') as f:
            f.write(img_data)
        print(f"✅ 下載成功: {i}.jpg")
        count += 1
    except Exception as e:
        print(f"❌ 下載失敗: {i}")
        print(path)



driver.quit()
print(f"\n✅ 共下載 {count} 張圖片。")
winsound.PlaySound("SystemHand", winsound.SND_ALIAS)

"""
開啟瀏覽器
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="C:\ChromeDebug"
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="C:\ChromeDebug"


"""