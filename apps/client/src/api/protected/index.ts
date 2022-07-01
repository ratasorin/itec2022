export const accessProtectedRoute = (route: string, settings: RequestInit) => {
  const token = localStorage.getItem('token');
  if (!token) return 'You are not authorized to use this app !';
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
    console.error(err);
    return 'An error has ocurred !';
  }
};
