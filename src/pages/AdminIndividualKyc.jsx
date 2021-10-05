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
import ButtonExportTxtFile from "../components/ExportTxtFile/ButtonExportTxtFile";
import { TXT_FILE_CONTRACTED, TXT_FILE_DISTRIBUTION } from "../queriesAndMutations";

const useStyles = makeStyles(() => ({
  tableCardBody: {
    overflowX: 'scroll',
  },
}))

const AdminIndividualKyc = () => {
  const classes = useStyles()
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [isPythagoras, setIsPythagoras] = useState(false)
  const [isBank, setIsBank] = useState(false)
  const { data: { me } = {} } = useMe()


  return (
    <div className="page-user">
      <Dialog open={isDialogOpen} onClose={() => { setDialogOpen(false) }}>
        <DialogContent>
          <AdminExportKyc isPythagoras={isPythagoras} isBank={isBank} type={CUSTOMER_TYPES.INDIVIDUAL} onClose={() => { setDialogOpen(false) }} />
        </DialogContent>
      </Dialog>
      <AppBar />

      <div className="page-content">
        <div className="container">
          { hasUserEnoughRights(me.rights, USER_RIGHT_TYPES.COMPLIANCE_OFFICER) && (
          <Button
            onClick={() => {
              setIsPythagoras(false)
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
          { hasUserEnoughRights(me.rights, USER_RIGHT_TYPES.COMPLIANCE_OFFICER) && (
            <ButtonExportTxtFile
              mutation={TXT_FILE_CONTRACTED}
              nameDownloadFile={'eth_for_contracting'}
            >
              ETH for Contracting export
            </ButtonExportTxtFile>
          )}
          { hasUserEnoughRights(me.rights, USER_RIGHT_TYPES.COMPLIANCE_OFFICER) && (
            <ButtonExportTxtFile
              mutation={TXT_FILE_DISTRIBUTION}
              nameDownloadFile={'token_distribution'}
            >
              Token distribution export from approved transactions
            </ButtonExportTxtFile>
          )}
          <div className="card content-area">
            <div className="card-innr">
              <div className="card-head">
                <h4 className="card-title card-title-lg">Individual KYC</h4>
              </div>
              <div className={classNames('card-text', classes.tableCardBody)}>
                <AdminKycList type={CUSTOMER_TYPES.INDIVIDUAL} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AdminIndividualKyc
