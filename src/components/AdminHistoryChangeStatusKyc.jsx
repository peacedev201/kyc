import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import { useQuery } from '@apollo/react-hooks'
import CircularProgress from '@material-ui/core/CircularProgress'
import { KYC_HISTORY_CHANGE_STATUS_ADMIN } from '../queriesAndMutations'
import { CUSTOMER_STATUS_TYPES } from '../constants/customer'
import moment from 'moment'

const useStyles = makeStyles(() => {
  const statusBadge = {
    padding: '6px 12px',
    border: '1px solid #000',
    borderRadius: '8%',
    textTransform: 'lowercase',
  }

  return {
    idleStatusBadge: statusBadge,
    pendingStatusBadge: {
      ...statusBadge,
      borderColor: '#ffc100',
    },
    activeStatusBadge: {
      ...statusBadge,
      borderColor: '#009f65',
    },
    rejectedStatusBadge: {
      ...statusBadge,
      borderColor: '#ea0b0b',
    },
    circularProgressWrapper: {
      display: 'flex',
      justifyContent: 'center',
    },
  }
})

const AdminHistoryChangeStatusKyc = ({
  userKyc, onChangeStatus, customerType,
}) => {
  const classes = useStyles()
  const { data: { historyChangeStatusKycAdmin = {} } = {}, loading: loadingKycHistoryChangeStatusKycAdmin, refetch } = useQuery(KYC_HISTORY_CHANGE_STATUS_ADMIN, {
    variables: {
      input: {
        customerId: userKyc.id,
        customerType,
      },
    },
  })

  const renderKycStatus = (status) => {
    const statusStyles = {
      [CUSTOMER_STATUS_TYPES.IDLE]: classes.idleStatusBadge,
      [CUSTOMER_STATUS_TYPES.WHITELISTED]: classes.activeStatusBadge,
      [CUSTOMER_STATUS_TYPES.APPROVED]: classes.activeStatusBadge,
      [CUSTOMER_STATUS_TYPES.PENDING]: classes.pendingStatusBadge,
      [CUSTOMER_STATUS_TYPES.REOPEN]: classes.pendingStatusBadge,
      [CUSTOMER_STATUS_TYPES.REJECTED]: classes.rejectedStatusBadge,
    }

    return <span className={statusStyles[status]}>{status}</span>
  }

  const renderKycHistory = (object) => (
    <TableRow key={object.id} className={classes.tableRow}>
      <TableCell>
        {new Date(object.created_at).toDateString()}
        <br/>
        {moment(object.created_at).format('h:mm:ss a')}
      </TableCell>
      <TableCell>{renderKycStatus(object.status_type_after)}</TableCell>
      <TableCell>
        {(object.id === historyChangeStatusKycAdmin.objects[historyChangeStatusKycAdmin.objects.length - 1].id
        && object.status_type_after === CUSTOMER_STATUS_TYPES.PENDING)
          ? (
            <div onClick={onChangeStatus(userKyc.id, CUSTOMER_STATUS_TYPES.APPROVED, refetch)}>
              <span className="btn btn-auto btn-sm btn-primary">
                    Approve now
              </span>
            </div>
          )
          : `${object.user.first_name} ${object.user.last_name}`}
      </TableCell>
      <TableCell>{object.comment}</TableCell>
    </TableRow>
  )

  if (loadingKycHistoryChangeStatusKycAdmin) {
    return <div className={classes.circularProgressWrapper}><CircularProgress /></div>
  }
  return (
    <>
      <Table className={classes.table}>
        <TableHead className={classes.tableHeader}>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>By user</TableCell>
            <TableCell>Comment</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { Object.keys(historyChangeStatusKycAdmin.objects).length > 0
          && historyChangeStatusKycAdmin.objects.map(renderKycHistory)}
        </TableBody>
      </Table>
    </>
  )
}

AdminHistoryChangeStatusKyc.propTypes = {
  userKyc: PropTypes.object.isRequired,
  customerType: PropTypes.string.isRequired,
  onChangeStatus: PropTypes.func.isRequired,
}


export default AdminHistoryChangeStatusKyc
