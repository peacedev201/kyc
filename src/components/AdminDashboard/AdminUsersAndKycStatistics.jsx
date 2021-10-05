import React, {useState} from 'react'
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from '@material-ui/core/Typography'
import { useQuery } from '@apollo/react-hooks'
import { ADMIN_USER_INACTIVE_COUNT, ADMIN_KYC_COUNT } from '../../queriesAndMutations'


const useStyles = makeStyles(() => ({
  itemCenterSpaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  nav: {
    display: 'flex',
    'padding-left': 0,
    'list-style': 'none',
  },
  navLink: {
    display: 'block',
    cursor: 'pointer',
  },
}))

const CONST_TYPE_TOTAL = {
  USERS: 'USERS',
  KYC: 'KYC',
}

const CONST_TYPE_TOTAL_LABEL = {
  USERS: 'All active users (referal and organic)',
  KYC: 'Total submitted KYC',
}

const AdminUsersAndKycStatistics = () => {
  const classes = useStyles()
  const { data: { userInactiveCount = 0 } = 0 } = useQuery(ADMIN_USER_INACTIVE_COUNT)
  const { data: { kycCount = 0 } = 0 } = useQuery(ADMIN_KYC_COUNT)
  const [typeTotal, setTypeTotal] = useState(CONST_TYPE_TOTAL.USERS)

  const changeTypeTotal = (newType) => {
    setTypeTotal(newType)
  }

  return (
    <div className="kyc-info card">
      <div className="card-innr">
        <div className={classes.itemCenterSpaceBetween}>
          <h6 className="card-title card-title-sm">
            { CONST_TYPE_TOTAL_LABEL[typeTotal] }
          </h6>
          <ul className={`${classes.nav} nav-tabs nav-tabs-line`} role="tablist">
            <li className="nav-item">
              <p className={`${classes.navLink} nav-link ${typeTotal === CONST_TYPE_TOTAL.USERS ? 'active' : ''}`} onClick={() => changeTypeTotal(CONST_TYPE_TOTAL.USERS)}>{CONST_TYPE_TOTAL.USERS}</p>
            </li>
            <li className="nav-item">
              <p className={`${classes.navLink} nav-link ${typeTotal === CONST_TYPE_TOTAL.KYC ? 'active' : ''}`} onClick={() => changeTypeTotal(CONST_TYPE_TOTAL.KYC)}>{CONST_TYPE_TOTAL.KYC}</p>
            </li>
          </ul>
        </div>
        <div>
          <Typography>
            {typeTotal === CONST_TYPE_TOTAL.USERS ? userInactiveCount : kycCount}
          </Typography>
        </div>
      </div>
    </div>
  )
}

export default AdminUsersAndKycStatistics
