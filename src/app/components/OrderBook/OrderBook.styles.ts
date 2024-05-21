import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
  },
  paper: {
    padding: 20,
    textAlign: 'center',
    color: 'inherit',
    marginBottom: 20,
  },
  tableContainer: {
    width: '100%',
    minWidth: '100%',
    maxWidth: 360,
    backgroundColor: 'inherit',
  },
}));

export default useStyles;