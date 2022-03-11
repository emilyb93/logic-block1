const { expect } = require("@jest/globals");
const { formatText } = require("../block1");

describe("formatText", () => {
  test("should format the text into an an array", async () => {
    const formattedArray = await formatText();

    console.log(formattedArray.slice(0, 10));
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
