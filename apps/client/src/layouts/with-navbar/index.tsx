import { FC, ReactNode } from 'react';
import Navbar from '../../components/navbar';

const LayoutWithNavbar: FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen w-screen flex-col items-center">
      <Navbar></Navbar>
      {children}
    </div>
  );
};

export default LayoutWithNavbar;
