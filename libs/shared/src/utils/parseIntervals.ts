import {
  OfficeTimeInterval,
  OfficeTimeIntervalDB,
  OfficeTimeIntervalJSON,
  UserDefinedOfficeTimeInterval,
} from '../index';

export const parseDBOfficeIntervals = (
  intervals: OfficeTimeIntervalDB[]
): OfficeTimeInterval[] =>
  intervals.map(({ end, occupantName, start }) => ({
    end: new Date(end),
    occupantName,
    start: new Date(start),
  }));

export const parseJSONOfficeIntervals = (
  intervals: OfficeTimeIntervalJSON[]
): UserDefinedOfficeTimeInterval[] =>
  intervals.map(({ end, occupantName, start }) => ({
    end: end ? new Date(end) : null,
    occupantName,
    start: new Date(start),
  }));
