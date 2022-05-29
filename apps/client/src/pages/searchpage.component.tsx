import React, { ReactElement } from "react";
import Naigation from "../components/navigation.component";
import SearchContainer from "../components/search/searchcontainer.component";

function SearchPage(): ReactElement {
    
    return (
        <div className="w-screen h-screen">
            <Naigation />
            <SearchContainer />
        </div>
    )
}

export default SearchPage;