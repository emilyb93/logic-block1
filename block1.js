// What is the ID of the guard you chose multiplied by the minute you chose? (In the above example, the answer would be 10 * 24 = 240.)

const fs = require("fs/promises");

const formatText = async () => {
  const fileInput = await fs.readFile("./input.txt", "utf8");
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

const findSleepiestMinute = async () => {
  const guardData = await calculateData();

  let sleepiestGuardNum = "";
  let sleepiestMinutes = 0;

  for (let guard in guardData) {
    if (guardData[guard].total > sleepiestMinutes) {
      sleepiestMinutes = guardData[guard].total;
      sleepiestGuardNum = guardData[guard].guardNum;
    }
  }

  const sleepiestGuard = guardData[sleepiestGuardNum];
  console.log(sleepiestGuard);

  const minutesCounter = {};

  sleepiestGuard.sleepTuples.forEach((tuple) => {
    const start = tuple[0];
    const end = tuple[1];
    for (let i = start; i < end; i++) {
      if (!minutesCounter.hasOwnProperty(i)) {
        minutesCounter[i] = 0;
      }
      minutesCounter[i]++;
    }
  });

  const sortedTuplesArray = Object.entries(minutesCounter).sort((a, b) => {
    if (a[1] < b[1]) {
      return 1;
    }
    if (a[1] > b[1]) {
      return -1;
    }
    return 0;
  });

  return {
    guardNum: sleepiestGuardNum,
    sleepiestMinute: Number(sortedTuplesArray[0][0]),
  };
};

const finalAnswer = async () => {
  const sleepiestData = await findSleepiestMinute();

  return (
    Number(sleepiestData.guardNum.slice(1)) * sleepiestData.sleepiestMinute
  );
};

const findSleepiestOverallMinute = async () => {
  const fullData = await calculateData();

  for (let guard in fullData) {
    const minuteCounter = {};

    fullData[guard].sleepTuples.forEach((sleepTuple) => {
      const start = sleepTuple[0];
      const end = sleepTuple[1];
      for (let i = start; i < end; i++) {
        if (!minuteCounter.hasOwnProperty(i)) {
          minuteCounter[i] = 0;
        }

        minuteCounter[i]++;
      }
    });

    fullData[guard].minuteCounter = minuteCounter;
  }

  let currentGuardNum = "";
  let sleepiestMinute = 0;
  let sleepiestMinuteLabel = "";

  for (let guard in fullData) {
    const minuteTuples = Object.entries(fullData[guard].minuteCounter);

    minuteTuples.forEach((minuteTuple) => {
      if (minuteTuple[1] > sleepiestMinute) {
        sleepiestMinute = minuteTuple[1];
        sleepiestMinuteLabel = minuteTuple[0];
        currentGuardNum = fullData[guard].guardNum;
      }
    });
  }

  return {
    ...fullData[currentGuardNum],
    sleepiestOverallMinute: Number(sleepiestMinuteLabel),
  };
};

const strat2Answer = async () => {
  const guardData = await findSleepiestOverallMinute();

  return Number(guardData.guardNum.slice(1)) * guardData.sleepiestOverallMinute;
};

module.exports = {
  formatText,
  sortFile,
  calculateData,
  findSleepiestMinute,
  finalAnswer,
  findSleepiestOverallMinute,
  strat2Answer,
};
