import React from 'react';
import { Link, NavLink } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';

import SalesAuthTokenComponent from '../components/SalesAuthTokenComponent';

import '../styles/legacy/style.scss';
import athGfxImage from '../media/images/ath-gfx.png';
import { usePublicSettings } from '../myHooks/useSettings';
import { getFileUrl } from '../utils';

const SalesAuthTokenLogin = () => {
  const { data: { publicSettings } = {} } = usePublicSettings();
  const { company = {} } = publicSettings || {};

  return (
    <div className='page-ath-wrap'>
      <div className='page-ath-content'>
        <div className='page-ath-header'>
          <NavLink to='/' className='page-ath-logo'>
            <img
              src={publicSettings && getFileUrl(publicSettings.logo_path)}
              alt='logo'
            />
          </NavLink>
        </div>
        <div className='page-ath-form'>
          <SalesAuthTokenComponent />

          <div className='gaps-2x' />
          <div className='gaps-2x' />
        </div>
        <div className='page-ath-footer'>
          <ul className='footer-links'>
            <li>
              <Link to='/privacy-policy'>Privacy Policy</Link>
            </li>
            <li>
              <Link to='/terms'>Terms</Link>
            </li>
            <li>&copy; 2020 {(company || {}).name}.</li>
          </ul>
        </div>
      </div>
      <div className='page-ath-gfx'>
        <Grid justify='center' alignItems='center' container spacing={0}>
          <Grid item md={8} lg={5}>
            <img src={athGfxImage} alt='ath' />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default SalesAuthTokenLogin;
