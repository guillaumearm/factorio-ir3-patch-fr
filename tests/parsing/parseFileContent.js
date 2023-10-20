const { splitLines } = require("./utils");
const { parseAllSections } = require("./parseAllSections");
const { mergeSections } = require("./mergeSections");

/** Parse `content` and merge it into `state` */
const parseFileContent = (state, content) => {
  const lines = splitLines(content);
  const { sections, errors } = parseAllSections(lines);

  if (errors.length) {
    return { ...state, errors: state.errors.concat(errors) };
  }

  return mergeSections(state, sections);
};

module.exports = {
  parseFileContent,
};
