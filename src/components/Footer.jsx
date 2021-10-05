import { NavLink } from 'react-router-dom'
import React from 'react'
import { usePublicSettings } from '../myHooks/useSettings'

const Footer = () => {
  const { data: { publicSettings: { company = {} } = {} } = {} } = usePublicSettings()
  return (
    <div className="footer-bar">
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-md-8">
            <ul className="footer-links">
              <li>
                <div className="copyright-text">
&copy; 2020 {' '}
                  {(company || {}).name}
.
                </div>
              </li>
              <li><NavLink to="/data-center">Data Center</NavLink></li>
              <li><NavLink to="/privacy-policy">Privacy Policy</NavLink></li>
              <li><NavLink to="/declaration-of-consent">Declaration of Consent</NavLink></li>
              <li><NavLink to="/right-of-withdrawal">Right of Withdrawal</NavLink></li>
              <li><NavLink to="/terms">Terms and Conditions</NavLink></li>
              <li>
                <div className="lang-switch relative">
                  <NavLink to="#" className="lang-switch-btn toggle-tigger">
                                        En
                  </NavLink>
                  <div className="toggle-class dropdown-content dropdown-content-up">
                    <ul className="lang-list">
                      <li><NavLink to="#">Fr</NavLink></li>
                      <li><NavLink to="#">Bn</NavLink></li>
                      <li><NavLink to="#">Lt</NavLink></li>
                    </ul>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
