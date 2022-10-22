import imp
from urllib.request import HTTPCookieProcessor, build_opener
from urllib.parse import urlencode
from bs4 import BeautifulSoup
from selenium.webdriver.chrome.service import Service
from selenium import webdriver


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

    url = "https://onlinetexttools.com/convert-text-to-nice-columns?" + urlencode(params, encoding="UTF-8")

    params = {
        "input": data,
        "input-element-separator": "|",
        "input-row-separator": "$",
        "output-element-separator": "|",
        "&output-row-separator": "\n",
        "align-separator-by-columns": "true",
        "separator-everywhere": "true",
        "left-align": "true",
    }

    service = Service()
    driver = webdriver.Chrome(service=service)
    driver.get(url)

    soup = BeautifulSoup(driver.page_source, "lxml")
    print(soup.title.text)
    textarea = soup.find(name="textarea", attrs={"class": "data", "readonly": ""})

    with open(f"assets\\data\\{swimmer_name}.txt", "w", encoding="UTF-8") as dst:
        dst.write(textarea.text)

    return f"{swimmer_name}.txt"
