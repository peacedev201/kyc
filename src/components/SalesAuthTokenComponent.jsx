import React, { useEffect } from 'react';
import { Redirect, withRouter } from 'react-router-dom';

import { compose } from 'recompose';
import { useMutation } from '@apollo/react-hooks';
import queryString from 'query-string';

import '../styles/legacy/style.scss';
import CircularProgress from '@material-ui/core/CircularProgress';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { SALES_AUTH_TOKEN } from '../queriesAndMutations';

const useStyles = makeStyles(() => ({
  circularProgressWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

const SalesAuthTokenComponent = ({ history }) => {
  const classes = useStyles();
  const [authToken, { data, loading, error }] = useMutation(
    SALES_AUTH_TOKEN
  );

  const query = queryString.parse(history.location.search);
  const queryAuthToken = (query || {}).auth_token;

  useEffect(() => {
    authToken({ variables: { auth_token: queryAuthToken } });
  }, [authToken, queryAuthToken]);

  if (data) {
    console.log(data)
    localStorage.removeItem('jwt');
    localStorage.setItem('jwt', data.salesAuthTokenLogin.accessToken);
    return <Redirect to={'/'} />;
  }

  if (error) {
    return (
      <div className='page-ath-text'>
        <div className='alert alert-warning'>Login error</div>
        <div className='gaps-0-5x' />
      </div>
    );
  }

  return (
    <div className='page-ath-text'>
      {loading && (
        <>
          <div className='alert alert-info'>Login in progress</div>
          <div className='gaps-0-5x' />
        </>
      )}
      <div className={classes.circularProgressWrapper}>
        <CircularProgress />
      </div>
    </div>
  );
};

export default compose(withRouter)(SalesAuthTokenComponent);
