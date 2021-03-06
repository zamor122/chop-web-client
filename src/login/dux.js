// @flow
const BASIC_AUTH_LOGIN = 'BASIC_AUTH_LOGIN';
const BASIC_AUTH_LOGIN_FAILED = 'BASIC_AUTH_LOGIN_FAILED';
const REMOVE_LOGIN_ERROR = 'REMOVE_LOGIN_ERROR';

type BasicAuthLoginType = {
  type: 'BASIC_AUTH_LOGIN',
  email: string,
  password: string,
};

type RemoveLoginErrorType = {
  type: typeof REMOVE_LOGIN_ERROR,
};

const basicAuthLogin = (email: string, password: string): BasicAuthLoginType => (
  {
    type: BASIC_AUTH_LOGIN,
    email,
    password,
  }
);

const removeLoginError = (): RemoveLoginErrorType => (
  {
    type: REMOVE_LOGIN_ERROR,
  }
);

export {
  BASIC_AUTH_LOGIN,
  BASIC_AUTH_LOGIN_FAILED,
  REMOVE_LOGIN_ERROR,
  removeLoginError,
  basicAuthLogin,
};

export type {
  BasicAuthLoginType,
};
