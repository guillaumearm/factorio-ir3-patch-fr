import chalk from "chalk";

/** Merge `sourceSection` into `targetSection` */
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
            `Duplicate key "${chalk.bold.blue(localeKey)}" found on section`
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

/** Merge sections from `sections` into `state` */
export const mergeSections = (state, sections) => {
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
