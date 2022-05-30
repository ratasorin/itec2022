import sanitizeInterval from './sanitizeInterval';

const allTimeframes = (
  limits: [Date, Date],
  bookedIntervals: [Date, Date][]
): [Date, Date][] => {
  if (!bookedIntervals.length) return [];
  if (limits[0] < bookedIntervals[0][0] && limits[0] < bookedIntervals[0][1])
    return [
      [limits[0], bookedIntervals[0][0]],
      ...allTimeframes([bookedIntervals[0][0], limits[1]], bookedIntervals),
    ];

  if (limits[0] >= bookedIntervals[0][0] && limits[0] < bookedIntervals[0][1])
    return [
      sanitizeInterval(bookedIntervals[0], limits),
      [
        bookedIntervals[0][1],
        bookedIntervals[1] ? bookedIntervals[1][0] : limits[1],
      ],
      ...allTimeframes(
        [bookedIntervals[1] ? bookedIntervals[1][0] : limits[1], limits[1]],
        bookedIntervals.slice(1)
      ),
    ];
  return [];
};

export default allTimeframes;
