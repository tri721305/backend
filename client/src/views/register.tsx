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
import { userRegisterValidationSchema } from '../constants/validation';
import { clearAlert } from '../store/actions/alert-actions';
import { userRegister } from '../store/actions/user-actions';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    registerButton: {
      marginTop: theme.spacing(1),
    },
    sendIcon: {
      marginLeft: theme.spacing(1),
    },
    login1RedirectButton: {
      margin: theme.spacing(2, 0, 0, 2),
    },
  })
);

interface RegisterFormTypes {
  username: string;
  email: string;
  password: string;
}

export const Register: React.FC<any> = (props: { history: History<any> }) => {
  const classes = useStyles({});
  const dispatch = useDispatch();
  const alert = useSelector((state: RootState) => state.alert);

  const RegisterButton = (isValid: boolean) => (
    <Button className={classes.registerButton} disabled={!isValid} variant='contained' color='primary' type='submit'>
      Sign Up
      <Icon className={classes.sendIcon}>send</Icon>
    </Button>
  );

  const LoginRedirectButton = (
    <Button
      className={classes.login1RedirectButton}
      variant='contained'
      color='primary'
      onClick={() => props.history.push('/login')}>
      Sign In
    </Button>
  );

  const RegisterForm = (props: FormikProps<RegisterFormTypes>) => {
    const {
      values: { username, email, password },
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
          <Grid container direction='row' justify='center' alignItems='center'>
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                label='Username'
                name='username'
                helperText={touched.username ? errors.username : ''}
                error={touched.username && Boolean(errors.username)}
                margin='normal'
                value={username}
                onChange={change.bind(null, 'username')}
                required
                fullWidth
              />
            </Grid>
          </Grid>
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
            {RegisterButton(isValid)}
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
            {LoginRedirectButton}
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
            <h3 className='user-form-title'>Sign Up</h3>
          </div>
          <Formik
            initialValues={{
              username: '',
              email: '',
              password: '',
            }}
            validationSchema={userRegisterValidationSchema}
            onSubmit={(values: RegisterFormTypes, actions: FormikHelpers<RegisterFormTypes>) => {
              actions.setSubmitting(false);
              dispatch(userRegister(values));
            }}>
            {(props: FormikProps<RegisterFormTypes>) => <RegisterForm {...props} />}
          </Formik>
        </div>
      </div>
    </ThemeProvider>
  );
};
