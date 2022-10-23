import imp
from turtle import title
from urllib.request import HTTPCookieProcessor, build_opener
from urllib.parse import urlencode
from bs4 import BeautifulSoup
from selenium.webdriver import Firefox
from selenium.webdriver.firefox.service import Service as FirefoxService
from webdriver_manager.firefox import GeckoDriverManager
from selenium.webdriver.common.by import By


def create_data(user_id):
    opener = build_opener(HTTPCookieProcessor())
    url = f"https://www.swimcloud.com/swimmer/{user_id.strip()}/"

    with opener.open(url) as src:
        web_page = src.read()

    soup = BeautifulSoup(web_page, "html.parser")
    title = soup.title.text.strip()

    table = soup.find("div", {"id": "js-swimmer-profile-times"}).table
    header = "| Event | Time | Meta | Meet | Date |"
    body = table.tbody

    swimmer_name = title[: title.index("|", 0)].strip().replace(" ", "_").lower()

    with open(f"assets\\data\\{swimmer_name}.txt", "w", encoding="UTF-8") as dst:
        dst.write(f"{header}$\n")

        rows = body.find_all("tr")

        for index, row in enumerate(rows):
            cols = row.find_all("td")
            entry = ""

            for col in cols:
                entry += col.text.strip() + " | "

            entry = "| " + entry

            if index == rows.__len__() - 1:
                dst.write(f"{entry.strip()}\n")
            else:
                dst.write(f"{entry.strip()}$\n")

    return swimmer_name


def beautify_data(swimmer_name):
    with open(f"assets\\data\\{swimmer_name}.txt", "r", encoding="UTF-8") as src:
        data = src.read()
    
    url = "https://onlinetexttools.com/convert-text-to-nice-columns?"

    params = {
        "input": data,
        "input-element-separator": "|",
        "input-row-separator": "$",
        "output-element-separator": "|",
        "output-row-separator": "\n",
        "align-separator-by-columns": "true",
        "separator-everywhere": "true",
        "left-align": "true",
    }

    url += urlencode(params, encoding="UTF-8")

    driver = Firefox(service=FirefoxService(GeckoDriverManager().install()))
    driver.get(url)

    driver.implicitly_wait(0.5)
    textareas = driver.find_elements(By.TAG_NAME, "textarea")
    textarea = driver.find_element(By.CLASS_NAME, "data")
    driver.quit()

    # # print(f"{soup.title.text} and other stuff")
    # # textarea = soup.find(name="textarea", attrs={"class": "data", "readonly": ""})

    # Writing the data to a file.
    # with open(f"assets\\data\\{swimmer_name}.txt", "w", encoding="UTF-8") as dst:
    #     for textarea in textareas:
    #         dst.write(textarea.text)

    driver.quit()

    return f"{swimmer_name}.txt"
