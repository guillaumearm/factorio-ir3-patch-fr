const fs = require("fs");

const { splitLines } = require("./utils/splitLines");
const { parseNextSection } = require("./utils/parsing");

const main = (allFilePaths) => {
  allFilePaths.forEach((filePath) => {
    const content = fs.readFileSync(filePath, "utf8");
    const lines = splitLines(content);
    const section = parseNextSection(lines);
    // checkDuplicates(filePath);
    // console.log("> " + filePath + " is OK");
  });
};

const argvPaths = process.argv.slice(2);
main(argvPaths);
