export type WeightGoalDirection = "loss" | "gain" | "maintain";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const resolveWeightGoal = (
  currentWeightInput: number,
  targetWeightInput: number,
) => {
  const startWeight = clamp(currentWeightInput || 100, 30, 300);
  const desiredWeight = clamp(
    targetWeightInput || Math.max(60, startWeight - 20),
    30,
    300,
  );
  const rawDelta = desiredWeight - startWeight;
  const absoluteChange = Math.abs(rawDelta);

  const direction: WeightGoalDirection =
    rawDelta > 0 ? "gain" : rawDelta < 0 ? "loss" : "maintain";

  return {
    startWeight,
    desiredWeight,
    rawDelta,
    absoluteChange,
    direction,
  };
};
