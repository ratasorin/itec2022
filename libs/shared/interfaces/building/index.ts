export interface OfficesOnFloor {
  office_id: string;
  x: number;
  y: number;
  occupantName: string | null;
  officeName: string;
  booked_until: string | null;
}

export interface BuildingStats {
  building_id: string;
  building_name: string;
  availability_rate: number;
}
