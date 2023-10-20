const fs = require("fs");

const { splitLines } = require("./utils/splitLines");
const { parseAllSections } = require("./utils/parsing");

const simpleSectionMerge = (targetSection, sourceSection) => {
  if (!targetSection) {
    return { mergedSection: sourceSection, errors: [] };
  }

  if (!sourceSection) {
    return { mergedSection: targetSection, errors: [] };
  }

  return Object.keys(sourceSection).reduce(
    (state, localeKey) => {
      const localeValue = sourceSection[localeKey];
      const targetLocaleValue = targetSection[localeKey];

      if (targetLocaleValue) {
        return {
          ...state,
          errors: state.errors.concat(
            `Duplicate key "${localeKey}" found on section`
          ),
        };
      }

      return {
        ...state,
        mergedSection: { ...state.mergedSection, [localeKey]: localeValue },
      };
    },
    { mergedSection: targetSection, errors: [] }
  );
};

const mergeSections = (state, sections) => {
  return Object.keys(sections).reduce((state, sectionName) => {
    const section = sections[sectionName];
    const currentSection = state.sections[sectionName];

    const { mergedSection, errors } = simpleSectionMerge(
      currentSection,
      section
    );

    if (errors.length) {
      return { ...state, errors: state.errors.concat(errors) };
    }

    return {
      ...state,
      sections: {
        ...state.sections,
        [sectionName]: mergedSection,
      },
    };
  }, state);
};

const checkFiles = (allFilePaths) => {
  return allFilePaths.reduce(
    (state, filePath) => {
      const content = fs.readFileSync(filePath, "utf8");
      const lines = splitLines(content);
      const { sections, errors } = parseAllSections(lines);

      if (errors.length) {
        return { ...state, errors: state.errors.concat(errors) };
      }

      return mergeSections(state, sections);
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
