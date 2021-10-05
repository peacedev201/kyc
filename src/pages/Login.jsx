import React from 'react'
import { Link, NavLink } from 'react-router-dom'

import Grid from '@material-ui/core/Grid'
import LoginForm from '../components/LoginForm'

import '../styles/legacy/style.scss'
import athGfxImage from '../media/images/ath-gfx.png'
import { usePublicSettings } from '../myHooks/useSettings'
import { getFileUrl } from '../utils'
import makeStyles from '@material-ui/core/styles/makeStyles'

const useStyles = makeStyles(() => ({
  maxWidth: {
    maxWidth: '100%',
  },
}))


const Login = () => {
  const { data: { publicSettings } = {} } = usePublicSettings()
  const { company = {} } = publicSettings || {}
  const classes = useStyles()

  return (
    <div className="page-ath-wrap">
      <div className="page-ath-content">
        <div className="page-ath-header">
          <NavLink to="/" className="page-ath-logo">
            <img
              src={publicSettings && getFileUrl(publicSettings.logo_path)}
              alt="logo"
            />
          </NavLink>
        </div>
        <div className="page-ath-form">
          <h2 className="page-ath-heading">
          Sign in
            <small>
with your {' '}
              {(company || {}).name}
              {' '}
Account
            </small>
          </h2>

          <LoginForm />

          <div className="gaps-2x" />
          <div className="gaps-2x" />
          <div className="form-note">
          Don’t have an account?
            {' '}
            <Link to="/register">
              {' '}
              <strong>Sign up here</strong>
            </Link>
          </div>
        </div>
        <div className="page-ath-footer">
          <ul className="footer-links">
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms</Link></li>
            <li>
              &copy; 2020 {' '}
              {(company || {}).name}
.
            </li>
          </ul>
        </div>
      </div>
      <div className="page-ath-gfx">
        <Grid justify="center" alignItems="center" container spacing={0}>
          <Grid className={classes.maxWidth} item md={8} lg={5}>
            {!(publicSettings || {}).login_youtube_video && (
              <img src={athGfxImage} alt="ath" />
            )}
            {(publicSettings || {}).login_youtube_video && (
              <iframe
                title="video"
                width="426"
                height="240"
                type="text/html"
                src={`${publicSettings.login_youtube_video}?autoplay=1&controls=0&disablekb=1&fs=0&iv_load_policy=3&loop=1&modestbranding=1&showinfo=0&autohide=1`}
                frameBorder="0"
              />
            )}
            <Grid container spacing={3}>
              {(publicSettings || {}).first_link_login && (
                <Grid item xs={6}>
                  <a href={`${publicSettings.first_link_login}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-block">{(publicSettings.first_text_login || '')}</a>
                </Grid>
              )}
              {(publicSettings || {}).second_link_login && (
                <Grid item xs={6}>
                  <a href={`${publicSettings.second_link_login}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-block">{(publicSettings.second_text_login || '')}</a>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default Login
