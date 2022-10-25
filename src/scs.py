from urllib.request import HTTPCookieProcessor, build_opener
from bs4 import BeautifulSoup
from requests import head


def create_time_data(time_type):
    opener = build_opener(HTTPCookieProcessor())
    url = f"https://www.socalswim.org/time-standards/{time_type}"

    with opener.open(url) as src:
        web_page = src.read()

    soup = BeautifulSoup(web_page, "html.parser")
    table = soup.find(name="table", attrs={"class": "DataGrid table"})

    with open(
        f"assets\\data\\{time_type.replace('-short-course-yards', '_scy').replace('-long-course-meters', '_lcm')}_unformatted.txt",
        "w",
        encoding="UTF-8",
    ) as dst:
        for index, row in enumerate(table.find_all("tr")):
            entry = ""
            for col in row.find_all("td"):
                entry += col.text.strip() + "|"
            entry = entry[:-1]

            dst.write(f"{entry}\n")

    return time_type


def beautify_time_data(time_type):
    with open(
        f"assets\\data\\{time_type.replace('-short-course-yards', '_scy').replace('-long-course-meters', '_lcm')}_unformatted.txt",
        "r",
        encoding="UTF-8",
    ) as src:
        rows = src.readlines()

    with open(
        f"assets\\data\\{time_type.replace('-short-course-yards', '_scy').replace('-long-course-meters', '_lcm')}_formatted.txt",
        "w",
        encoding="UTF-8",
    ) as dst:
        dst.write("                       ")
        max_lengths = [0, 0, 0, 0, 0, 0, 0, 0, 0]

        for row in rows:
            cols = row.split("|")

            for index, col in enumerate(cols):
                max_lengths[index] = (
                    col.__len__()
                    if col.__len__() > max_lengths[index]
                    else max_lengths[index]
                )

        for index, row in enumerate(rows):
            cols = row.split("|")
            entry = ""

            for index, col in enumerate(cols):
                additional_spaces = max_lengths[index] - col.__len__()
                additional_spaces += 3
                entry += col

                for i in range(0, additional_spaces):
                    entry += " "

            dst.write(f"{entry.strip()}\n")
