import requests
import time
import json
import pathlib
import os

script_dir = pathlib.Path(__file__).parent.resolve()
courses_path = script_dir / "cpp_courses.json"
all_courses = {}

if os.path.exists(courses_path):
    print("loading existing courses...")
    with open(courses_path, "r") as f:
        existing_courses = json.load(f)
        for course in existing_courses:
            course_key = f"{course['subject']}-{course['catalog_nbr']}"
            all_courses[course_key] = course
    print(f"loaded {len(all_courses)} existing courses")

print("loading session cookies...")
try:
    with open("cookies.json", "r") as f:
        cookies = json.load(f)
except FileNotFoundError:
    print("cookies.json not found, re-run cookies.py to fetch cookies")
    exit()

session_cookies = {cookie['name']: cookie['value'] for cookie in cookies}
print("session cookies loaded")

base_url = "https://cmsweb.cms.cpp.edu/psc/CPOMPRDM/EMPLOYEE/SA/s/WEBLIB_H_SB_STD.ISCRIPT1.FieldFormula.IScript_ClassDetails"
class_range = range(30003, 41089)

print(f"starting to scrape {len(class_range)} classes...")

new_courses_since_last = 0
SAVE_INTERVAL = 50

for class_nbr in class_range:
    params = {'term': '2253', 'classNbr': str(class_nbr)}

    print(f"--> attempting to fetch classNbr: {class_nbr}")

    try:
        response = requests.get(base_url, params=params, cookies=session_cookies)
        response.raise_for_status()
        data = response.json()

        details = data.get("section_info", {}).get("class_details", {})
        description = data.get("section_info", {}).get("catalog_descr", {}).get("crse_catalog_description", "")

        if details and description:
            course_key = f"{details.get('subject', '')}-{details.get('catalog_nbr', '')}"

            if course_key not in all_courses:
                all_courses[course_key] = {
                    "subject": details.get("subject"),
                    "catalog_nbr": details.get("catalog_nbr"),
                    "title": details.get("course_title"),
                    "description": description,
                    "text_for_embedding": f"{details.get('course_title', '')}. {description}"
                }
                print(f"scraped new course: {course_key}")
                new_courses_since_last += 1

                if new_courses_since_last >= SAVE_INTERVAL:
                    with open(courses_path, "w") as f:
                        json.dump(list(all_courses.values()), f, indent=2)
                    print(f"saved {len(all_courses)} courses after scraping {new_courses_since_last} new courses")
                    new_courses_since_last = 0

    except requests.exceptions.Timeout:
        print(f"time out occurred for class {class_nbr}, skipping")
    except requests.RequestException as e:
        print(f"skipping class {class_nbr}, error: {e}")
    except json.JSONDecodeError:
        print(f"skipping class {class_nbr}, invalid JSON response")
    
    #time.sleep(0.1)

with open("cpp_courses.json", "w") as f:
    json.dump(list(all_courses.values()), f, indent=2)

print(f"scraping done, found {len(all_courses)} courses")
