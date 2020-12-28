import {
  CircularProgress,
  createStyles,
  Link,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Theme,
} from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { History } from 'history';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../constants/types';
import { Trip } from '../models/trip';
import { clearAlert } from '../store/actions/alert-actions';
import { getTripList } from '../store/actions/trip-actions';
import { SnackbarComponent } from './snackbar';
import myTheme from './theme';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      marginTop: theme.spacing(2),
      overflowX: 'auto',
    },
    table: {
      minWidth: '40rem',
    },
    progressWrapper: {
      textAlign: 'center',
      paddingTop: theme.spacing(1),
    },
    progress: {
      margin: theme.spacing(1),
    },
    snackbar: {
      paddingTop: theme.spacing(3),
    },
  })
);

export const TripList: React.FC<any> = ({ history }: { history: History<any> }) => {
  const dispatch = useDispatch();
  const classes = useStyles({});
  const alert = useSelector((state: RootState) => state.alert);
  const isLoading = useSelector((state: RootState) => state.trip.isLoading);
  const tripList = useSelector((state: RootState) => state.trip.tripList);

  useEffect(() => {
    dispatch(getTripList());
  }, []);

  return (
    <ThemeProvider theme={myTheme}>
      {isLoading ? (
        <div className={classes.progressWrapper}>
          <CircularProgress className={classes.progress} color='secondary' />
        </div>
      ) : alert.type !== null && !isEmpty(alert.message) ? (
        <SnackbarComponent
          outerClassName={classes.snackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={alert.type !== null && !isEmpty(alert.message)}
          variant={alert.type}
          message={alert.message}
          onClose={() => dispatch(clearAlert())}
        />
      ) : (
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell align='center'>Trip Name</TableCell>
                <TableCell align='center'>Date</TableCell>
                <TableCell align='center'>Destination</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {tripList.map((trip: Trip) => (
                <TableRow key={trip.id}>
                  <TableCell align='center'>{trip.name}</TableCell>
                  <TableCell align='center'>{`${trip.start_date} ~ ${trip.end_date}`}</TableCell>
                  <TableCell align='center'>{trip.destination}</TableCell>
                  <TableCell align='center'>
                    <Link component='button' variant='body2' onClick={() => history.push(`/dashboard/trip/${trip.id}`)}>
                      Detail
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </ThemeProvider>
  );
};
