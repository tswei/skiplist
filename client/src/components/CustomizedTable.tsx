// using material ui for table to quickly mock feature

// https://material-ui.com/demos/tables/
// https://github.com/mui-org/material-ui/blob/master/docs/src/pages/demos/tables/CustomizedTable.js

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const CustomTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);
  
const styles = (theme: any) => ({
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    row: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
});
  
function CustomizedTable(props: any) {
    const { classes, tableData } = props;
      
    return (
        <Paper className={classes.root}>
        <Table className={classes.table}>
            <TableHead>
            <TableRow>
                <CustomTableCell>Type</CustomTableCell>
                <CustomTableCell>Age</CustomTableCell>
                <CustomTableCell align="right">Qty</CustomTableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {tableData.map((row: any, idx: number) => (
                <TableRow className={classes.row} key={idx}>
                <CustomTableCell component="th" scope="row">
                    {row.type}
                </CustomTableCell>
                <CustomTableCell>{row.age}</CustomTableCell>
                <CustomTableCell align="right">{row.qty}</CustomTableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </Paper>
    );
}
  
CustomizedTable.propTypes = {
    classes: PropTypes.object.isRequired,
    tableData: PropTypes.array.isRequired,
};
  
export default withStyles(styles as any)(CustomizedTable);
