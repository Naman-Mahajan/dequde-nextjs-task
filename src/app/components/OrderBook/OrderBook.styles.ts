import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
  },
  paper: {
    padding: 20,
    textAlign: 'center',
    color: 'inherit',
    minWidth: '100%',
    marginBottom: 20,
  },
  tableContainer: {
    minWidth: '100%',
    maxWidth: 360,
    backgroundColor: 'inherit',
  },
  grid: {
    minWidth: '50%',
  }
}));

export default useStyles;