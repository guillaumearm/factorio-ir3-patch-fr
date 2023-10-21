import { splitLines } from "./utils.js";
import { parseAllSections } from "./parseAllSections.js";
import { mergeSections } from "./mergeSections.js";

/** Parse `content` and merge it into `state` */
export const parseFileContent = (state, content) => {
  const lines = splitLines(content);
  const { sections, errors } = parseAllSections(lines);

  if (errors.length) {
    return { ...state, errors: state.errors.concat(errors) };
  }

  return mergeSections(state, sections);
};
