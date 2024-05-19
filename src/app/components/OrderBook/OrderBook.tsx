"use client"

import React, { useMemo } from 'react';
import { Typography, Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, IconButton, Collapse } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import styled from 'styled-components';
import useOrderBook from '../../utils/orderWebSocket';


const StyledPaper = styled(Paper)`
  padding: 16px;
  text-align: center;
  color: inherit;
`;

const StyledTableContainer = styled(({ ...props }) => <TableContainer {...props} />)`
  && {
    width: 100%;
    min-widht: 100%
    max-width: 360px;
    background-color: inherit;
  }
`;

const OrderBook: React.FC = () => {
  const defaultWebSocketURL = 'wss://api-pub.bitfinex.com/ws/2';
  const orderBook = useOrderBook(process.env.WEBSOCKET_URL || defaultWebSocketURL);
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const memoizedOrderBook = useMemo(() => (
    <>
    <StyledPaper style={{ padding: '20px', marginBottom: '20px' }}>
      <Typography variant="h5" gutterBottom>
         Order Book BTC/USD
        <IconButton onClick={handleCollapse}>
          {isCollapsed ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
        </IconButton>
      </Typography>
      <Collapse in={!isCollapsed}>
        <div style={{ display: 'flex' }}>
        <StyledTableContainer component={Paper}>
            <Typography style={{textAlign: 'center'}} variant="h6" gutterBottom>Bids</Typography>
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
              {orderBook.bids.sort((a, b) => b.price - a.price).map((bid, index) => (
                  <TableRow key={index}>
                    <TableCell>{bid.count}</TableCell>
                    <TableCell>{bid.amount}</TableCell>
                    <TableCell>{bid.total.toFixed(2)}</TableCell>
                    <TableCell>{bid.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
        
        <StyledTableContainer component={Paper}  >
            <Typography style={{textAlign: 'center'}} variant="h6" gutterBottom>Asks</Typography>
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
              {orderBook.asks.sort((a, b) => a.price - b.price).map((ask, index) => (
                
                  <TableRow key={index}>
                    <TableCell>{ask.price}</TableCell>
                    <TableCell>{ask.total.toFixed(2)}</TableCell>
                    <TableCell>{ask.amount}</TableCell>
                    <TableCell>{ask.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>  
          </StyledTableContainer>
        </div>
      </Collapse>
    </StyledPaper>
    </>
  ), [orderBook, isCollapsed]);

  return memoizedOrderBook;
};

export default OrderBook;

