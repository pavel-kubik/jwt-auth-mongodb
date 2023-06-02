import React from 'react';
import { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { clearUserDataInLocalStorage, signIn, signUp } from '../util/auth';

const AuthForm = ({
  loggedUser,
  setLoggedUser,
  preSignIn = null,
  preSignUp = null,
  postSignIn = null,
  postSignUp = null,
  t = (key: string, replaceValues = {}) => key,
}) => {
  const [authMode, setAuthMode] = useState('signin');
  const [signInError, setSignInError] = useState(null);
  const [signUpError, setSignUpError] = useState(null);

  const changeAuthMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
  };

  const isSignUp = () => {
    return authMode === 'signup';
  };

  const isSignIn = () => {
    return authMode === 'signin';
  };

  const signInHandler = async (values) => {
    if (preSignIn) {
      preSignIn();
    }
    const userData = await signIn(
      values.email,
      values.password,
      setLoggedUser,
      setSignInError,
      t
    );
    values.password = '';
    if (postSignIn) {
      postSignIn(userData);
    }
  };

  const signUpHandler = async (values) => {
    if (preSignUp) {
      preSignUp();
    }
    const userData = await signUp(
      values.username,
      values.email,
      values.password,
      setLoggedUser,
      setSignUpError,
      t
    );
    values.password = '';
    if (postSignUp) {
      postSignUp(userData);
    }
  };

  const signOut = async () => {
    setLoggedUser(null);
    clearUserDataInLocalStorage();
  };

  const validationSignIn = Yup.object().shape({
    email: Yup.string().email().required(t('components.authForm.required')),
    password: Yup.string().required(t('components.authForm.required')),
  });

  const validationSignUp = Yup.object().shape({
    username: Yup.string().required(t('components.authForm.required')),
    email: Yup.string().email().required(t('components.authForm.required')),
    password: Yup.string().required(t('components.authForm.required')),
  });

  const signInFormChanged = () => {
    setSignInError(null);
  };

  const signUpFormChanged = () => {
    setSignUpError(null);
  };

  return (
    <div className="auth">
      <div className="login-sign-up-form">
        {loggedUser && (
          <>
            <div>
              {t('components.authForm.welcome', {
                username: loggedUser.username,
              })}
            </div>
            <div className="button" onClick={signOut}>
              {t('global.signOut')}
            </div>
          </>
        )}
        {!loggedUser && (
          <>
            <ul className="tab-group">
              <li className="tab active">
                <div
                  onClick={changeAuthMode}
                  className={isSignIn() ? 'active' : ''}
                >
                  {t('components.user.login.title')}
                </div>
              </li>
              <li className="tab">
                <div
                  onClick={changeAuthMode}
                  className={isSignUp() ? 'active' : ''}
                >
                  {t('components.user.register.title')}
                </div>
              </li>
            </ul>
            {isSignIn() && (
              <div className="auth-form">
                <Formik
                  initialValues={{
                    email: '',
                    password: '',
                  }}
                  validateOnChange={false}
                  validationSchema={validationSignIn}
                  onSubmit={signInHandler}
                  onChange={signInFormChanged}
                >
                  {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    touched,
                    values,
                    errors,
                  }) => (
                    <fieldset>
                      <div className="field-wrap">
                        <label>{t('components.user.login.email')}</label>
                        <input
                          type="text"
                          onBlur={handleBlur('email')}
                          value={values.email}
                          autoComplete="off"
                          onChange={handleChange('email')}
                        />
                      </div>
                      {errors.email && touched.email ? (
                        <div className="field-error">
                          {errors.email as string}
                        </div>
                      ) : null}
                      <div className="field-wrap">
                        <label>{t('components.user.login.password')}</label>
                        <input
                          type="password"
                          onBlur={handleBlur('password')}
                          value={values.password}
                          autoComplete="off"
                          onChange={handleChange('password')}
                        />
                      </div>
                      {errors.password && touched.password ? (
                        <div className="field-error">
                          {errors.password as string}
                        </div>
                      ) : null}{' '}
                      <div className="field-wrap">
                        {signInError && (
                          <div className="field-error">{signInError}</div>
                        )}
                      </div>
                      <div
                        className="button"
                        onClick={() => handleSubmit(values)} //can't pass function directly because of TS
                      >
                        {t('components.user.login.submit')}
                      </div>
                    </fieldset>
                  )}
                </Formik>
              </div>
            )}
            {isSignUp() && (
              <div className="auth-form">
                <Formik
                  initialValues={{
                    username: '',
                    email: '',
                    password: '',
                  }}
                  validateOnChange={false}
                  validationSchema={validationSignUp}
                  onSubmit={signUpHandler}
                  onChange={signUpFormChanged}
                >
                  {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    touched,
                    values,
                    errors,
                  }) => (
                    <fieldset>
                      <div className="field-wrap">
                        <label>{t('components.user.register.username')}</label>
                        <input
                          type="text"
                          onBlur={handleBlur('username')}
                          value={values.username}
                          autoComplete="off"
                          onChange={handleChange('username')}
                        />
                      </div>
                      {errors.username && touched.username ? (
                        <div className="field-error">
                          {errors.username as string}
                        </div>
                      ) : null}
                      <div className="field-wrap">
                        <label>{t('components.user.register.email')}</label>
                        <input
                          type="text"
                          onBlur={handleBlur('email')}
                          value={values.email}
                          autoComplete="off"
                          onChange={handleChange('email')}
                        />
                      </div>
                      {errors.email && touched.email ? (
                        <div className="field-error">
                          {errors.email as string}
                        </div>
                      ) : null}
                      <div className="field-wrap">
                        <label>{t('components.user.register.password')}</label>
                        <input
                          type="password"
                          onBlur={handleBlur('password')}
                          value={values.password}
                          autoComplete="off"
                          onChange={handleChange('password')}
                        />
                      </div>
                      {errors.password && touched.password ? (
                        <div className="field-error">
                          {errors.password as string}
                        </div>
                      ) : null}
                      <div className="field-wrap">
                        {signUpError && (
                          <div className="field-error">{signUpError}</div>
                        )}
                      </div>
                      <div
                        className="button"
                        onClick={() => handleSubmit(values)} //can't pass function directly because of TS
                      >
                        {t('components.user.register.submit')}
                      </div>
                    </fieldset>
                  )}
                </Formik>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
