import { SERVER_URL } from '@client/constants/server';

export const fetchProtectedRoute = async (
  route: `/${string}`,
  settings: RequestInit
) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('NOT AUTHORIZED');
  const response = await fetch(`${SERVER_URL}${route}`, {
    ...settings,
    headers: {
      ...settings.headers,
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
  });

  console.log('FROM FETCH PROTECTED:', { response });

  return response;
};
