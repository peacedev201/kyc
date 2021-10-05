import React from 'react'
import AdminUsersAndKycStatistics from '../components/AdminDashboard/AdminUsersAndKycStatistics'
import AdminAmountStatistics from '../components/AdminDashboard/AdminAmountStatistics'

import '../styles/legacy/style.scss'
import AppBar from "../components/AppBar";
import classNames from "classnames";
import Footer from "../components/Footer";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles(() => ({
  pageContainer: {
    margin: '0 0 30px 0',
  },
  tokenBalance: {
    display: 'flex',
    alignItems: 'center',
  },
  tokenCard: {
    minHeight: '200px',
    height: '100%',
    margin: '0',
  },
  tokenCardInnr: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardSubtitle: {
    margin: '0 0 4px 0',
    color: '#74fffa',
  },
  callToAction: {
    padding: '25px 30px',
    '& h4': {
      margin: 0,
    },
  },
  welcomeImgWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeImg: {
    height: '100%',
    maxHeight: '200px',
  },
  downloadLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '230px',
  },
  sampleCard: {
    minHeight: '200px',
    height: '100%',
    padding: '25px 30px',
  },
}))

const AdminPanel = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar />

      <div className={classNames('page-content', classes.pageContainer)}>
        <div className="container">
          <Grid container spacing={4}>
            <Grid item lg={4} sm={6} xs={12}>
              <AdminUsersAndKycStatistics />
            </Grid>
            <Grid item lg={4} sm={6} xs={12}>
              <AdminAmountStatistics />
            </Grid>
            <Grid item md={4} className="main-content aside sidebar-right">
            </Grid>
            <Grid item lg={8} sm={8} xs={12}>
            </Grid>
          </Grid>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default AdminPanel
