from urllib.request import HTTPCookieProcessor, build_opener
from bs4 import BeautifulSoup

def main():
    opener = build_opener(HTTPCookieProcessor())

    with opener.open("https://www.swimcloud.com/swimmer/1644519/") as src:
        webpage = src.read()

    soup = BeautifulSoup(webpage, "html.parser")
    title = soup.find("title")

    with open("src/test.txt", 'w', encoding="UTF-8") as dst:
        dst.write(title.text.strip())

if __name__ == "__main__":
    main()
