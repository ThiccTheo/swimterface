from sys import stdout
from urllib.request import HTTPCookieProcessor, build_opener
from bs4 import BeautifulSoup


def create_swimmer_data(user_id):
    opener = build_opener(HTTPCookieProcessor())
    url = f"https://www.swimcloud.com/swimmer/{user_id.strip()}/"

    with opener.open(url) as src:
        web_page = src.read()

    soup = BeautifulSoup(web_page, "html.parser")
    title = soup.title.text.strip()

    table = soup.find("div", {"id": "js-swimmer-profile-times"}).table
    header = "Event|Time|Meet|Date"
    body = table.tbody

    swimmer_name = title[: title.index("|", 0)].strip().replace(" ", "_").lower()

    with open(
        f"assets\\data\\{swimmer_name}_unformatted.txt", "w", encoding="UTF-8"
    ) as dst:
        dst.write(f"{header}\n")

        rows = body.find_all("tr")

        for row in rows:
            cols = row.find_all("td")
            entry = ""

            for index, col in enumerate(cols):
                if (
                    index == 0
                    or index == 1
                    or index == cols.__len__() - 2
                    or index == cols.__len__() - 1
                ):
                    entry += col.text.strip() + "|"

            entry = entry[:-1]
            dst.write(f"{entry}\n")

    return swimmer_name


def beautify_swimmer_data(swimmer_name):
    with open(
        f"assets\\data\\{swimmer_name}_unformatted.txt", "r", encoding="UTF-8"
    ) as src:
        rows = src.readlines()

    with open(
        f"assets\\data\\{swimmer_name}_formatted.txt", "w", encoding="UTF-8"
    ) as dst:
        max_lengths = [0, 0, 0, 0]

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

    stdout.write(f"{swimmer_name}_formatted.txt")
