export const fetchProtected = (route: string, settings: RequestInit) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('NOT AUTHORIZED');
  try {
    const response = fetch(`http://localhost:3000/${route}`, {
      ...settings,
      headers: {
        ...settings.headers,
        Authorization: `${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error('THERE WAS AN ERROR FETCHING THE ROUTE:', route, err);
    throw new Error(String(err));
  }
};
