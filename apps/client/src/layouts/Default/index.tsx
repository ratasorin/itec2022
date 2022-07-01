import { FC, ReactNode } from 'react';
import Navbar from '../../components/Navbar';

interface DefaultLayout {
  Section: ReactNode;
}

const index: FC<DefaultLayout> = ({ Section }) => {
  return (
    <div className="flex h-screen w-screen flex-col items-center">
      <Navbar></Navbar>
      {Section}
    </div>
  );
};

export default index;
