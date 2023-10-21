import chalk from "chalk";
import * as fs from "fs";

import { parseFileContent } from "./parsing/parseFileContent.js";

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

const flattenLocaleKeys = (sections) => {
  return Object.keys(sections).reduce((accKeys, sectionName) => {
    const section = sections[sectionName];

    const keys = Object.keys(section).map((localeKey) => {
      return `${sectionName}.${localeKey}`;
    });

    return [...accKeys, ...keys];
  }, []);
};

const diffLocaleKeysFromResult = (resultA, resultB) => {
  const flattenedResultA = flattenLocaleKeys(resultA.sections);
  const flattenedResultB = flattenLocaleKeys(resultB.sections);
  return flattenedResultA.filter((k) => !flattenedResultB.includes(k));
};

const diffSectionsFromResult = (resultA, resultB) => {
  const sectionsA = Object.keys(resultA.sections);
  const sectionsB = Object.keys(resultB.sections);
  return sectionsA.filter((k) => !sectionsB.includes(k));
};

const verifyUnknownLocaleKeys = (frResult, enResult) => {
  const diffFr = diffLocaleKeysFromResult(frResult, enResult);

  if (diffFr.length > 0) {
    throw new Error(
      'Unknown keys in "fr" language:\n' + chalk.bold.blue(diffFr.join("\n"))
    );
  }
};

const verifyMissingLocaleKeys = (frResult, enResult) => {
  const diffEn = diffLocaleKeysFromResult(enResult, frResult);

  if (diffEn.length > 0) {
    throw new Error(
      'Missing keys in "fr" language:\n' + chalk.bold.blue(diffEn.join("\n"))
    );
  }
};

const verifyUnknownSections = (frResult, enResult) => {
  const diffFr = diffSectionsFromResult(frResult, enResult);

  if (diffFr.length > 0) {
    throw new Error(
      'Unknown sections in "fr" language:\n' +
        chalk.bold.green(diffFr.join("\n"))
    );
  }
};

const verifyMissingSections = (frResult, enResult) => {
  const diffEn = diffSectionsFromResult(enResult, frResult);

  if (diffEn.length > 0) {
    throw new Error(
      'Missing sections in "fr" language:\n' +
        chalk.bold.green(diffEn.join("\n"))
    );
  }
};

const main = async (frDirectory, enDirectory) => {
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

  verifyUnknownSections(frResult, enResult);
  verifyMissingSections(frResult, enResult);

  verifyUnknownLocaleKeys(frResult, enResult);
  verifyMissingLocaleKeys(frResult, enResult);
};

const args = process.argv.slice(2);
main(...args).catch((err) => {
  console.error(chalk.red(err.message));
  process.exit(1);
});
