export type GuidCaseMode = "lowercase" | "uppercase";

export type GuidFormatOptions = {
  count: number;
  caseMode: GuidCaseMode;
  includeHyphens: boolean;
  includeBraces: boolean;
};

const normalizeGuid = (
  guid: string,
  options: Omit<GuidFormatOptions, "count">,
) => {
  let value = guid;

  if (!options.includeHyphens) {
    value = value.replace(/-/g, "");
  }

  if (options.caseMode === "uppercase") {
    value = value.toUpperCase();
  } else {
    value = value.toLowerCase();
  }

  if (options.includeBraces) {
    value = `{${value}}`;
  }

  return value;
};

export const createFormattedGuids = (options: GuidFormatOptions) => {
  const safeCount = Math.max(1, Math.min(100, Math.trunc(options.count)));
  const formatted: string[] = [];

  for (let index = 0; index < safeCount; index += 1) {
    const baseGuid = crypto.randomUUID();
    formatted.push(
      normalizeGuid(baseGuid, {
        caseMode: options.caseMode,
        includeHyphens: options.includeHyphens,
        includeBraces: options.includeBraces,
      }),
    );
  }

  return formatted;
};
