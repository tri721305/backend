import { Button, createStyles, Grid, Icon, makeStyles, TextField, Theme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { History } from 'history';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SnackbarComponent } from '../components/snackbar';
import myTheme from '../components/theme';
import { RootState } from '../constants/types';
import { userLoginValidationSchema } from '../constants/validation';
import { clearAlert } from '../store/actions/alert-actions';
import { userLogin } from '../store/actions/user-actions';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loginButton: {
      marginTop: theme.spacing(1),
    },
    sendIcon: {
      marginLeft: theme.spacing(1),
    },
    registerRedirectButton: {
      margin: theme.spacing(2, 0, 0, 2),
    },
  })
);

interface LoginFormTypes {
  email: string;
  password: string;
}

export const Login: React.FC<any> = (props: { history: History<any> }) => {
  const classes = useStyles({});
  const dispatch = useDispatch();
  const alert = useSelector((state: RootState) => state.alert);

  const LoginButton = (isValid: boolean) => (
    <Button className={classes.loginButton} disabled={!isValid} variant='contained' color='primary' type='submit'>
      Sign In
      <Icon className={classes.sendIcon}>send</Icon>
    </Button>
  );

  const RegisterRedirectButton = (
    <Button
      className={classes.registerRedirectButton}
      variant='contained'
      color='primary'
      onClick={() => props.history.push('/register')}>
      Sign Up
    </Button>
  );

  const LoginForm = (props: FormikProps<LoginFormTypes>) => {
    const {
      values: { email, password },
      errors,
      touched,
      handleChange,
      isValid,
      handleSubmit,
      setFieldTouched,
    } = props;

    const change = (name: any, e: any) => {
      e.persist();
      handleChange(e);
      setFieldTouched(name, true, false);
    };

    return (
      <form method='POST' onSubmit={handleSubmit}>
        <Grid container direction='row' justify='center' alignItems='center'>
          <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
            <TextField
              label='Email'
              name='email'
              helperText={touched.email ? errors.email : ''}
              error={touched.email && Boolean(errors.email)}
              margin='normal'
              value={email}
              onChange={change.bind(null, 'email')}
              required
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid container direction='row' justify='center' alignItems='center'>
          <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
            <TextField
              label='Password'
              name='password'
              type='password'
              helperText={touched.password ? errors.password : ''}
              error={touched.password && Boolean(errors.password)}
              margin='normal'
              value={password}
              onChange={change.bind(null, 'password')}
              required
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid container direction='row' justify='center' alignItems='center'>
          <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
            {LoginButton(isValid)}
          </Grid>
        </Grid>
      </form>
    );
  };

  return (
    <ThemeProvider theme={myTheme}>
      <div className='container'>
        <Grid container direction='row' justify='center' alignItems='center'>
          <Grid item xs={12}>
            {RegisterRedirectButton}
          </Grid>
        </Grid>
        {alert.type !== null && !isEmpty(alert.message) && (
          <SnackbarComponent
            open={alert.type !== null && !isEmpty(alert.message)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            message={alert.message}
            variant={alert.type}
            onClose={() => dispatch(clearAlert())}
          />
        )}
        <div className='user-form'>
          <div className='user-form-title-container'>
            <h3 className='user-form-title'>Sign In</h3>
          </div>
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={userLoginValidationSchema}
            onSubmit={(values: LoginFormTypes, actions: FormikHelpers<LoginFormTypes>) => {
              actions.setSubmitting(false);
              dispatch(userLogin(values));
            }}>
            {(props: FormikProps<LoginFormTypes>) => <LoginForm {...props} />}
          </Formik>
        </div>
      </div>
    </ThemeProvider>
  );
};
