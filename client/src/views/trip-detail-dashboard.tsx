import { CircularProgress, createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SnackbarComponent } from '../components/snackbar';
import myTheme from '../components/theme';
import { TripDayList } from '../components/trip-day-list';
import { TripDetailBanner } from '../components/trip-detail-banner';
import { TripEventList } from '../components/trip-event-list';
import { Messages } from '../constants/messages';
import { RootState } from '../constants/types';
import { clearAlert } from '../store/actions/alert-actions';
import { getTripDetail, getTripList } from '../store/actions/trip-actions';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    progressWrapper: {
      textAlign: 'center',
      paddingTop: theme.spacing(2),
    },
    progress: {
      margin: theme.spacing(2),
    },
    snackbar: {
      paddingTop: theme.spacing(6),
    },
    tripDetailBannerWrapper: {
      paddingBottom: theme.spacing(4),
    },
  })
);

export const TripDetailDashboard: React.FC<any> = (props: { history: any; location: any; match: any }) => {
  const classes = useStyles({});
  const dispatch = useDispatch();
  const alert = useSelector((state: RootState) => state.alert);
  const isLoading = useSelector((state: RootState) => state.trip.isLoading);
  const tripList = useSelector((state: RootState) => state.trip.tripList);
  const tripDayList = useSelector((state: RootState) => state.trip.tripDetail.trip_day);

  useEffect(() => {
    if (isEmpty(tripList)) {
      dispatch(getTripList());
    }
    dispatch(getTripDetail(props.match.params.id));
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
        <div>
          <div className={classes.tripDetailBannerWrapper}>
            <TripDetailBanner tripId={props.match.params.id} />
          </div>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <TripDayList />
            </Grid>
            <Grid item xs={10}>
              {isEmpty(tripDayList) ? (
                <SnackbarComponent
                  outerClassName={classes.snackbar}
                  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                  open={isEmpty(tripDayList)}
                  variant='info'
                  message={Messages.createTripDay.message}
                />
              ) : (
                <TripEventList />
              )}
            </Grid>
          </Grid>
        </div>
      )}
    </ThemeProvider>
  );
};
