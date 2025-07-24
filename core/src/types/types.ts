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
export interface CuttingState {
  readonly tubes: ReadonlyArray<Tube>;
  readonly remainingDetails: ReadonlyArray<Detail>;
  readonly totalWaste: number;
  readonly isComplete: boolean;
}
