
export enum AppState {
  SETUP,
  VOTING,
  RESULTS,
}

export type Prices = Record<string, number>;

export interface Zone {
  id: string;
  name: string;
  color: string;
  prices: Prices;
}

export interface Voter {
  id: number;
  name:string;
}

export interface BordaResult {
  zone: Zone;
  score: number;
}