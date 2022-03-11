// What is the ID of the guard you chose multiplied by the minute you chose? (In the above example, the answer would be 10 * 24 = 240.)

const fs = require("fs/promises");

const formatText = async () => {
  const fileInput = await fs.readFile("./input.txt", "utf8");
  //   console.log(fileInput);
  const fileInputArray = fileInput.split("\n");
  const splitArray = fileInputArray.map((entry) => {
    const stringEntry = entry.split(/(?<=])/);
    return { dateTime: stringEntry[0], note: stringEntry[1] };
  });

  return splitArray;
};

const sortFile = async () => {
  const data = await formatText();

  const sortedData = data.sort((a, b) => {
    if (a.dateTime < b.dateTime) {
      return -1;
    }
    if (a.dateTime > b.dateTime) {
      return 1;
    }
    return 0;
  });

  const brokenUpData = sortedData.map((entry) => {
    const splitDateTime = entry.dateTime.slice(1, 17).split(" ");
    return { date: splitDateTime[0], time: splitDateTime[1], ...entry };
  });

  return brokenUpData;
};

const calculateData = async () => {
  const sortedDate = await sortFile();
  const guardData = {};

  let currentGuardNum = "";

  let totalMinutes = 0;

  let sleepTime = 0;

  sortedDate.forEach((entry) => {
    const minute = Number(entry.time.slice(3));
    if (entry.note.includes("#")) {
      currentGuardNum = entry.note.match(/#\d*/)[0];
      guardData[currentGuardNum] = 0;
    }

    if (entry.note.includes("falls asleep")) {
      sleepTime = minute;
    }

    if (entry.note.includes("wakes")) {
      totalMinutes = minute - sleepTime;
      guardData[currentGuardNum] += totalMinutes;
      totalMinutes = 0;
    }
  });

  return guardData;
};

module.exports = { formatText, sortFile, calculateData };
