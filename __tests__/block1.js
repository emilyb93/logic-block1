const { expect } = require("@jest/globals");
const { formatText, sortFile } = require("../block1");

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
