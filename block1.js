// What is the ID of the guard you chose multiplied by the minute you chose? (In the above example, the answer would be 10 * 24 = 240.)

const fs = require("fs/promises");

const formatText = async () => {
  const fileInput = await fs.readFile("./test.txt", "utf8");
  //   console.log(fileInput);
  const fileInputArray = fileInput.split("\n");
  const splitArray = fileInputArray.map((entry) => {
    const stringEntry = entry.split(/(?<=])/);
    return { dateTime: stringEntry[0], note: stringEntry[1] };
  });

  return splitArray;
};

// formatText();

module.exports = { formatText };
