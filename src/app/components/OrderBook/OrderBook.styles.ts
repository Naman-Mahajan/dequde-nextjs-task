import styled from 'styled-components';
import {  Paper, TableContainer} from '@mui/material';

const StyledPaper = styled(Paper)`
  padding: 20px;
  text-align: center;
  color: inherit;
  margin-bottom: '20px'
`;

const StyledTableContainer = styled(TableContainer)`
  && {
    width: 100%;
    min-widht: 100%
    max-width: 360px;
    background-color: inherit;
  }
`;