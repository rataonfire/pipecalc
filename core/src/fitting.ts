import { Detail } from "./types";
export const fitPipes = (pipes: Array<number>) => {
  const materialSize = 5500;
  const sortedPipes = sortPipes(pipes);
};
const sortPipes = (pipes: Array<number>) => {
  [...pipes].sort((a: number, b: number) => b - a);
};
const isFit = (pipeSize: number, amountLength: number) => {
  pipeSize <= amountLength ? true : false;
};
