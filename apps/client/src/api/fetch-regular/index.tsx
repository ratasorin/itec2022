import { SERVER_URL } from '@client/constants/server';

export const fetchRegular = async (
  route: `/${string}`,
  settings: RequestInit
) => {
  const response = await fetch(`${SERVER_URL}${route}`, {
    ...settings,
    headers: {
      ...settings.headers,
    },
  });

  return response;
};
