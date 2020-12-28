import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  Grid,
  Icon,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../constants/types';
import { Event as TripEvent } from '../models/event';
import { Trip } from '../models/trip';
import { TripDay } from '../models/trip-day';
import { openTripEventForm } from '../store/actions/dashboard-actions';
import { deleteTripDay } from '../store/actions/trip-actions';
import { EventComponent } from './event';
import myTheme from './theme';
import { TripDayInnerForm } from './trip-day-inner-form';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    eventWrapper: {
      paddingBottom: theme.spacing(2),
    },
    button: {
      margin: theme.spacing(1),
      textTransform: 'none',
      fontSize: '0.9rem',
    },
    buttonIcon: {
      marginRight: theme.spacing(1),
    },
    fab: {
      margin: theme.spacing(0.25),
    },
  })
);
const tripDayDetail = (selectedTripDayId: number, tripDetail: Trip): TripDay => {
  if (!isEmpty(tripDetail.trip_day)) {
    return tripDetail.trip_day.find((tripDay: TripDay) => tripDay.id === selectedTripDayId);
  }
  return null;
};
export const TripEventList: React.FC<any> = () => {
  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [isEditTripDay, setEditTripDay] = React.useState(false);
  const classes = useStyles({});
  const dispatch = useDispatch();
  const selectedTripDayId = useSelector((state: RootState) => state.dashboard.selectedTripDayId);
  const tripDetail = useSelector((state: RootState) => state.trip.tripDetail);
  const tripDay: TripDay = tripDayDetail(selectedTripDayId, tripDetail);

  let tripEventList: TripEvent[] = [];
  if (!isEmpty(tripDay)) {
    tripEventList = tripDay.events;
  }

  const handleEditTripDay = () => setEditTripDay(!isEditTripDay);

  const handleDeleteTripDay = () => {
    setDialogOpen(false);
    dispatch(deleteTripDay(selectedTripDayId));
  };

  const TripDayDisplay = () => (
    <>
      <Grid item>
        <Typography variant='h5' component='h3'>
          {tripDay.trip_date}
        </Typography>
      </Grid>
      {!isEmpty(tripDay.name) && (
        <Grid item>
          <Typography variant='subtitle1'>{tripDay.name}</Typography>
        </Grid>
      )}
      <Grid item>
        <Fab
          color='primary'
          size='small'
          aria-label='edit'
          className={classes.fab}
          onClick={() => setEditTripDay(true)}>
          <Icon>edit</Icon>
        </Fab>
        {isEmpty(tripDay.events) && (
          <Fab
            color='secondary'
            size='small'
            aria-label='delete'
            className={classes.fab}
            onClick={() => setDialogOpen(true)}>
            <Icon>delete</Icon>
          </Fab>
        )}
      </Grid>
    </>
  );

  return (
    <ThemeProvider theme={myTheme}>
      {!isEmpty(tripDay) && (
        <>
          <div className={classes.eventWrapper}>
            <Grid container direction='row' justify='flex-start' alignItems='center' spacing={2}>
              <Grid item>
                <Button
                  className={classes.button}
                  variant='contained'
                  color='primary'
                  size='medium'
                  onClick={() => dispatch(openTripEventForm(true))}>
                  <Icon className={classes.buttonIcon}>add</Icon> New Event
                </Button>
              </Grid>
              {isEditTripDay ? (
                <TripDayInnerForm
                  isEdit={isEditTripDay}
                  tripDayDetail={tripDay}
                  handleOpenFunction={handleEditTripDay}
                />
              ) : (
                <TripDayDisplay />
              )}
            </Grid>
          </div>
          {tripEventList.map((tripEvent: TripEvent) => (
            <EventComponent key={tripEvent.id} tripEvent={tripEvent} />
          ))}
        </>
      )}
      <Dialog
        open={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title'>Delete Event?</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            This will permanently delete the trip day <strong>{tripDay.trip_date} </strong>. Do you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteTripDay} color='primary'>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};
