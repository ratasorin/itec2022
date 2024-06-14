export type i_BuildingReviewServerError = { error: string };

export interface i_InsertBuildingReviewResponse {
  stars: number;
  rating_id: string;
  building_id: string;
}

export interface i_BuildingReviewStats {
  stars: number;
  reviews: number;
}
