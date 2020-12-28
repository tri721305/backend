import {
  createStyles,
  Divider,
  Icon,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Paper,
  Theme,
} from '@material-ui/core';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../constants/types';
import { TripDay } from '../models/trip-day';
import { openTripDayForm, updateSelectedTripDayId } from '../store/actions/dashboard-actions';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tripDayList: {
      backgroundColor: theme.palette.background.paper,
    },
  })
);

export const TripDayList: React.FC<any> = () => {
  const dispatch = useDispatch();
  const classes = useStyles({});
  const dashboard = useSelector((state: RootState) => state.dashboard);
  const tripDayList = useSelector((state: RootState) => state.trip.tripDetail.trip_day);

  return (
    <Paper>
      <List className={classes.tripDayList}>
        <ListItem button key='New Day' onClick={() => dispatch(openTripDayForm(true))}>
          <ListItemIcon>
            <Icon>add</Icon>
          </ListItemIcon>
          <ListItemText primary='New Day' />
        </ListItem>
        {!isEmpty && <Divider />}
        {tripDayList.map((tripDay: TripDay) => (
          <ListItem
            button
            key={tripDay.id}
            selected={dashboard.selectedTripDayId === tripDay.id}
            onClick={() => dispatch(updateSelectedTripDayId(tripDay.id))}>
            <ListItemText primary={tripDay.trip_date} />
            <ListItemIcon>
              <Icon>chevron_right</Icon>
            </ListItemIcon>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};
