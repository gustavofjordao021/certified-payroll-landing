export const experiments = {
  homepagePositioning: {
    enabled: true,
    variants: ["control", "review_first"] as const,
  },
  pricingIntent: {
    enabled: false,
    variants: ["29", "59", "99"] as const,
  },
} as const;

export type HomepagePositioningVariant =
  (typeof experiments.homepagePositioning.variants)[number];

const STORAGE_PREFIX = "wh347_experiment:";

export function selectVariant<T extends string>(
  variants: readonly T[],
  randomValue: number,
): T {
  const index = Math.min(
    variants.length - 1,
    Math.floor(Math.max(0, randomValue) * variants.length),
  );
  return variants[index];
}

export function getHomepagePositioningVariant(): HomepagePositioningVariant {
  const experiment = experiments.homepagePositioning;
  if (!experiment.enabled || typeof window === "undefined") return "control";

  const key = `${STORAGE_PREFIX}homepage_positioning`;
  try {
    const stored = sessionStorage.getItem(key);
    if (experiment.variants.includes(stored as HomepagePositioningVariant))
      return stored as HomepagePositioningVariant;

    const assigned = selectVariant(experiment.variants, Math.random());
    sessionStorage.setItem(key, assigned);
    return assigned;
  } catch {
    return "control";
  }
}
