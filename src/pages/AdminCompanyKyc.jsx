import React, { useState } from 'react'

import classNames from 'classnames'

import makeStyles from '@material-ui/core/styles/makeStyles'

import '../styles/legacy/style.scss'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import Footer from '../components/Footer'
import AppBar from '../components/AppBar'

import AdminKycList from '../components/AdminKycList'

import { CUSTOMER_TYPES } from '../constants/customer'
import AdminExportKyc from '../components/AdminCsvDialogs/AdminExportKyc'
import { hasUserEnoughRights } from '../utils/me'
import { useMe } from '../myHooks'
import { USER_RIGHT_TYPES } from '../constants/user'

const useStyles = makeStyles(() => ({
  tableCardBody: {
    overflowX: 'scroll',
  },
}))

const AdminCompanyKyc = () => {
  const classes = useStyles()
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [isPythagoras, setIsPythagoras] = useState(false)
  const [isBank, setIsBank] = useState(false)
  const { data: { me } = {} } = useMe()

  return (
    <div className="page-user">
      <Dialog open={isDialogOpen} onClose={() => { setDialogOpen(false) }}>
        <DialogContent>
          <AdminExportKyc isPythagoras={isPythagoras} isBank={isBank} type={CUSTOMER_TYPES.COMPANY} onClose={() => { setDialogOpen(false) }} />
        </DialogContent>
      </Dialog>
      <AppBar />

      <div className="page-content">
        <div className="container">
          { hasUserEnoughRights(me.rights, USER_RIGHT_TYPES.COMPLIANCE_OFFICER) && (
          <Button
            onClick={() => {
              setIsPythagoras(false)
              setIsBank(false)
              setDialogOpen(true)
            }}
            color="primary"
            type="submit"
          >
Download as csv
          </Button>
          )}
          { hasUserEnoughRights(me.rights, USER_RIGHT_TYPES.COMPLIANCE_OFFICER) && (
          <Button
            onClick={() => {
              setIsPythagoras(true)
              setIsBank(false)
              setDialogOpen(true)
            }}
            color="primary"
            type="submit"
          >
Download as csv for Pythagoras
          </Button>
          )}
          { hasUserEnoughRights(me.rights, USER_RIGHT_TYPES.COMPLIANCE_OFFICER) && (
          <Button
            onClick={() => {
              setIsPythagoras(false)
              setIsBank(true)
              setDialogOpen(true)
            }}
            color="primary"
            type="submit"
          >
Download as csv for Bank
          </Button>
          )}
          <div className="card content-area">
            <div className="card-innr">
              <div className="card-head">
                <h4 className="card-title card-title-lg">Company KYC</h4>
              </div>
              <div className={classNames('card-text', classes.tableCardBody)}>
                <AdminKycList type={CUSTOMER_TYPES.COMPANY} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AdminCompanyKyc
