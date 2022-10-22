from sys import argv, stdout
from webscrape import create_data, beautify_data


def main():
    swimmer_name = create_data(argv[1])
    text = beautify_data(swimmer_name)
    stdout.write(text)
    


if __name__ == "__main__":
    main()
