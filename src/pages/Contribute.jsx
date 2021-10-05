import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import makeStyles from '@material-ui/core/styles/makeStyles'
import classNames from 'classnames'
import AppBar from '../components/AppBar'
import Footer from '../components/Footer'
import ContributeForm from '../components/contribute/ContributeForm'
import TokenBalance from '../components/TokenBalance'
import WalletAddress from '../components/profile/WalletAddress'

const useStyles = makeStyles(() => ({
  dialog: {
    '& .MuiDialog-paper': {
      padding: '10px 0 26px 0',
    },
  },
  addWalletIcon: {
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: '40px',
    fontSize: '20px',
  },
}))

const Contribute = () => {
  const classes = useStyles()
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <Dialog className={classes.dialog} open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
        Wallet Address
        </DialogTitle>
        <DialogContent>
          <WalletAddress />
        </DialogContent>
      </Dialog>

      <div className="page-user">
        <AppBar />
        <div className="page-content">
          <div className="container">
            <Grid container spacing={4}>
              <Grid item md={8} className="main-content">

                <ContributeForm />

              </Grid>

              <Grid item md={4} className="main-content aside sidebar-right">
                <div onClick={() => setDialogOpen(true)} className="d-none d-lg-block">
                  <div data-toggle="modal" data-target="#add-wallet" className="btn btn-danger btn-xl btn-between w-100">
Add your wallet address before purchase
                    <ArrowForwardIcon className={classNames(classes.addWalletIcon)} />
                    {' '}
                  </div>
                  <div className="gaps-3x" />
                </div>


                <TokenBalance />

              </Grid>
            </Grid>

          </div>

        </div>


        <Footer />
      </div>
    </>
  )
}


export default Contribute
