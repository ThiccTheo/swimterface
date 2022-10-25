from sys import argv
from swimcloud import create_swimmer_data, beautify_swimmer_data
from scs import create_time_data, beautify_time_data


def main():
    if argv.__len__() == 1:
        beautify_time_data(create_time_data("men-short-course-yards"))
        beautify_time_data(create_time_data("men-long-course-meters"))
        beautify_time_data(create_time_data("women-short-course-yards"))
        beautify_time_data(create_time_data("women-long-course-meters"))
    else:
        beautify_swimmer_data(create_swimmer_data(argv[1]))


if __name__ == "__main__":
    main()
