const isValidSectionName = (line) =>
  Boolean(line.startsWith("[") && line.endsWith("]"));

const parseNextSection = ([sectionName, ...restLines]) => {
  // const lines = restLines.concat(); // clone the array ?

  if (!isValidSectionName(sectionName)) {
    throw new Error(`Cannot parse section name: ${sectionName}`);
  }

  const parsedLocales = {};

  restLines.forEach((line) => {
    // TODO: parseSectionName
    if (isValidSectionName(line)) {
      // TODO stop loop ?
      return;
    }

    // TODO: parseLocalKeyValue
    const splittedLine = line.split("=");
    if (splittedLine.length >= 2) {
      const k = splittedLine[0];
      const v = splittedLine[1];

      // if (parsedLocales[k]) {
      //   throw new Error(
      //     `Dupliate key "${k}" found on section "${sectionName}"`
      //   );
      // }

      parsedLocales[k] = v;
    }
  });

  const parsedSections = {
    [sectionName]: parsedLocales,
  };

  return [parsedSections];
  // const content = fs.readFileSync(filePath, "utf8");

  // const lines = splitLines(content)

  // const currentSection = null;
};

module.exports = {
  parseNextSection,
};
