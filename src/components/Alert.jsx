import React from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames'

import makeStyles from '@material-ui/core/styles/makeStyles'

import '../styles/legacy/style.scss'

const useStyles = makeStyles(() => ({
  modal: {
    position: 'fixed',
    right: '20px',
    zIndex: '9999',
    maxWidth: '30%'
  }
}))

const Alert = ({ classAlert, children }) => {
  const classes = useStyles()


  return (
    <div className={classes.modal}>
      <div className={classNames('alert', classAlert)}>
        { children }
      </div>
    </div>
  )
}

Alert.propTypes = {
  classAlert: PropTypes.string.isRequired,
}

export default Alert
