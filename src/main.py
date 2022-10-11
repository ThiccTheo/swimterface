from urllib.request import HTTPCookieProcessor, build_opener
from bs4 import BeautifulSoup
from django.shortcuts import HttpResponse

def main():
    opener = build_opener(HTTPCookieProcessor())
    
    with opener.open() as src:

if __name__ == "__main__":
    main()
