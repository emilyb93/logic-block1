const { formatText, sortFile, calculateData } = require("../block1");

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
    console.log(guardData);
    for (let guard in guardData) {
      expect(typeof guardData[guard]).toBe("number");
    }
  });
});
