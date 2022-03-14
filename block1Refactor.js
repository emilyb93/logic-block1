const fs = require("fs/promises");

const formatText = async () => {
  // Reading File async

  const fileInput = await fs.readFile("./input.txt", "utf8");
  const fileInputArray = fileInput.split("\n");

  // Splitting file into an array by each line and formatting it a little bit early on
  const splitArray = fileInputArray.map((entry) => {
    const stringEntry = entry.split(/(?<=])/);
    const date = stringEntry[0].slice(1, 11);
    const time = stringEntry[0].slice(12, 17);

    return { dateTime: stringEntry[0], note: stringEntry[1], date, time };
  });

  return splitArray;
};

const sortFile = (data) => {
  // Sorting the file based on dateTime
  const sortedData = data.sort((a, b) => {
    if (a.dateTime < b.dateTime) {
      return -1;
    }
    if (a.dateTime > b.dateTime) {
      return 1;
    }
    return 0;
  });

  return sortedData;
};

// My idea was to create an object for each guard that holds the count for each minute.

const generateTuples = (data) => {
  const fullData = {};

  // Creating some temporary let variables to create my data sets while I iterate through the data.
  let currentGuardNum = "";

  let tempTotal = 0;

  let tempSleepTime = 0;

  let tempSleepTuples = [];

  data.forEach((entry) => {
    const minute = Number(entry.time.slice(3));

    if (entry.note.includes("#")) {
      // Here i keep the guard num with the # and as a string so that it is easier to identify from all the other numbers while debugging.

      currentGuardNum = entry.note.match(/#\d*/)[0];

      // Creating an entry in the data Object if it does not exist
      if (!fullData.hasOwnProperty(currentGuardNum)) {
        fullData[currentGuardNum] = {
          guardNum: currentGuardNum,
          total: 0,
          sleepTuples: [],
        };
      }
    }

    // Setting the minute that the guard falls asleep to generate the first half of the sleep tuple, while also getting ready to add to the total
    if (entry.note.includes("falls")) {
      tempSleepTime = minute;
      tempSleepTuples.push(minute);
    }

    // Adding the second half of the sleepTuple. Also if they have woken up, calculating the time asleep to add it to the total.
    if (entry.note.includes("wakes")) {
      tempTotal = minute - tempSleepTime;
      fullData[currentGuardNum].total += tempTotal;

      tempSleepTuples.push(minute);
      fullData[currentGuardNum].sleepTuples.push(tempSleepTuples);

      //Resetting the let variables so that I can re-use them
      tempSleepTuples = [];
      tempTotal = 0;
    }
  });

  return fullData;
};

// Here i am just iterating through to find the sleepiest guard by minutes slept overall, and returning just that guards data to cut down on storage.

const findSleepiestGuard = (guardData) => {
  let sleepiestGuardNum = "";
  let sleepiestMinutes = 0;

  for (let guard in guardData) {
    if (guardData[guard].total > sleepiestMinutes) {
      sleepiestMinutes = guardData[guard].total;
      sleepiestGuardNum = guardData[guard].guardNum;
    }
  }

  const sleepiestGuard = guardData[sleepiestGuardNum];

  return sleepiestGuard;
};

// I decided to do this at the end to decrease the amount of loops i would have to make instead of doing this early on and having to create this data for every single guard.

const generateMinutesData = (data) => {
  const minutesObject = {};
  data.sleepTuples.forEach((tuple) => {
    const start = tuple[0];
    const end = tuple[1];
    for (let i = start; i < end; i++) {
      if (!minutesObject.hasOwnProperty(i)) {
        minutesObject[i] = 0;
      }
      minutesObject[i]++;
    }
  });
  return { ...data, minutesObject };
};

// This functions takes the counted minutes object, turns them into a tuples array with Object.entries and then I just sorted by the [1] index to find the highest overall sleeping minute.

const findSleepiestMinuteOfGuard = (guardData) => {
  const sortedMinutesTuplesArray = Object.entries(guardData.minutesObject).sort(
    (a, b) => {
      if (a[1] < b[1]) {
        return 1;
      }
      if (a[1] > b[1]) {
        return -1;
      }
      return 0;
    }
  );

  return {
    ...guardData,
    sleepiestMinute: Number(sortedMinutesTuplesArray[0][0]),
  };
};

const findStrat1Answer = async () => {
  const data = await formatText();

  const sortedData = sortFile(data);

  const tupledData = generateTuples(sortedData);

  const sleepiestGuard = findSleepiestGuard(tupledData);

  const sleepiestGuardWithMinuteData = generateMinutesData(sleepiestGuard);

  const fullGuardData = findSleepiestMinuteOfGuard(
    sleepiestGuardWithMinuteData
  );

  const answer =
    fullGuardData.sleepiestMinute * Number(fullGuardData.guardNum.slice(1));

  console.log(answer, "<<<<<< Strat 1 Answer");

  return answer;
};

findStrat1Answer();

const findStrat2Answer = async () => {
  const data = await formatText();

  const sortedData = sortFile(data);

  const tupledData = generateTuples(sortedData);

  // ^^^ Just doing the same steps as before to get the tupled data

  // Some temp variables for my iteration
  let sleepiestGuardNum = "";
  let sleepiestMinuteTotal = 0;
  let sleepiestMinuteName = "";

  // Since i need to find the sleepiest minute among ALL the guards, i need to iterate through the guards data, create a minutes object for each.
  for (let guard in tupledData) {
    //Creating the minutes data here
    const newGuardData = generateMinutesData(tupledData[guard]);

    // Doing this iteration within the same loop as create the minutes data to save doing another loop later

    for (let minuteLabel in newGuardData.minutesObject) {
      // Just creating a nicer variable name for the data
      const minuteData = newGuardData.minutesObject;

      // If i find the current minute count is the highest, setting it as my temp variable so that after all the loops i have the highest minute count and also the guardNumber

      if (minuteData[minuteLabel] > sleepiestMinuteTotal) {
        sleepiestGuardNum = newGuardData.guardNum;
        sleepiestMinuteName = minuteLabel;
        sleepiestMinuteTotal = minuteData[minuteLabel];
      }
    }
  }

  const answer = Number(sleepiestGuardNum.slice(1)) * sleepiestMinuteName;

  console.log(answer, "<<<<<< Strat 2 Answer");

  return answer;
};

findStrat2Answer();
