export function getAgeFromDateString(dateString: string) {
  const creation_date = Date.parse(dateString);
  const current_date = new Date();
  const ageInMili = current_date.getTime() - creation_date;
  const ageInMin = Math.floor(ageInMili / 60000);
  return ageInMin;
}

export function sortByAgeFromString(arrayOfTickets: any[]) {
  function compare(ticketA: any, ticketB: any) {
    if (
      getAgeFromDateString(ticketA.creation_timestamp) <
      getAgeFromDateString(ticketB.creation_timestamp)
    ) {
      return 1;
    }
    if (
      getAgeFromDateString(ticketA.creation_timestamp) >
      getAgeFromDateString(ticketB.creation_timestamp)
    ) {
      return -1;
    }

    return 0;
  }

  return arrayOfTickets.sort(compare);
}

export function dateStringToTime(dateString: string) {
  const time = new Date(Date.parse(dateString));
  return time.toTimeString().split(" ")[0];
}

export function turnDatesToOptions(dates: any) {
  function todayOrYesterday(date: any) {
    const millisecondsInADay = 86400000;
    //@ts-ignore
    const diff = new Date() - new Date(date);
    if (diff < millisecondsInADay) return "Today";
    else if (diff > millisecondsInADay && diff < 2 * millisecondsInADay)
      return "Yesterday";
    else return date;
  }

  const dateOptions = [];

  dateOptions.push({ optionValue: "x2001-01-01", optionText: "All Time" });
  dateOptions.push({
    optionValue:
      "x" +
      new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7)
        .toISOString()
        .slice(0, 10),
    optionText: "Past 7 Days",
  });
  dateOptions.push({
    optionValue:
      "x" +
      new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30)
        .toISOString()
        .slice(0, 10),
    optionText: "Past 30 Days",
  });

  const currentDateString = new Date().toISOString().slice(0, 10);
  const juneThisYear =
    "x" + currentDateString.slice(0, 5) + "06" + currentDateString.slice(7, 10);
  const janThisYear =
    "x" + currentDateString.slice(0, 5) + "01" + currentDateString.slice(7, 10);

  dateOptions.push({
    optionValue: new Date().getMonth() + 1 > 6 ? juneThisYear : janThisYear,
    optionText: "This Semester",
  });

  dateOptions.push(
    ...dates.map((date: any) => ({
      optionValue: date,
      optionText: todayOrYesterday(date),
    }))
  );

  return dateOptions;
}

export function turnLabsToOptions(labs: any) {
  var labOptions = [];
  for (let lab of labs) {
    labOptions.push({ optionText: lab.title, optionValue: lab.id });
  }
  return labOptions;
}

export function turnModulesToOptions(modules: any) {
  var moduleOptions = [];

  for (let module of modules) {
    moduleOptions.push({
      optionText: `${module.code} - ${module.name}`,
      optionValue: module.code,
    });
  }
  return moduleOptions;
}
