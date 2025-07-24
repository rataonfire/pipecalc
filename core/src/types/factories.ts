import { Detail, Tube, CuttingState } from "./types";
export const createTube = (length = 5.5): Tube => ({
  tubeLength: length,
  remainingLength: length,
  placedDetails: [],
});
export const createDetail = (
  detailName: string,
  detailLength: number,
  detailAmount: number
): Detail =>
  Object.freeze({
    name: detailName,
    length: detailLength,
    amount: detailAmount,
  });
export const createCuttingState = (
  tubes: readonly Tube[] = [],
  remainingDetails: readonly Detail[] = [],
  totalWaste = 0,
  isComplete = false
): CuttingState => ({
  tubes: Object.freeze([...tubes]),
  remainingDetails: Object.freeze([...remainingDetails]),
  totalWaste,
  isComplete,
});
