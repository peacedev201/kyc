import React from 'react'
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { useQuery } from '@apollo/react-hooks'
import { TRANSACTION_SUM, ADMIN_KYC_SUM } from '../../queriesAndMutations'


const useStyles = makeStyles(() => ({
  header: {
    marginBottom: '20px',
    marginTop: '20px',
  },
  itemCenterSpaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}))


const AdminAmountStatistics = () => {
  const classes = useStyles()
  const { data: { transactionsSum = {} } = {} } = useQuery(TRANSACTION_SUM)
  const { data: { kycSumAmount = 0 } = 0 } = useQuery(ADMIN_KYC_SUM)


  return (
    <div className="kyc-info card">
      <div className="card-innr">
        <div className={classes.header}>
          <h6 className="card-title card-title-sm">
            AMOUNT STATISTICS
          </h6>
        </div>
        <div className={classes.itemCenterSpaceBetween}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography>
                Tokens sold (approved status): {transactionsSum.approved}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                Tokens sold (pending status): {transactionsSum.pending}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                Tokens in submitted KYC applications: {kycSumAmount}
              </Typography>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  )
}

export default AdminAmountStatistics
