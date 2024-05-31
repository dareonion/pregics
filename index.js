const DateTime = luxon.DateTime;
function to_timestring(date) {
  return `${date.getUTCFullYear()}${date.getUTCMonth()}${date.getUTCDay()}T${date.getUTCHours()}${date.getUTCMinutes()}${date.getUTCSeconds()}Z`;
}

// event example:

// BEGIN:VEVENT
// DTSTART;VALUE=DATE:20240426
// DTEND;VALUE=DATE:20240427
// DTSTAMP:20240531T192808Z
// UID:00647E86-5CEB-F3A5-23E3-FD254B3442A2
// CREATED:19000101T120000Z
// LAST-MODIFIED:20240509T195845Z
// SEQUENCE:0
// STATUS:CONFIRMED
// SUMMARY:6 weeks\, 3 days (45)
// TRANSP:OPAQUE
// END:VEVENT


function create_ics_file(date) {
  const DUEDATE_DT = DateTime.fromISO(date);
  const DAY0_DT = DUEDATE_DT.minus({days:280});
  const NOW_DT = DateTime.utc();
  const DTSTAMP = NOW_DT.toFormat("yyyyMMdd'T'HHmmss'Z'");
  const CREATED = '19000101T120000Z';
  var arr = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:pregics"];
  for (let i=0; i<300; i++) {
    var dtstart_dt = DAY0_DT.plus({days: i});
    var dtend_dt = dtstart_dt.plus({days: 1});
    var dtstart = dtstart_dt.toFormat('yyyyMMdd');
    var dtend = dtend_dt.toFormat('yyyyMMdd');
    var weeks = Math.floor(i/7);
    var day_remainder = i%7;
    var title = "";
    var title_arr = [];
    if (weeks == 1) {
      title_arr.push(`1 week`);
    } else if (weeks > 1) {
      title_arr.push(`${weeks} weeks`);
    }
    if (day_remainder == 1) {
      title_arr.push(`1 day`);
    } else if (day_remainder > 1) {
      title_arr.push(`${day_remainder} days`);
    }

    if (i == 0) {
      title = "0 days";
    } else {
      title = title_arr.join('\\, ');
    }
    title += ` (${i-280})`;

    // var dtstart = '20240426';
    // var dtend = '20240427';
    // var dtstamp = '20240531T192808Z';
    // var uid = '00647E86-5CEB-F3A5-23E3-FD254B3442A2';
    var uid = crypto.randomUUID();
    var summary = title;
    var vevent_str = `BEGIN:VEVENT
DTSTART;VALUE=DATE:${dtstart}
DTEND;VALUE=DATE:${dtend}
DTSTAMP:${DTSTAMP}
UID:${uid}
CREATED:${CREATED}
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:${summary}
TRANSP:OPAQUE
END:VEVENT`;
    arr.push(vevent_str);
  }
  arr.push("END:VCALENDAR");
  return arr.join('\n');
}

const due_date_input = document.querySelector("#duedate");
due_date_input.addEventListener("change", (event) => {
  // 2024-03-15
  console.log(event.target.value);
  var ics_file = create_ics_file(event.target.value);
  // https://javascript.info/blob
  let blob = new Blob([ics_file], {type: 'text/plain'});
  const link = document.querySelector('#link');
  link.download = "pregnancy_tracker.ics";
  link.href = URL.createObjectURL(blob);
});
