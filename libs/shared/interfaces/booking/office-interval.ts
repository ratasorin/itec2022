export interface OfficeTimeIntervalDB {
  start: string;
  end: string;
  occupantName: string | null;
}

export interface OfficeTimeIntervalJSON {
  start: string;
  end: string | null;
  occupantName: string | null;
}

export interface UserDefinedOfficeTimeInterval {
  start: Date;
  end: Date | null;
  occupantName: string | null;
}

export interface OfficeTimeInterval {
  start: Date;
  end: Date;
  occupantName: string | null;
}
