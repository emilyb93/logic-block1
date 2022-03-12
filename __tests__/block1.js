const { expect } = require("@jest/globals");
const {
  formatText,
  sortFile,
  calculateData,
  findSleepiestMinute,
  finalAnswer,
} = require("../block1");

describe("formatText", () => {
  test("should format the text into an an array", async () => {
    const formattedArray = await formatText();

    expect(Array.isArray(formattedArray)).toBe(true);
  });

  test("should return an array of objects with the date and text", async () => {
    const formattedArray = await formatText();

    formattedArray.forEach((dataObj) => {
      expect(dataObj).toEqual(
        expect.objectContaining({
          dateTime: expect.any(String),
          note: expect.any(String),
        })
      );
    });
  });
});

describe("sortFile", () => {
  test("should return the data sorted in dateTime order ascending", async () => {
    const sortedData = await sortFile();
    expect(sortedData).toBeSorted({ key: "dateTime" });
  });

  test("each object in the array should have a date, time, dateTime, and note key", async () => {
    const sortedData = await sortFile();
    sortedData.forEach((dataObj) => {
      expect(dataObj).toEqual(
        expect.objectContaining({
          date: expect.any(String),
          time: expect.any(String),
          dateTime: expect.any(String),
          note: expect.any(String),
        })
      );
    });
  });
});

describe("calculateData", () => {
  test("should return an object with a key of each guard number and the amount of minutes they have slept in total", async () => {
    const guardData = await calculateData();

    for (let guard in guardData) {
      expect(typeof guardData[guard]).toBe("object");
      expect(guardData[guard]).toEqual(
        expect.objectContaining({
          guardNum: expect.any(String),
          total: expect.any(Number),
          sleepTuples: expect.any(Array),
        })
      );
    }
  });
});

describe("findSleepiestMinute", () => {
  test("find the sleepiest minute of the sleepiest guard ", async () => {
    const sleepiestData = await findSleepiestMinute();
    console.log(sleepiestData);
    expect(sleepiestData).toEqual(
      expect.objectContaining({
        guardNum: expect.any(String),
        sleepiestMinute: expect.any(Number),
      })
    );
  });
});

describe("finalAnswer", () => {
  test("should return the final answer of the puzzle 19830", async () => {
    expect(await finalAnswer()).toEqual(19830);
  });
});
