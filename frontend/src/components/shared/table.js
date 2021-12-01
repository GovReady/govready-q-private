/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import PerfectScrollbar from "react-perfect-scrollbar";

import { makeStyles } from "@mui/styles";
import {
  Card,
  CardActions,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material";

import Search from "@mui/icons-material/Search";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

// import StatusBullet from "./statusBullet";
import { useDebouncedCallback } from "use-debounce";

export const columnDataTypes = {
  STRING: 1,
  TIMESTAMP: 2,
  STATUS: 3,
  BOOL: 4,
};

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
  },
  content: {
    padding: 0,
    overflowX: "auto",
  },
  inner: {
    minWidth: 1050,
  },
  nameContainer: {
    display: "flex",
    alignItems: "baseline",
  },
  status: {
    marginRight: 15,
  },
  actions: {
    justifyContent: "flex-end",
  },
  tableRow: {
    padding: "0 5px",
    cursor: "pointer",
    ".MuiTableRow-root.MuiTableRow-hover&:hover": {},
  },
  hoverable: {
    "&:hover": {
      cursor: `pointer`,
    },
  },
  arrow: {
    fontSize: 10,
    position: "absolute",
  },
}));


export const DataTable = (props) => {
  const formatOrderBy = (data) => {
    return `${data[1] === "desc" ? "-" : ""}${data[0]}`;
  };

  const [querystrings, setQuerystrings] = useState({
    orderBy: formatOrderBy(props.sortby),
    search: "",
    page: 1,
    count: 10,
    // rollup: true
  });
  const [columns, setColumns] = useState(props.columns);
  const [sorting, setSorting] = useState(props.sortby);
  const classes = useStyles();
  const [response, setResponse] = useState({ data: [], rollup: {} });
  const debounceDuration = 250;

  useEffect(() => {
    debouncedFetch(querystrings);
  }, [querystrings]);
  const error = false;
  const fetch = (args) => {
    if (props.rollups.length > 0) {
      args.rollup = "true";
    }
    let cleanedArgs = {};
    Object.keys(args).forEach((prop) => {
      if (typeof args[prop] === "string") {
        if (args[prop].length > 0) {
          cleanedArgs[prop] = args[prop];
        }
      } else {
        cleanedArgs[prop] = args[prop];
      }
    });
    return props.endpoint(cleanedArgs).then((resp) => {      
      setResponse(resp.data);
    });
  };

  const debouncedFetch = useDebouncedCallback((args) => {
    fetch(args);
  }, debounceDuration);

  if (error) {
    return <pre>{error.toString()}</pre>;
  }

  const handlePageChange = (event, page) => {
    setQuerystrings({ ...querystrings, page: page + 1 }); // starts at 0, but backend starts at 1
  };
  const handleRowsPerPageChange = (event) => {
    setQuerystrings({ ...querystrings, count: event.target.value });
  };
  const handleSetSorting = (str) => {
    if(str !== 'undefined') {
      let sortTmp = [str, sorting[1] === "desc" ? "asc" : "desc"];
      setSorting(sortTmp);
      setQuerystrings({ ...querystrings, orderBy: formatOrderBy(sortTmp) });
    }   
  };

  const doSearch = (val) => {
    setQuerystrings({ ...querystrings, search: val, page: 1 });
  };

  const getValue = (obj, str) => {
    str = str.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
    str = str.replace(/^\./, ""); // strip a leading dot
    const a = str.split(".");
    for (let i = 0, n = a.length; i < n; ++i) {
      let k = a[i];
      if (k in obj) {
        obj = obj[k];
      } else {
        return;
      }
    }
    return obj;
  };

  return (
      <Card padding={"0"}>
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            {props.searchEnabled && (
              <div className={classes.margin}>
                {props.children}
                <Grid
                  container
                  spacing={1}
                  alignItems="flex-end"
                  style={{ width: "100%", padding: "1rem" }}
                >
                  <Grid item>
                    <Search />
                  </Grid>
                  <Grid item style={{ width: "calc(100% - 1rem - 25px" }}>
                    <TextField
                      variant="standard"
                      label="Search"
                      fullWidth={true}
                      onChange={(e) => doSearch(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </div>
            )}
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    {columns.map((item, index) => (
                      <TableCell
                        key={index}
                        className={classes.hoverable}
                        onClick={() => {
                          handleSetSorting(`${item.sortKey}`);
                        }}
                      >
                        <span>{item.display}</span>
                        {item.sortKey !== undefined && <Typography
                          className={classes.arrow}
                          variant="body2"
                          component="span"
                        >
                          {sorting[0] === item.sortKey ? (
                            sorting[1] === "desc" ? (
                              <KeyboardArrowDownIcon />
                            ) : (
                              <KeyboardArrowUpIcon />
                            )
                          ) : null}
                        </Typography>}
                        
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {response.data &&
                    response.data.map((obj) => (
                      <TableRow
                        className={classes.tableRow}
                        hover
                        key={obj.id}
                        onClick={() => props.onRowClick(obj)}
                      >
                        {columns.map((col, index) => {
                          return (
                            <TableCell key={index}>
                              {col.renderCell(obj)}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </PerfectScrollbar>
        </CardContent>
        <CardActions className={classes.actions}>
          <TablePagination
            component="div"
            count={
              response.pages?.total_records ? response.pages?.total_records : 0
            }
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            page={querystrings.page - 1}
            rowsPerPage={querystrings.count}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
          />
        </CardActions>
      </Card>
  );
};

DataTable.defaultProps = {
  searchEnabled: true,
  rollups: [],
  onRowClick: (row) => {},
};

DataTable.propTypes = {
  className: PropTypes.string,
  endpoint: PropTypes.func.isRequired,
  columns: PropTypes.array.isRequired,
  sortby: PropTypes.array.isRequired,
  searchEnabled: PropTypes.bool,
  onRowClick: PropTypes.func,
};

export default DataTable;
