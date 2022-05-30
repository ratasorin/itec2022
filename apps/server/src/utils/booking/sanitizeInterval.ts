const sanitizeInterval = (
  interval: [Date, Date],
  limits: [Date, Date]
): [Date, Date] => {
  if (interval[1] > limits[1]) return [interval[0], limits[1]];
  if (interval[0] < limits[0]) return [limits[0], interval[1]];

  return interval;
};

export default sanitizeInterval;
