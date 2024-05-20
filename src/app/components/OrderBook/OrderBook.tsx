"use client";


import React, { useMemo } from 'react';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import useOrderBook from '../../utils/orderWebSocket';
import {StyledPaper, StyledTableContainer, Container} from "../OrderBook/OrderBook.styles"
import { SubscribeData } from '@/app/types/interfaces/IOrderBook';


const OrderBook: React.FC<{subscribeData: SubscribeData}> = ({subscribeData}) => {
 
const orderBook = useOrderBook(subscribeData);

  const memoizedOrderBook = useMemo(() => (
    <>
    <StyledPaper>
        <Container>
        <StyledTableContainer >
            <Typography  variant="h6" gutterBottom>Bids</Typography>
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
        
        <StyledTableContainer  >
            <Typography  variant="h6" gutterBottom>Asks</Typography>
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
        </Container>
  
    </StyledPaper>
    </>
  ), 
  [orderBook]);

  return memoizedOrderBook;
};

export default OrderBook;



          