import { Detail, Tube, CuttingState } from "../types/types";

const sortDetailsByLength = (details: Detail[]) => {
  return [...details].sort((a, b) => b.length - a.length);
};

const findBestDetailForRemainingSpace = (
  details: Detail[],
  remainingSpace: number
): Detail | null => {
  let bestDetail: Detail | null = null;
  let smallestWaste = Infinity;

  for (const detail of details) {
    if (detail.length > remainingSpace || detail.amount <= 0) {
      continue;
    }

    const waste = remainingSpace - detail.length;

    if (waste < smallestWaste) {
      smallestWaste = waste;
      bestDetail = detail;
    }
  }

  return bestDetail;
};

const decreaseDetailAmount = (details: Detail[], detailName: string) => {
  return details
    .map((detail) => {
      if (detail.name === detailName) {
        return { ...detail, amount: detail.amount - 1 };
      }
      return detail;
    })
    .filter((detail) => detail.amount > 0);
};

const updateRemainingDetails = (
  remainingDetails: Detail[],
  usedDetails: readonly Detail[]
): Detail[] => {
  let updated = [...remainingDetails];

  for (const usedDetail of usedDetails) {
    updated = decreaseDetailAmount(updated, usedDetail.name);
  }

  return updated;
};

const calculateTotalWaste = (tubes: Tube[]): number => {
  return tubes.reduce(
    (totalWaste, tube) => totalWaste + tube.remainingLength,
    0
  );
};

const fillTubeOptimally = (
  availableDetails: Detail[],
  tubeLength: number
): Tube => {
  const placedDetails: Detail[] = [];
  let remainingLength = tubeLength;
  let availableDetailsCopy = [...availableDetails];

  while (availableDetailsCopy.length > 0) {
    const bestDetail = findBestDetailForRemainingSpace(
      availableDetailsCopy,
      remainingLength
    );
    if (!bestDetail) {
      break;
    }
    placedDetails.push({
      name: bestDetail.name,
      length: bestDetail.length,
      amount: 1,
    });
    remainingLength -= bestDetail.length;
    availableDetailsCopy = decreaseDetailAmount(
      availableDetailsCopy,
      bestDetail.name
    );
  }

  return {
    tubeLength: tubeLength,
    remainingLength: remainingLength,
    placedDetails: placedDetails as readonly Detail[],
  };
};

export const optimizeCutting = (details: Detail[]): CuttingState => {
  const sortedDetails = sortDetailsByLength(details);
  let remainingDetails = [...sortedDetails];
  const tubes: Tube[] = [];

  while (remainingDetails.length > 0) {
    const filledTube = fillTubeOptimally(remainingDetails, 5500);
    tubes.push(filledTube);

    remainingDetails = updateRemainingDetails(
      remainingDetails,
      filledTube.placedDetails
    );
  }

  const totalWaste = calculateTotalWaste(tubes);

  return {
    tubes: tubes,
    remainingDetails: remainingDetails,
    totalWaste: totalWaste,
    isComplete: remainingDetails.length === 0,
  };
};
const test = [
  { name: "Tube_1", length: 300, amount: 100 },
  { name: "Tube_2", length: 900, amount: 400 },
  { name: "Tube_3", length: 1200, amount: 70 },
  { name: "Tube_4", length: 150, amount: 200 },
  { name: "Tube_5", length: 2900, amount: 70 },
];
const result = optimizeCutting(test);
console.log(result);
console.log(result.tubes[0].placedDetails);
console.log(result.tubes[0].remainingLength);
