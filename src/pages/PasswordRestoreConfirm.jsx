import React from 'react'
import { Link, NavLink } from 'react-router-dom'

import '../styles/legacy/style.scss'
import athGfxImage from '../media/images/ath-gfx.png'

import PasswordRestoreConfirmForm from '../components/PasswordRestoreConfirmForm'
import { usePublicSettings } from '../myHooks/useSettings'
import { getFileUrl } from '../utils'

const PasswordReset = () => {
  const { data: { publicSettings } = {} } = usePublicSettings()
  const { company = {} } = publicSettings || {}
  return (
    <div className="page-ath">
      <div className="page-ath-wrap">
        <div className="page-ath-content">
          <div className="page-ath-header">
            <NavLink to="/" className="page-ath-logo"><img src={publicSettings && getFileUrl(publicSettings.logo_path)} alt="logo" /></NavLink>
          </div>
          <div className="page-ath-form">
            <PasswordRestoreConfirmForm />
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
          <div className="w-100 d-flex justify-content-center">
            <div className="col-md-8 col-xl-5">
              <img src={athGfxImage} alt="ath" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PasswordReset
