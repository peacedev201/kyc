import React, { useState } from 'react'

import classNames from 'classnames'

import makeStyles from '@material-ui/core/styles/makeStyles'

import '../styles/legacy/style.scss'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import AppBar from '../components/AppBar'
import Footer from '../components/Footer'
import { hasUserEnoughRights } from '../utils/me'

import { USER_RIGHT_TYPES } from '../constants/user'
import AdminUserList from '../components/AdminUserList'
import AdminExportUsers from '../components/AdminCsvDialogs/AdminExportUsers'
import { useMe } from '../myHooks'


const useStyles = makeStyles(() => ({
  tableCardBody: {
    overflowX: 'scroll',
  },
}))

const AdminUsers = () => {
  const classes = useStyles()
  const { data: { me } = {} } = useMe()
  const [isDialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="page-user">
      <Dialog open={isDialogOpen} onClose={() => { setDialogOpen(false) }}>
        <DialogContent>
          <AdminExportUsers onClose={() => { setDialogOpen(false) }} />
        </DialogContent>
      </Dialog>

      <AppBar />

      <div className="page-content">
        <div className="container">
          { hasUserEnoughRights(me.rights, USER_RIGHT_TYPES.ADMIN) && <Button onClick={() => setDialogOpen(true)} color="primary" type="submit">Download as csv</Button>}
          <div className="card content-area">
            <div className="card-innr">
              <div className="card-head">
                <h4 className="card-title card-title-lg">Users</h4>
              </div>
              <div className={classNames('card-text', classes.tableCardBody)}>
                <AdminUserList />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AdminUsers
