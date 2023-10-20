const fs = require("fs");

const { parseFileContent } = require("./parsing/parseFileContent");

const checkFiles = (allFilePaths) => {
  return allFilePaths.reduce(
    (state, filePath) => {
      const content = fs.readFileSync(filePath, "utf8");
      return parseFileContent(state, content);
    },
    { sections: {}, errors: [] }
  );
};

const countSections = (sections) => Object.keys(sections).length;

const countLocaleKeys = (sections) => {
  return Object.keys(sections).reduce((total, sectionName) => {
    const section = sections[sectionName];
    return total + Object.keys(section).length;
  }, 0);
};

const printReport = ({ errors, sections }, prefix = "> ") => {
  if (errors.length) {
    throw new Error(`${errors.length} errors found:\n${errors.join("\n")}`);
  }

  console.log(`${prefix}Checked sections:`, countSections(sections));
  console.log(`${prefix}Checked locale keys:`, countLocaleKeys(sections));
};

const getFilePaths = (directory) =>
  fs
    .readdirSync(directory)
    .filter((filePath) => filePath && filePath.endsWith(".cfg"))
    .map((filePath) => `${directory}/${filePath}`);

const main = (frDirectory, enDirectory) => {
  if (!frDirectory || !enDirectory) {
    console.log("usage: node check_locales.js <fr_directory> <en_directory>");
    return;
  }

  const allFrFilePaths = getFilePaths(frDirectory);
  const frResult = checkFiles(allFrFilePaths);
  printReport(frResult, "> 🇫🇷  ");

  const allEnFilePaths = getFilePaths(enDirectory);
  const enResult = checkFiles(allEnFilePaths);
  printReport(enResult, "> 🇬🇧  ");

  if (countSections(frResult.sections) !== countSections(enResult.sections)) {
    throw new Error("Sections count does not match between languages");
  }

  if (
    countLocaleKeys(frResult.sections) !== countLocaleKeys(enResult.sections)
  ) {
    throw new Error("Locale keys count does not match between languages");
  }
};

const args = process.argv.slice(2);
main(...args);
