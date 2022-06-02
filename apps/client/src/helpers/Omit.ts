export const Omit = <Return extends Record<string, any>>(
  o: Record<string, any>,
  omit: string
) =>
  Object.fromEntries(
    Object.entries(o).filter(([key]) => key === omit)
  ) as Return;
