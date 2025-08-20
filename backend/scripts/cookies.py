import time
import json
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

LOGIN_URL = "https://cmsweb.cms.cpp.edu/psc/CPOMPRDM/EMPLOYEE/SA/s/WEBLIB_H_SB_STD.ISCRIPT1.FieldFormula.IScript_ClassDetails?"

print("starting driver...")
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
driver.get(LOGIN_URL)
print(f"log in your account")

input("log in to fetch cookies, enter to continue")

print("fetching cookies...")
cookies = driver.get_cookies()

with open("cookies.json", "w") as f:
    json.dump(cookies, f)

print("cookies saved to cookies.json")

driver.quit()