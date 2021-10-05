import React from 'react'


import classNames from 'classnames'

import makeStyles from '@material-ui/core/styles/makeStyles'

import '../styles/legacy/style.scss'
import Footer from '../components/Footer'
import AppBar from '../components/AppBar'

import AdminExchangeRatesForm from '../components/AdminExchangeRatesForm'
import { useExchangeRates, useMe } from '../myHooks'
import { hasUserEnoughRights } from '../utils'
import { USER_RIGHT_TYPES } from '../constants/user'

const useStyles = makeStyles(() => ({
  circularProgressWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
}))


const AdminExchangeRates = () => {
  const classes = useStyles()
  const { data: { exchangeRates = null } = {}, refetch } = useExchangeRates({ fetchPolicy: 'network-only' })
  const { data: { me = {} } = {} } = useMe()

  const editingAllowed = hasUserEnoughRights(me.rights, USER_RIGHT_TYPES.GENERAL_ADMIN)


  return exchangeRates && (
    <>
      <div className="page-user">
        <AppBar />

        <div className="page-content">
          <div className="container">
            <div className="card content-area">
              <div className="card-innr">
                <div className="card-head">
                  <h4 className="card-title card-title-lg">Exchange rates</h4>
                </div>
                <div className={classNames('card-text', classes.tableCardBody)}>
                  <AdminExchangeRatesForm editingAllowed={editingAllowed} exchangeRates={exchangeRates} refetch={refetch} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default AdminExchangeRates
