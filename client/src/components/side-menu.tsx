import { Collapse, Divider, Icon, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../constants/types';
import { openTripForm, setSideMenu } from '../store/actions/dashboard-actions';
import { getTripList } from '../store/actions/trip-actions';

interface SideMenuProps {
  isDrawerOpen: boolean;
}

export const SideMenu: React.FC<any> = (props: SideMenuProps) => {
  const [expendListOpen, setExpendListOpen] = React.useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(true);
  const dispatch = useDispatch();
  const router = useSelector((state: RootState) => state.router);
  const dashboard = useSelector((state: RootState) => state.dashboard);

  const sideMenuOption = [
    { key: 'upcoming', icon: 'event', label: 'Upcoming' },
    { key: 'current', icon: 'today', label: 'Currently Traveling' },
    { key: 'past', icon: 'date_range', label: 'Past' },
  ];

  const handExpendListClick = (): void => {
    setExpendListOpen(!expendListOpen);
  };

  const handMenuChange = (menu: string): void => {
    dispatch(setSideMenu(menu));
    dispatch(getTripList());
  };

  useEffect(() => {
    if (props.isDrawerOpen !== isDrawerOpen) {
      setIsDrawerOpen(props.isDrawerOpen);
      setExpendListOpen(props.isDrawerOpen); // If drawer close, close expend list, vise versa.
    }
  });

  return (
    <div>
      <List>
        <ListItem
          button
          key='New Trip'
          onClick={() => dispatch(openTripForm(true))}
          disabled={router.location.pathname !== '/dashboard'}>
          <ListItemIcon>
            <Icon>add</Icon>
          </ListItemIcon>
          <ListItemText primary='New Trip' />
        </ListItem>
        <Divider />
        <ListItem button onClick={handExpendListClick}>
          <ListItemIcon>
            <Icon>filter_list</Icon>
          </ListItemIcon>
          <ListItemText primary='Filter by Date' />
          {expendListOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={expendListOpen} timeout='auto' unmountOnExit>
          {sideMenuOption.map(option => (
            <ListItem
              style={{ paddingLeft: '2rem' }}
              button
              disabled={router.location.pathname !== '/dashboard'}
              key={option.key}
              selected={dashboard.currentMenu === option.key}
              onClick={() => handMenuChange(option.key)}>
              <ListItemIcon>
                <Icon>{option.icon}</Icon>
              </ListItemIcon>
              <ListItemText primary={option.label} />
            </ListItem>
          ))}
        </Collapse>
      </List>
      <Divider />
      <List>
        <ListItem
          button
          disabled={router.location.pathname !== '/dashboard'}
          key='archived'
          selected={dashboard.currentMenu === 'archived'}
          onClick={() => handMenuChange('archived')}>
          <ListItemIcon>
            <Icon>all_inbox</Icon>
          </ListItemIcon>
          <ListItemText primary='Archived' />
        </ListItem>
      </List>
    </div>
  );
};
