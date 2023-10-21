import chalk from "chalk";

const isValidSectionName = (line) =>
  Boolean(line.startsWith("[") && line.endsWith("]"));

const parseLocaleConfigLine = (line) => {
  const splittedLine = line.split("=");

  if (splittedLine.length >= 2) {
    const key = splittedLine[0];
    const value = splittedLine.slice(1).join("=");
    return { key, value };
  }

  return null;
};

const parseSections = (state, line) => {
  if (isValidSectionName(line)) {
    if (state.sections[line]) {
      return {
        ...state,
        errors: state.errors.concat(
          `Duplicate section "${chalk.bold.green(line)}" found`
        ),
      };
    }
    return {
      ...state,
      currentSection: line,
      sections: { ...state.sections, [line]: {} },
    };
  }

  const parsedLine = parseLocaleConfigLine(line);

  if (!parsedLine) {
    // ignore empty lines
    if (line.trim().length === 0) {
      return state;
    }

    return {
      ...state,
      errors: state.errors.concat(
        `Cannot parse line "${chalk.bold.white(line)}"`
      ),
    };
  }

  if (!state.currentSection) {
    return {
      ...state,
      errors: state.errors.concat(
        `Cannot parse line "${chalk.bold.white(
          line
        )}" because no section is defined`
      ),
    };
  }

  if (!state.sections[state.currentSection]) {
    return {
      ...state,
      errors: state.errors.concat(
        `Cannot parse line "${chalk.bold.white(
          line
        )}" because section "${chalk.bold.green(
          state.currentSection
        )}" is not defined`
      ),
    };
  }

  if (state.sections[state.currentSection][parsedLine.key]) {
    return {
      ...state,
      errors: state.errors.concat(
        `Duplicate key "${chalk.bold.blue(
          parsedLine.key
        )}" found on section "${chalk.bold.green(state.currentSection)}"`
      ),
    };
  }

  return {
    ...state,
    sections: {
      ...state.sections,
      [state.currentSection]: {
        ...state.sections[state.currentSection],
        [parsedLine.key]: parsedLine.value,
      },
    },
  };
};

const INITIAL_STATE = {
  currentSection: null,
  sections: {},
  errors: [],
};

export const parseAllSections = (lines) => {
  return lines.reduce(parseSections, INITIAL_STATE);
};
