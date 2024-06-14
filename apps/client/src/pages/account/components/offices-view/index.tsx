import { fetchProtectedRoute } from '@client/api/fetch-protected';
import { useQuery } from '@tanstack/react-query';

const OfficesView = () => {
  const q = useQuery({
    queryKey: ['user-offices'],
    queryFn: async () => {
      const response = await fetchProtectedRoute('/user/buildings', {});
      const data = await response.json();
      if (data) {
        return data;
      }
    },
  });
  return <div>{JSON.stringify(q)}</div>;
};

export default OfficesView;
