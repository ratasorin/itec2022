import { fetchProtectedRoute } from '@client/api/fetch-protected';
import { i_BuildingOwnedByUser } from '@shared';
import { useQuery } from '@tanstack/react-query';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useMemo } from 'react';
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router';
type i_FieldValues = keyof i_BuildingOwnedByUser | 'index' | 'actions';

type GridColumn = Omit<GridColDef, 'field'> | { field: i_FieldValues };

const OfficesView = () => {
  const buildingsOwnedByUser = useQuery({
    queryKey: ['offices-owned-by-user'],
    queryFn: async () => {
      const response = await fetchProtectedRoute('/user/buildings', {});
      const data = (await response.json()) as i_BuildingOwnedByUser[];
      return data.map((d, index) => ({
        ...d,
        avg_rating: d.avg_rating + '⭐',
        index: index + 1,
      }));
    },
  });

  const navigate = useNavigate();

  const columns = useMemo(() => {
    return [
      {
        field: 'index',
        headerName: '#',
        sortable: true,
        flex: 1,
        editable: false,
      },
      {
        field: 'name',
        headerName: 'Office Name',
        sortable: true,
        flex: 3,
      },
      {
        field: 'active_bookings_count',
        headerName: 'Active Bookings',
        sortable: true,
        flex: 2,
      },
      {
        field: 'bookings_count',
        headerName: 'Total Bookings',
        sortable: true,
        flex: 2,
      },
      { field: 'avg_rating', headerName: 'Rating', sortable: true, flex: 1 },
      {
        field: 'actions',
        headerName: 'Actions',
        sortable: false,
        flex: 4,
        type: 'actions',
        renderCell: (params) => {
          console.log(params);
          return (
            <div className="flex flex-row items-center">
              <Button
                variant="text"
                className="mr-4 rounded-lg bg-slate-200 font-black text-slate-900 hover:bg-slate-300"
                onClick={() => {
                  navigate({ pathname: `../building/${params.row.id}/edit` });
                }}
              >
                EDIT
                <EditIcon className="ml-2 text-lg" />
              </Button>
              <Button
                variant="text"
                className="rounded-lg bg-red-100 font-black text-red-700 hover:bg-red-200"
                onClick={() => {
                  console.log('DELETE ME!');
                }}
              >
                DELETE
                <DeleteIcon className="ml-2 text-lg" />
              </Button>
            </div>
          );
        },
      },
    ] as GridColumn[];
  }, []);

  return (
    <DataGrid
      className="font-poppins"
      rows={buildingsOwnedByUser.data ? buildingsOwnedByUser.data : []}
      columns={columns as GridColDef[]}
      checkboxSelection={false}
      initialState={{
        pagination: {
          paginationModel: { page: 0, pageSize: 5 },
        },
      }}
      pageSizeOptions={[5, 10]}
    />
  );
};

export default OfficesView;
