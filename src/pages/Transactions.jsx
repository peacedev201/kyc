import React from 'react'

import classNames from 'classnames'

import makeStyles from '@material-ui/core/styles/makeStyles'
import '../styles/legacy/style.scss'
import Footer from '../components/Footer'
import AppBar from '../components/AppBar'
import TransactionList from '../components/TransactionList'
import { TRANSACTIONS } from '../queriesAndMutations'

const useStyles = makeStyles(() => ({
  tableCardBody: {
    overflowX: 'scroll',
  },
}))


const Transactions = () => {
  const classes = useStyles()
  return (
    <div className="page-user">
      <AppBar />

      <div className="page-content">
        <div className="container">
          <div className="card content-area">
            <div className="card-innr">
              <div className="card-head">
                <h4 className="card-title card-title-lg">Transactions</h4>
              </div>
              <div className={classNames('card-text', classes.tableCardBody)}>
                <TransactionList isAdmin={false} query={TRANSACTIONS} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Transactions
