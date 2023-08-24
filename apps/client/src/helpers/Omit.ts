export const Omit = <Return extends Record<string, unknown>>(
  o: Record<string, unknown>,
  omit: string
) =>
  Object.fromEntries(
    Object.entries(o).filter(([key]) => key === omit)
  ) as Return;
