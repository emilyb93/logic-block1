const { expect } = require("@jest/globals");
const { formatText } = require("../block1");

describe("formatText", () => {
  test("should format the text into an an array", async () => {
    const formattedText = await formatText();

    console.log(formattedText.slice(0, 10));
    expect(Array.isArray(formattedText)).toBe(true);
  });
});
