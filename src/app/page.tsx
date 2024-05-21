"use client"

import { makeStyles} from '@mui/styles';
import { Button, Container, Grid } from '@mui/material';
import { useRouter } from 'next/navigation';
import { Routes } from './constants/routes';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    minWidth: '100vw',
    padding: 20,
    color: 'white',
    backgroundImage: 'url("https://img.freepik.com/free-vector/gradient-stock-market-concept_23-2149166910.jpg?size=626&ext=jpg&ga=GA1.1.2082370165.1715817600&semt=ais_user")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
}));

const Home = () => {
  const classes = useStyles();
  const router = useRouter();

  return (
    <Container className={classes.container}>
      <Grid container spacing={2} className={classes.buttonContainer}>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push(Routes.BitfinexCandleChart)}
          >
            Bitfinex Candle Chart
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => router.push(Routes.BitfinexOrderBook)}
          >
            Bitfinex Order Book
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;

