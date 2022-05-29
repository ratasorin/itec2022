import React, { ReactElement } from 'react';
import { Navigate } from 'react-router';
import Header from '../components/header.component';
import SearchContainer from '../components/search/searchcontainer.component';
import useUser from '../hooks/useUser';
// import SearchForm from "../components/search/searchform.component";

function SearchPage(): ReactElement {
  const user = useUser();
  if (!user)
    Navigate({
      to: '/auth',
    });
  return (
    <div className="w-screen h-screen">
      <Header />
      <SearchContainer />
    </div>
  );
}

export default SearchPage;
