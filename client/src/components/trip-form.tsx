import {
  Button,
  createStyles,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  makeStyles,
  MenuItem,
  Switch,
  TextField,
  Theme,
} from '@material-ui/core';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import * as moment from 'moment';
import { Moment } from 'moment';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { timezone } from '../assets/timezone';
import { DATE_FORMAT } from '../constants/general';
import { RootState } from '../constants/types';
import { tripFormValidationSchema } from '../constants/validation';
import { Trip } from '../models/trip';
import { openTripForm, setEditMode } from '../store/actions/dashboard-actions';
import { createTrip, updateTrip } from '../store/actions/trip-actions';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menu: {
      width: '12.5rem',
    },
    buttonWrapper: {
      padding: theme.spacing(2, 0),
    },
    confirmButton: {
      marginLeft: theme.spacing(1),
    },
  })
);

interface TripFormTypes {
  id?: number;
  timezone_id: number;
  start_date: string;
  end_date: string;
  name: string;
  destination: string;
  archived: boolean;
}

export const TripForm: React.FC<any> = () => {
  const classes = useStyles({});
  const dispatch = useDispatch();
  const dashboard = useSelector((state: RootState) => state.dashboard);
  const tripDetail: Trip = useSelector((state: RootState) => state.trip.tripDetail);

  const handleDialogClose = (): void => {
    dispatch(openTripForm(false));
    dispatch(
      setEditMode({
        isEditMode: false,
        idInEdit: 0,
        component: null,
      })
    );
  };

  const tripInitialValues = {
    timezone_id: dashboard.edit.isEditMode && dashboard.edit.component === 'trip' ? tripDetail.timezone_id : 99,
    start_date:
      dashboard.edit.isEditMode && dashboard.edit.component === 'trip'
        ? tripDetail.start_date
        : moment().format(DATE_FORMAT),
    end_date:
      dashboard.edit.isEditMode && dashboard.edit.component === 'trip'
        ? tripDetail.end_date
        : moment().format(DATE_FORMAT),
    name: dashboard.edit.isEditMode && dashboard.edit.component === 'trip' ? tripDetail.name : '',
    destination: dashboard.edit.isEditMode && dashboard.edit.component === 'trip' ? tripDetail.destination : '',
    archived: dashboard.edit.isEditMode && dashboard.edit.component === 'trip' ? tripDetail.archived : false,
  };
  const InnerForm = (props: FormikProps<TripFormTypes>) => {
    const {
      values: { timezone_id, start_date, end_date, name, destination, archived },
      errors,
      touched,
      handleChange,
      isValid,
      handleSubmit,
      setFieldValue,
      setFieldTouched,
    } = props;

    const change = (name: any, e: any): void => {
      e.persist();
      handleChange(e);
      setFieldTouched(name, true, false);
    };

    const handleDateChange = (name: 'start_date' | 'end_date') => (date: Moment | null): void => {
      const dateString = moment(date).format(DATE_FORMAT);
      const startDateMoment = moment(start_date);
      const endDateMoment = moment(end_date);
      if (name === 'start_date' && startDateMoment.diff(endDateMoment, 'days') > 0) {
        setFieldValue('end_date', dateString);
      }
      setFieldValue(name, dateString);
    };

    return (
      <form onSubmit={handleSubmit}>
        <TextField
          label='Name'
          name='name'
          margin='normal'
          value={name}
          onChange={change.bind(null, 'name')}
          fullWidth
        />
        <TextField
          label='Destination'
          name='destination'
          helperText={touched.destination ? errors.destination : ''}
          error={touched.destination && Boolean(errors.destination)}
          margin='normal'
          value={destination}
          onChange={change.bind(null, 'destination')}
          required
          fullWidth
        />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              id='start_date'
              label='Start date'
              type='date'
              defaultValue={start_date}
              onChange={() => handleDateChange('start_date')}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id='end_date'
              label='End date'
              type='date'
              defaultValue={end_date}
              onChange={() => handleDateChange('end_date')}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
        <TextField
          select
          label='Timezone'
          name='timezone_id'
          margin='normal'
          value={timezone_id}
          onChange={change.bind(null, 'timezone_id')}
          required
          fullWidth
          SelectProps={{
            MenuProps: {
              className: classes.menu,
            },
          }}>
          {timezone.map((tz) => (
            <MenuItem key={tz.id} value={tz.id}>
              {tz.text}
            </MenuItem>
          ))}
        </TextField>
        {dashboard.edit.isEditMode && dashboard.edit.component === 'trip' && (
          <FormControlLabel
            control={
              <Switch name='archived' checked={archived} onChange={change.bind(null, 'archived')} value={archived} />
            }
            label='Archived'
          />
        )}
        <Grid container spacing={2} className={classes.buttonWrapper}>
          <Grid item>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button className={classes.confirmButton} disabled={!isValid} color='primary' type='submit'>
              Confirm
            </Button>
          </Grid>
        </Grid>
      </form>
    );
  };

  return (
    <div>
      <Dialog
        open={dashboard.openTripForm || (dashboard.edit.isEditMode && dashboard.edit.component === 'trip')}
        onClose={handleDialogClose}
        aria-labelledby='form-dialog-title'
        maxWidth='sm'
        fullWidth>
        <DialogTitle id='form-dialog-title'>{dashboard.edit.isEditMode ? 'Edit' : 'Create'} trip</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={tripInitialValues}
            validationSchema={tripFormValidationSchema}
            onSubmit={(values: TripFormTypes, actions: FormikHelpers<TripFormTypes>) => {
              actions.setSubmitting(false);
              if (dashboard.edit.isEditMode && dashboard.edit.component === 'trip') {
                values.id = tripDetail.id;
                dispatch(updateTrip(values));
              } else {
                dispatch(createTrip(values));
              }
              handleDialogClose();
            }}>
            {(props: FormikProps<TripFormTypes>) => <InnerForm {...props} />}
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  );
};
