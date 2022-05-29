import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import { InputBase, alpha, styled } from "@mui/material";

import { ReactElement } from "react";
import { useUser } from "../mock/useUser";
import { makeStyles } from '@mui/material';

const useStyles = makeStyles((theme: Theme) => ({
    
}))

const Search = styled("div")(({ theme }) => ({
position: "relative",
borderRadius: theme.shape.borderRadius,
backgroundColor: alpha(theme.palette.common.white, 0.15),
"&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
},
marginLeft: 0,
width: "100%",
[theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
},
}));
  
const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));
  
const StyledInputBase = styled(InputBase)(({ theme }) => ({
color: "inherit",
"& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
    width: "12ch",
    "&:focus": {
        width: "20ch",
    },
    },
},
}));

function Naigation(): ReactElement {

    return (
        <header>
            <Box sx={{ flexGrow: 1 }}>
            <AppBar position="sticky">
                <Toolbar className="grid grid-cols-2 grid-rows-1 gap-4 sm:flex mx-5 py-2 sm:py-0">
                <IconButton
                    className="hidden sm:block"
                    // size="large"
                    // edge="start"
                    color="inherit"
                    // sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>

                <Search sx={{ marginRight: 6 }}>
                    <SearchIconWrapper>
                    <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                    placeholder="Search…"
                    inputProps={{"aria-label" : "search" }}
                    />
                </Search>

                <div className="mr-4">
                    <IconButton size="large" color="inherit">
                        <AccountCircle />
                    </IconButton>
                </div>
                </Toolbar>
            </AppBar>
            </Box>
        </header>
    )
}

export default Naigation;