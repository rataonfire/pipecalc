import { CuttingState, Detail, OptimizedTubeGroup, Tube } from "../types/types";

const sortDetailsByLength = (details: Detail[]) => {
  return [...details].sort((a, b) => b.length - a.length);
};

const findBestDetailForRemainingSpace = (
  details: Detail[],
  remainingSpace: number,
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
  usedDetails: readonly Detail[],
): Detail[] => {
  let updated = [...remainingDetails];

  for (const usedDetail of usedDetails) {
    updated = decreaseDetailAmount(updated, usedDetail.name);
  }

  return updated;
};

const fillTubeOptimally = (
  availableDetails: Detail[],
  tubeLength: number,
): Tube => {
  const placedDetails: Detail[] = [];
  let remainingLength = tubeLength;
  let availableDetailsCopy = [...availableDetails];

  while (availableDetailsCopy.length > 0) {
    const bestDetail = findBestDetailForRemainingSpace(
      availableDetailsCopy,
      remainingLength,
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
      bestDetail.name,
    );
  }

  return {
    tubeLength: tubeLength,
    remainingLength: remainingLength,
    placedDetails: placedDetails as readonly Detail[],
  };
};

const createTubeSignature = (tube: Tube): string => {
  const sortedDetails = [...tube.placedDetails].sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  return sortedDetails.map((d) => `${d.name}:${d.length}`).join("|");
};

const groupSimilarTubes = (tubes: Tube[]): OptimizedTubeGroup[] => {
  const tubeMap = new Map<string, Tube[]>();

  tubes.forEach((tube) => {
    const signature = createTubeSignature(tube);
    if (!tubeMap.has(signature)) {
      tubeMap.set(signature, []);
    }
    tubeMap.get(signature)!.push(tube);
  });

  return Array.from(tubeMap.entries()).map(
    ([signature, similarTubes], index) => {
      const firstTube = similarTubes[0];
      const totalWaste = similarTubes.reduce(
        (sum, tube) => sum + tube.remainingLength,
        0,
      );

      const detailNames = firstTube.placedDetails.map((d) => d.name).join(", ");
      const groupName = `Type ${index + 1} (${detailNames})`;

      return {
        name: groupName,
        tubes: similarTubes,
        waste: totalWaste,
        amount: similarTubes.length,
      };
    },
  );
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
      filledTube.placedDetails,
    );
  }

  const tubeGroups = groupSimilarTubes(tubes);
  const totalWaste = tubeGroups.reduce((sum, group) => sum + group.waste, 0);
  const totalTubes = tubes.length;

  return {
    tubeGroups,
    remainingDetails,
    totalWaste,
    totalTubes,
    isComplete: remainingDetails.length === 0,
  };
};
