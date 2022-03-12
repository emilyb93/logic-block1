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
  const fullData = {};

  let newGuardData = {};

  let currentGuardNum = "";

  let tempTotal = 0;

  let tempSleepTime = 0;

  let tempSleepTuples = [];

  sortedDate.forEach((entry) => {
    const minute = Number(entry.time.slice(3));
    if (entry.note.includes("#")) {
      currentGuardNum = entry.note.match(/#\d*/)[0];

      if (!fullData.hasOwnProperty(currentGuardNum)) {
        fullData[currentGuardNum] = {
          guardNum: currentGuardNum,
          total: 0,
          sleepTuples: [],
        };
      }
    }

    if (entry.note.includes("falls asleep")) {
      tempSleepTime = minute;
      tempSleepTuples.push(minute);
    }

    if (entry.note.includes("wakes")) {
      tempTotal = minute - tempSleepTime;
      fullData[currentGuardNum].total += tempTotal;

      tempSleepTuples.push(minute);
      fullData[currentGuardNum].sleepTuples.push(tempSleepTuples);

      tempSleepTuples = [];
      tempTotal = 0;
    }
  });

  return fullData;
};

module.exports = { formatText, sortFile, calculateData };
