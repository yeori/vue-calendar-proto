const ONE_DAY_MILLIS = 1 * 24 * 60 * 60 * 1000;

class Job {
  constructor(target) {
    this.target = target;
    this.startDate = Day.parse(target.startAt);
    this.endDate = Day.parse(target.endAt);
  }
  isValid(day) {
    const { startDate, endDate } = this;
    return (
      startDate.formatText() <= day.formatText() &&
      day.formatText() <= endDate.formatText()
    );
  }
}
class Day {
  constructor(year, month, date, timeInstance) {
    this.year = year;
    this.month = month;
    this.date = date;
    const d = new Date();
    if (timeInstance) {
      d.setTime(timeInstance.getTime());
    } else {
      d.setFullYear(year);
      d.setMonth(month - 1);
      d.setDate(date);
    }
    this._d = d;
  }
  get id() {
    return `${this.year}-${this.month}-${this.date}`;
  }
  formatText() {
    const m = this.month < 10 ? "0" + this.month : this.month;
    const d = this.dateText();
    return `${this.year}-${m}-${d}`;
  }
  dateText() {
    return this.date < 10 ? `0${this.date}` : `${this.date}`;
  }
  prevOffset() {
    return this._d.getDay();
  }
  before(millis) {
    const time = this._d.getTime() - millis;
    const prev = new Date(time);
    const year = prev.getFullYear();
    const month = prev.getMonth() + 1;
    const date = prev.getDate();
    return new Day(year, month, date);
  }
  after(millis) {
    const time = this._d.getTime() + millis;
    const prev = new Date(time);
    const year = prev.getFullYear();
    const month = prev.getMonth() + 1;
    const date = prev.getDate();
    return new Day(year, month, date);
  }
  prevDay() {
    return this.before(ONE_DAY_MILLIS);
  }
  nextDay() {
    return this.after(ONE_DAY_MILLIS);
  }
}
Day.parse = (format) => {
  const [year, month, date] = format
    .split("T")[0]
    .split("-")
    .map((s) => parseInt(s));
  return new Day(year, month, date);
};

class Week {
  constructor(days) {
    this.days = days;
  }
  get id() {
    this.days[0].id;
  }
  lastDay() {
    return this.days[this.days.length - 1];
  }
  nextWeek() {
    let day = this.days[6];
    let days = [];
    while (days.length < 7) {
      day = day.nextDay();
      days.push(day);
    }
    return new Week(days);
  }
}

Week.build = (day) => {
  const days = [];
  let offset = day.prevOffset();
  let ref = day;
  while (offset > 0) {
    ref = ref.prevDay();
    days.unshift(ref);
    offset--;
  }
  ref = day;
  while (days.length < 7) {
    days.push(ref);
    ref = ref.nextDay();
  }
  return new Week(days);
};

class Month {
  constructor(year, month, weeks) {
    this.year = year;
    this.month = month;
    this.weeks = weeks;
  }
  prevMonth() {
    // ldpm : Last Day of Prev Month
    const ldpm = this.weeks[0].days[0].prevDay();
    const { year, month } = ldpm;
    const ym = `${year}-${month < 10 ? "0" + month : month}`;
    return buildCalendar(ym);
  }
  lastDay() {
    const lastWeek = this.weeks[this.weeks.length - 1];
    return lastWeek.lastDay();
  }
  nextMonth() {
    // fdnm: Fist Day of Next Month
    const fdnm = this.lastDay().nextDay();
    const { year, month } = fdnm;
    const ym = `${year}-${month < 10 ? "0" + month : month}`;
    return buildCalendar(ym);
  }
  yearText() {
    return "" + this.year;
  }
  monthText() {
    const m = this.month;
    return m < 10 ? `0${m}` : `${m}`;
  }
}

const buildCalendar = (ym) => {
  const [year, month] = ym.split("-").map((s) => parseInt(s));
  const firstDay = new Day(year, month, 1);
  console.log(firstDay);

  let week = Week.build(firstDay);
  let weeks = [week];
  while (weeks.length < 6) {
    week = week.nextWeek();
    weeks.push(week);
  }
  return new Month(year, month, weeks);
};

const buildJobs = (jobs) => {
  return jobs.map((job) => new Job(job));
};
export default { buildCalendar, buildJobs };
