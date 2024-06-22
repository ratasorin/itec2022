import { useUser } from '@client/hooks/user';
import LayoutWithNavbar from '@client/layouts/with-navbar';
import { Button } from '@mui/material';
import { useState } from 'react';
import BookingsView from './components/bookings-view';
import OfficesView from './components/offices-view';

type i_Views = 'BOOKINGS' | 'OFFICES';

const Index = () => {
  const user = useUser();
  const [view, setView] = useState<i_Views>('OFFICES');
  return (
    <LayoutWithNavbar>
      <div className="font-poppins flex w-screen flex-row items-start px-10">
        <h3 className="text-2xl font-[1000]">
          Welcome back,{' '}
          <span className="rounded-lg border-2 border-slate-300 bg-slate-50 px-2 py-1 text-slate-900">
            {user?.name}
          </span>{' '}
          👋
        </h3>
      </div>
      <div className="mt-5 flex w-screen flex-row items-start px-10">
        <Button
          style={{
            borderBottom: view === 'BOOKINGS' ? '2px solid black' : '',
          }}
          onClick={() => setView('BOOKINGS')}
          variant="text"
          className="font-poppins row-start-2 mr-5 rounded-none border-black text-black hover:border-black hover:bg-black/5"
        >
          MY BOOKINGS
        </Button>
        <Button
          style={{
            borderBottom: view === 'OFFICES' ? '2px solid black' : '',
          }}
          onClick={() => setView('OFFICES')}
          variant="text"
          className="font-poppins row-start-2 rounded-none border-black text-black hover:border-black hover:bg-black/5"
        >
          MY OFFICES
        </Button>
      </div>
      <div className="w-screen p-10">
        {view === 'BOOKINGS' ? (
          <BookingsView></BookingsView>
        ) : (
          <OfficesView></OfficesView>
        )}
      </div>
    </LayoutWithNavbar>
  );
};

export default Index;
