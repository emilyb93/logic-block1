const fs = require("fs/promises");

const formatText = async () => {
  const fileInput = await fs.readFile("./input.txt", "utf8");
  //   console.log(fileInput);
  const fileInputArray = fileInput.split("\n");

  return fileInputArray;
};

// formatText();

module.exports = { formatText };
