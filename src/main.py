from urllib.request import HTTPCookieProcessor, build_opener
from bs4 import BeautifulSoup

def main():
    opener = build_opener(HTTPCookieProcessor())

    with opener.open("https://www.swimcloud.com/swimmer/1644519/") as src:
        webpage = src.read()

    soup = BeautifulSoup(webpage, "html.parser")
    title = soup.title.text.strip()
    table = soup.find("div", {"id": "js-swimmer-profile-times"}).table
    header = table.thead.text.strip().replace('\n', " ").replace("  ", ' ').replace(' ', " | ")
    body = table.tbody

    with open("src/test.txt", 'w', encoding="UTF-8") as dst:
        dst.write(f"{title}\n")
        dst.write(f"{header}\n")

        rows = body.find_all("tr")

        for row in rows:
            cols = row.find_all("td")
            entry = ""

            for col in cols:
                entry += col.text.strip() + " | "

            entry = entry.replace("| X |", '|').replace("|  |", '|').strip()
            dst.write(f"{entry}\n")

if __name__ == "__main__":
    main()
