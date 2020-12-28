import * as Yup from 'yup';
import { Messages } from './messages';

const USERNAME_MAX_LENGTH = 15;
const USERNAME_REGEX = /^([a-zA-Z0-9._-]+)$/;
const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;

export const userLoginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email(Messages.email.invalid)
    .required(Messages.email.required),
  password: Yup.string()
    .trim()
    .matches(PASSWORD_REGEX, Messages.password.invalid)
    .min(6, Messages.password.invalid)
    .required(Messages.password.required),
});

export const userRegisterValidationSchema = Yup.object().shape({
  username: Yup.string()
    .trim()
    .matches(USERNAME_REGEX, Messages.userName.invalid)
    .min(4, Messages.userName.invalid)
    .max(USERNAME_MAX_LENGTH, Messages.userName.maxlength)
    .required(Messages.userName.required),
  email: Yup.string()
    .trim()
    .email(Messages.email.invalid)
    .required(Messages.email.required),
  password: Yup.string()
    .trim()
    .matches(PASSWORD_REGEX, Messages.password.invalid)
    .min(6, Messages.password.invalid)
    .required(Messages.password.required),
});

export const tripFormValidationSchema = Yup.object().shape({
  destination: Yup.string()
    .trim()
    .required(Messages.destination.required),
});

export const eventFormValidationSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .required(Messages.title.required),
});
