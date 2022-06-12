export interface OfficeTimeIntervalDB {
  booked_from: string;
  booked_until: string;
  free_from: string;
  free_until: string | null;
  occupantName: string | null;
}

export interface OfficeTimeInterval {
  start: string;
  end: string;
  occupantName: string | null;
}
