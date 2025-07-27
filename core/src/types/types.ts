export interface Detail {
  readonly name: string;
  readonly length: number;
  readonly amount: number;
}

export interface Tube {
  readonly tubeLength: number;
  readonly remainingLength: number;
  readonly placedDetails: ReadonlyArray<Detail>;
}

export interface OptimizedTubeGroup {
  readonly name: string;
  readonly tubes: ReadonlyArray<Tube>;
  readonly waste: number;
  readonly amount: number;
}

export interface CuttingState {
  readonly tubeGroups: ReadonlyArray<OptimizedTubeGroup>;
  readonly remainingDetails: ReadonlyArray<Detail>;
  readonly totalWaste: number;
  readonly totalTubes: number;
  readonly isComplete: boolean;
}
