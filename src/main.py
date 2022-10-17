from sys import argv, stdout
from urllib.request import HTTPCookieProcessor, build_opener
from bs4 import BeautifulSoup


def main():
    opener = build_opener(HTTPCookieProcessor())
    url = f"https://www.swimcloud.com/swimmer/{argv[1].strip()}/"

    with opener.open(url) as src:
        webpage = src.read()

    soup = BeautifulSoup(webpage, "html.parser")
    title = soup.title.text.strip()

    table = soup.find("div", {"id": "js-swimmer-profile-times"}).table
    header = (
        table.thead.text.strip()
        .replace("\n", " ")
        .replace("  ", " ")
        .replace(" ", " | ")
    )
    body = table.tbody

    swimmer_name = title[: title.index("|", 0)].strip().replace(" ", "_").lower()

    with open(f"assets\\data\\{swimmer_name}.txt", "w", encoding="UTF-8") as dst:
        dst.write(f"{title}\n{header}\n")

        rows = body.find_all("tr")

        for row in rows:
            cols = row.find_all("td")
            entry = ""

            for col in cols:
                entry += col.text.strip() + " | "

            entry = entry.replace("| X |", "|").replace("|  |", "|").strip()
            dst.write(f"{entry}\n")

    stdout.write(f"{swimmer_name}.txt")


if __name__ == "__main__":
    main()
