"use client"

import styled from "styled-components";
import { makeStyles } from '@mui/styles';

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import OrderBook from "@/app/components/OrderBook/OrderBook";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: black;
  min-height: 100vh;
  padding: 20px;
  color: white;
  background-image: url('https://img.freepik.com/free-vector/gradient-stock-market-concept_23-2149166910.jpg?size=626&ext=jpg&ga=GA1.1.2082370165.1715817600&semt=ais_user');
  background-size: cover;
  background-position: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export default function Home() {
  const router = useRouter();

  const handleButtonClick = (route: string) => {
    router.push(route);
  };

  return (
    <Container>
      { <ButtonContainer>
      <Button
          variant="contained"
          color="primary"
          onClick={() => handleButtonClick("/chartjs")}
        >
          Bitfinex Candle Chart
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleButtonClick("/orderBook")}
          style={{ marginLeft: "10px" }}
        >
          Bitfinex Order Book   
        </Button>
      </ButtonContainer> }
    </Container>
  );
}

