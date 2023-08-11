export interface OfficeTimeIntervalDB {
  booked_from: string;
  booked_until: string;
  occupant_name: string;
}

export interface OfficeTimeIntervalAPI {
  booked_from: string | null;
  booked_until: string | null;
  free_from: null | string;
  free_until: null | string;
  occupantName: string | null;
}

export interface OfficeTimeInterval {
  start: string;
  end: string;
  occupantName: string | null;
}
