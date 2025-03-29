import { IRatingsHistoryDto } from "./IRatingsHistoryDto";

export interface IUserStatsDto {
  id: string;
  createdAt: string;
  username: string;
  wins: number;
  defeats: number;
  draws: number;
  totalGames: number;
  winStreak: number;
  defeatStreak: number;
  rating: number;
  ratingsHistory?: IRatingsHistoryDto[];
}
