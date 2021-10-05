import React from 'react'
import makeStyles from "@material-ui/core/styles/makeStyles";


const useStyles = makeStyles(() => ({
  cursorPointer: {
    cursor: 'pointer',
  },
  itemCenterSpaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
}))

const AdminRegistrationStatistics = () => {
  const classes = useStyles()

  return (
    <div className="kyc-info card">
      <div className="card-innr">
        <div className={classes.itemCenterSpaceBetween}>
          <h6 className="card-title card-title-sm">
            Registration Statistics
          </h6>
        </div>
      </div>
    </div>
  )
}

export default AdminRegistrationStatistics
