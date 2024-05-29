#!/home/darren/.venv/bin/python3
import pprint
import random
import sys
from datetime import datetime, timedelta

from ics import Calendar, Event

rng = random.SystemRandom()

HEX_DIGITS = '0123456789ABCDEF'

def gen_uid():
    # 5FC53010-1267-4F8E-BC28-1D7AE55A7C99
    # 8, 4, 4, 4, 12
    parts = []
    lst = []
    for _ in range(8):
        lst.append(rng.choice(HEX_DIGITS))
    parts.append(''.join(lst))
    lst.clear()

    for _ in range(4):
        lst.append(rng.choice(HEX_DIGITS))
    parts.append(''.join(lst))
    lst.clear()
    for _ in range(4):
        lst.append(rng.choice(HEX_DIGITS))
    parts.append(''.join(lst))
    lst.clear()
    for _ in range(4):
        lst.append(rng.choice(HEX_DIGITS))
    parts.append(''.join(lst))
    lst.clear()
    for _ in range(12):
        lst.append(rng.choice(HEX_DIGITS))
    parts.append(''.join(lst))
    return '-'.join(parts)

def main2():
    c = Calendar()
    day0 = datetime(2024, 6, 12)
    for i in range(300):
        e = Event()
        weeks = i // 7
        days = i % 7
        name = None
        if days == 1:
            name = "1 day"
        else:
            name = "{} days".format(days)
        if weeks == 1:
            if days == 0:
                name = "1 week"
            else:
                name = "1 week, " + name
        elif weeks > 1:
            if days == 0:
                name = "{} weeks".format(weeks)
            else:
                name = "{} weeks, ".format(weeks) + name
        e.name = '{} ({})'.format(name, i-280)
        e.begin = day0 + timedelta(days=i)
        e.make_all_day()
        c.events.add(e)
    pprint.pprint(c.events)
    with open("output.ics", "w") as f:
        f.write(c.serialize())
    return 0

def main():
    DAY0 = datetime(2023, 6, 12)
    with open("output2.ics", "w") as f:
        f.write("""\
BEGIN:VCALENDAR
VERSION:2.0
PRODID:python_script
""")
        for i in range(300):
            weeks = i // 7
            days = i % 7
            name = None
            if days == 1:
                name = "1 day"
            else:
                name = "{} days".format(days)
            if weeks == 1:
                if days == 0:
                    name = "1 week"
                else:
                    name = "1 week, " + name
            elif weeks > 1:
                if days == 0:
                    name = "{} weeks".format(weeks)
                else:
                    name = "{} weeks, ".format(weeks) + name
            title = '{} ({})'.format(name, i-280).replace(',', '\\,')
            actual_date = DAY0 + timedelta(days=i)
            f.write('''\
BEGIN:VEVENT
DTSTART;VALUE=DATE:{:04}{:02}{:02}
SUMMARY:{}
UID:{}
END:VEVENT
'''.format(actual_date.year, actual_date.month, actual_date.day, title, gen_uid()))
        f.write('END:VCALENDAR\n')
    return 0

if __name__ == "__main__":
    status = main()
    sys.exit(status)
