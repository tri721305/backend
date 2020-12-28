import { createStyles, IconButton, makeStyles, Snackbar, SnackbarContent, Theme } from '@material-ui/core';
import amber from '@material-ui/core/colors/amber';
import green from '@material-ui/core/colors/green';
import { CheckCircle, Close, Error, Info, Warning } from '@material-ui/icons';
import clsx from 'clsx';
import * as React from 'react';

interface VariantIcon {
  [key: string]: any;
}

interface Classes {
  [key: string]: any;
}

const variantIcon: VariantIcon = {
  success: CheckCircle,
  warning: Warning,
  error: Error,
  info: Info,
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    success: {
      backgroundColor: green[600],
    },
    error: {
      backgroundColor: theme.palette.error.dark,
    },
    info: {
      backgroundColor: theme.palette.primary.dark,
    },
    warning: {
      backgroundColor: amber[700],
    },
    icon: {
      fontSize: 20,
    },
    iconVariant: {
      opacity: 0.9,
      marginRight: theme.spacing(1),
    },
    message: {
      display: 'flex',
      alignItems: 'center',
    },
  })
);

interface SnackbarContentWrapperProps {
  className?: string;
  message: string;
  onClose?: any;
  variant: 'success' | 'warning' | 'error' | 'info';
}

const SnackbarContentWrapper = (props: SnackbarContentWrapperProps) => {
  const classes: Classes = useStyles({});
  const { className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  const action = onClose && (
    <IconButton key='close' aria-label='Close' color='inherit' onClick={onClose}>
      <Close className={classes.icon} />
    </IconButton>
  );

  return (
    <SnackbarContent
      className={clsx(classes[variant], className)}
      aria-describedby='client-snackbar'
      message={
        <span id='client-snackbar' className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={action}
      {...other}
    />
  );
};

interface SnackbarComponentProps {
  outerClassName?: string;
  anchorOrigin: { vertical: 'top' | 'bottom'; horizontal: 'left' | 'center' | 'right' };
  open: boolean;
  autoHideDuration?: number;
  className?: string;
  variant: 'success' | 'warning' | 'error' | 'info';
  message: string;
  onClose?: any;
}

export const SnackbarComponent: React.FC<SnackbarComponentProps> = (props: SnackbarComponentProps) => {
  const { open, anchorOrigin, autoHideDuration, outerClassName, className, message, onClose, variant } = props;

  return (
    <Snackbar className={outerClassName} anchorOrigin={anchorOrigin} open={open} autoHideDuration={autoHideDuration}>
      <SnackbarContentWrapper className={className} variant={variant} message={message} onClose={onClose} />
    </Snackbar>
  );
};
