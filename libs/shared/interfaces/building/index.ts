export interface OfficesOnFloor {
  office_id: string;
  x: number;
  y: number;
  occupantName: string | null;
  officeName: string;
  booked_until: string | null;
}

export interface BuildingStats {
  id: string;
  name: string;
  availability_rate: number;
  stars: number | null;
}
