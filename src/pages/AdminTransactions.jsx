import React, { useEffect, useState } from 'react'

import classNames from 'classnames'

import makeStyles from '@material-ui/core/styles/makeStyles'
import '../styles/legacy/style.scss'
import Footer from '../components/Footer'
import AppBar from '../components/AppBar'
import TransactionList from '../components/TransactionList'
import { TRANSACTIONS_ADMIN } from '../queriesAndMutations'
import TagManager from 'react-gtm-module'
import { usePublicSettings } from "../myHooks/useSettings";
import { hasUserEnoughRights } from "../utils/me";
import { useMe } from "../myHooks";
import { USER_RIGHT_TYPES } from "../constants/user";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import AdminExportTransactions from "../components/AdminCsvDialogs/AdminExportTransactions";

const useStyles = makeStyles(() => ({
  tableCardBody: {
    overflowX: 'scroll',
  },
}))

const AdminTransactions = () => {
  const classes = useStyles()
  const { data: { publicSettings = {} } = {} } = usePublicSettings()
  const { data: { me } = {} } = useMe();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [filteredStatus, setFilteredStatus] = useState(null);

  useEffect(() => {
    if (publicSettings.google_tag_manager_id !== null && publicSettings.google_tag_manager_id !== undefined) {
      TagManager.initialize({ gtmId: publicSettings.google_tag_manager_id });
    }
  });

  return (
    <div className="page-user">
      <Dialog
        open={isDialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
      >
        <DialogContent>
          <AdminExportTransactions
            filteredStatus={filteredStatus}
            onClose={() => {
              setDialogOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <AppBar />

      <div className="page-content">
        <div className="container">
          {hasUserEnoughRights(
            me.rights,
            USER_RIGHT_TYPES.COMPLIANCE_OFFICER
          ) && (
            <Button onClick={() => {setDialogOpen(true);}} color="primary" type="submit">
              Download as csv
            </Button>
          )}
          <div className="card content-area">
            <div className="card-innr">
              <div className="card-head">
                <h4 className="card-title card-title-lg">Transactions</h4>
              </div>
              <div className={classNames("card-text", classes.tableCardBody)}>
                <TransactionList
                  isAdmin
                  query={TRANSACTIONS_ADMIN}
                  filteredStatus={(newStatuses) =>
                    setFilteredStatus(newStatuses)
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminTransactions
