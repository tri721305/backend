import { createStyles, Fab, Grid, Icon, IconButton, makeStyles, Paper, Theme, Typography } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { isEmpty } from 'lodash';
import * as moment from 'moment';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import { RootState } from '../constants/types';
import { openTripForm, setEditMode } from '../store/actions/dashboard-actions';
import myTheme from './theme';

interface TripDetailBannerProps {
  tripId: number;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1.5, 1),
    },
    fab: {
      margin: theme.spacing(0.25),
    },
  })
);

export const TripDetailBanner: React.FC<TripDetailBannerProps> = (props: TripDetailBannerProps) => {
  const dispatch = useDispatch();
  const { tripId } = props;

  const classes = useStyles({});
  const tripDetail = useSelector((state: RootState) => state.trip.tripDetail);
  const startDateMoment = moment(tripDetail.start_date);
  const endDateMoment = moment(tripDetail.end_date);
  const dateDiff = endDateMoment.diff(startDateMoment, 'days');

  const handleEditTripForm = () => {
    dispatch(openTripForm(true));
    dispatch(
      setEditMode({
        isEditMode: true,
        idInEdit: tripId,
        component: 'trip',
      })
    );
  };
  const GoBackButton = withRouter(({ history }) => (
    <IconButton onClick={() => history.goBack()}>
      <Icon>chevron_left</Icon>
    </IconButton>
  ));

  return (
    <ThemeProvider theme={myTheme}>
      <Paper className={classes.root}>
        <Grid container alignItems='center' spacing={2}>
          <Grid item>
            <GoBackButton />
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item container direction='column' spacing={2}>
              <Typography variant='h5' component='h3'>
                {tripDetail.destination}
              </Typography>
              <Typography variant='subtitle1'>
                {tripDetail.start_date} ~ {tripDetail.end_date} ({dateDiff} days)
              </Typography>
              {!isEmpty(tripDetail.name) && <Typography variant='body2'>{tripDetail.name}</Typography>}
            </Grid>
          </Grid>
          <Grid item>
            <Fab color='primary' size='small' aria-label='edit' className={classes.fab} onClick={handleEditTripForm}>
              <Icon>edit</Icon>
            </Fab>
          </Grid>
        </Grid>
      </Paper>
    </ThemeProvider>
  );
};
