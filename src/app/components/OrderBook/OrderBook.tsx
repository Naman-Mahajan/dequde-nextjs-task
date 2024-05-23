"use client";

import React, { useMemo } from 'react';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell, Paper, Grid } from '@mui/material';
import useOrderBook from '../../utils/orderWebSocket';
import useStyles from "../OrderBook/OrderBook.styles"
import { SubscribeData } from '@/app/types/interfaces/IOrderBook';
import { defaultWebSocketURL } from '@/app/utils/webSocketUrl';

const OrderBook: React.FC<{ subscribeData: SubscribeData }> = ({ subscribeData }) => {

  const orderBook = useOrderBook(subscribeData, process.env.WEBSOCKET_API_URL || defaultWebSocketURL);
  const classes = useStyles();
  const bidsPaper = (
    <Paper className={classes.tableContainer}>
      <Typography variant="h6" gutterBottom>Bids</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Count</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orderBook.bids.map((bid, index) => (
            <TableRow key={index}>
              <TableCell>{bid.count}</TableCell>
              <TableCell>{bid.amount}</TableCell>
              <TableCell>{bid.total.toFixed(2)}</TableCell>
              <TableCell>{bid.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
  const asksPaper = (
    <Paper className={classes.tableContainer}>
      <Typography variant="h6" gutterBottom>Asks</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Price</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Count</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orderBook.asks.map((ask, index) => (
            <TableRow key={index}>
              <TableCell>{ask.price}</TableCell>
              <TableCell>{ask.total.toFixed(2)}</TableCell>
              <TableCell>{ask.amount}</TableCell>
              <TableCell>{ask.count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );


  const memoizedOrderBook = useMemo(() => (
    <Paper className={classes.paper}>
      <Grid container spacing={2}>
        <Grid item className={classes.grid}>
          {bidsPaper}
        </Grid>
        <Grid item className={classes.grid}>
          {asksPaper}
        </Grid>
      </Grid>
    </Paper>  
  ), [orderBook, bidsPaper, asksPaper]);

  return memoizedOrderBook;
};

export default OrderBook;
