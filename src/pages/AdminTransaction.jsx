import React from 'react'
import PropTypes from 'prop-types'

import '../styles/legacy/style.scss'
import classNames from 'classnames'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'
import { NavLink } from 'react-router-dom'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Footer from '../components/Footer'
import AppBar from '../components/AppBar'
import Transaction from '../components/Transaction'

const useStyles = makeStyles(() => ({
  cardHead: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonBack: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 'bold',
    padding: '5px 8px 5px 0px',
    minWidth: '100px',
    borderRadius: '4px',
    margin: '8px',
    textTransform: 'capitalize',
    backgroundColor: '#007bff',
    '&:hover': {
      backgroundColor: '#253992',
    },
    '&>span': {
      color: '#fff',
      margin: 0,
      padding: 0,
    },
    '& svg': {
      color: '#fff',
      margin: '0',
    },
  },
}))

const AdminTransaction = ({ match }) => {
  const classes = useStyles()

  return (
    <div className="page-user">
      <AppBar />

      <div className="page-content">
        <div className="container">
          <div className="card content-area">
            <div className="card-innr">
              <div className={classNames('card-head', classes.cardHead)}>
                <h4 className="card-title card-title-lg">Transaction</h4>
                <NavLink to="/admin/transactions" className={classes.buttonBack}>
                  <NavigateBeforeIcon />
                  <span>Back</span>
                </NavLink>
              </div>
              <div className="card-text">
                <Transaction isAdmin id={match.params.transactionId} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

AdminTransaction.propTypes = {
  match: PropTypes.object.isRequired,
}

export default AdminTransaction
