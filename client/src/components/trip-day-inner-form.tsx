import { Button, createStyles, Fab, Grid, Icon, makeStyles, TextField, Theme } from '@material-ui/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { useEffect } from 'react';
import * as React from 'react';
import { RootState } from '../constants/types';
import { TripDay } from '../models/trip-day';
import { updateTripDay } from '../store/actions/trip-actions';
import { useDispatch, useSelector } from 'react-redux';

interface TripDayInnerFormProps {
  isEdit: boolean;
  tripDayDetail: TripDay;
  handleOpenFunction: any;
}

interface TripDayFormState {
  id: number;
  trip_id: number;
  name: string;
  trip_date: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonWrapper: {
      padding: theme.spacing(2, 0),
    },
    confirmButton: {
      marginLeft: theme.spacing(1),
    },
    fab: {
      margin: theme.spacing(0.25),
    },
  })
);

export const TripDayInnerForm: React.FC<TripDayInnerFormProps> = (props: TripDayInnerFormProps) => {
  const { isEdit, tripDayDetail, handleOpenFunction } = props;
  const [tripDayFormState, setTripDayFormState] = React.useState<TripDayFormState>({
    id: 0,
    trip_id: 0,
    trip_date: '',
    name: '',
  });
  const classes = useStyles({});
  const dispatch = useDispatch();
  const tripDetail = useSelector((state: RootState) => state.trip.tripDetail);

  useEffect(() => {
    if (isEdit && tripDayDetail) {
      setTripDayFormState({
        id: tripDayDetail.id,
        trip_id: tripDayDetail.trip_id,
        name: tripDayDetail.name,
        trip_date: tripDayDetail.trip_date,
      });
    }
  }, [isEdit, tripDayDetail]);

  const handleChange = (name: string) => (event: any) => {
    setTripDayFormState({ ...tripDayFormState, [name]: event.target.value });
  };

  const handleDateChange = (name: string) => (date: Moment | null) => {
    const dateString = moment(date).format('YYYY-MM-DD');
    setTripDayFormState({ ...tripDayFormState, [name]: dateString });
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    dispatch(updateTripDay(tripDayFormState));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2} className={classes.buttonWrapper} alignItems='flex-end'>
        <Grid item>
          <TextField
            id='start_date'
            label='Trip date'
            type='date'
            defaultValue={tripDayFormState.trip_date}
            onChange={() => handleDateChange('trip_date')}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
        </Grid>
        <Grid item>
          <TextField
            label='Name'
            name='name'
            margin='normal'
            value={tripDayFormState.name}
            onChange={handleChange('name')}
            fullWidth
          />
        </Grid>
        <Grid item>
          <Fab size='small' aria-label='edit' className={classes.fab} onClick={handleOpenFunction}>
            <Icon>close</Icon>
          </Fab>
          <Fab color='primary' size='small' aria-label='edit' className={classes.fab} type='submit'>
            <Icon>done</Icon>
          </Fab>
        </Grid>
      </Grid>
    </form>
  );
};
