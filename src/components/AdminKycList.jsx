import React, { useState } from 'react'
import PropTypes from 'prop-types'

import makeStyles from '@material-ui/core/styles/makeStyles'

import '../styles/legacy/style.scss'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'

import Table from '@material-ui/core/Table'
import { useMutation, useQuery } from '@apollo/react-hooks'
import CircularProgress from '@material-ui/core/CircularProgress'

import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined'
import RefreshIcon from '@material-ui/icons/Refresh'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import SettingsIcon from '@material-ui/icons/Settings'
import EditIcon from '@material-ui/icons/Edit'

import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'


import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Grow from '@material-ui/core/Grow'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import { DialogTitle } from '@material-ui/core'
import {
  MAIN_INFO_SCHEMAS,
  MAIN_INFO_COMPANY_SCHEMAS,
  ADDRESS_INFO_SCHEMAS,
  INDIVIDUAL_FILES_SCHEMAS, COMPANY_FILES_SCHEMAS,
} from '../schemas/kycVerification'
import { CUSTOMER_STATUS_TYPES, CUSTOMER_TYPES } from '../constants/customer'
import {
  ADMIN_KYC_LIST,
  CHANGE_CUSTOMER_COMPANY_STATUS,
  CHANGE_CUSTOMER_STATUS,
  CHANGE_APPROVED_TO_WHITELISTED_CUSTOMER_STATUS, CHANGE_USER_STATUS_VIDEO_IDENTIFICATION,
} from '../queriesAndMutations'
import TablePaginationActions from './TablePagination'
import AdminKycDrawer from './AdminKycDrawer'
import { useExchangeRates } from '../myHooks'
import { tokenToEth, ethToFiat } from '../utils/rate'
import moment from 'moment'


const useStyles = makeStyles(() => {
  const statusBadge = {
    padding: '6px 12px',
    border: '1px solid #000',
    borderRadius: '8%',
    textTransform: 'lowercase',
  }

  return {
    tableHeader: {
      '& .MuiTableCell-head': {
        color: '#007bff',
        fontSize: '14px',
        fontWeight: 'bold',
      },
    },
    tableRow: {
      minHeight: '75px',
      '& .MuiTableCell-body': {
        padding: '10px 3px',
      },
    },
    nameTableCell: {
      display: 'flex',
      alignItems: 'center',
    },
    avatar: {
      backgroundColor: ' #007bff',
      borderRadius: '50%',
      margin: '8px',
      width: '36px',
      height: '36px',
    },
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
    actionBtnPaper: {
      zIndex: 10,
      position: 'absolute',
      '&>div': {
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        '&>svg': {
          marginRight: '5px',
        },
        padding: '8px 10px',
      },
    },
    circularProgressWrapper: {
      display: 'flex',
      justifyContent: 'center',
    },
    searchBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    buttonsBar: {
      display: 'flex',
      alignItems: 'center',
    },
    settingsPepper: {
      padding: '10px 12px',
      position: 'absolute',
      zIndex: 10,
      '& span': {
        textTransform: 'lowercase',
      },
    },
    editPepper: {
      padding: '10px 12px',
      position: 'absolute',
      zIndex: 10,
      '&>div': {
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&>svg': {
          marginRight: '5px',
        },
      },
    },
  }
})

const KycListActions = ({ userKyc, customerType, refetch }) => {
  const classes = useStyles()
  const { user } = userKyc
  const [selectedUserId, setActionBtnOpen] = React.useState(null)
  const [openDrawer, setOpenDrawer] = React.useState(false)
  const [commentForChangeStatus, setCommentForChangeStatus] = React.useState(null)
  const [openCommentForChangeStatus, setOpenCommentForChangeStatus] = React.useState(false)
  const [changeStatus, setChangeStatus] = React.useState(null)

  const [changeCustomerStatus, changeCustomerStatusData] = useMutation(CHANGE_CUSTOMER_STATUS)
  const [changeCustomerCompanyStatus, changeCustomerCompanyStatusData] = useMutation(CHANGE_CUSTOMER_COMPANY_STATUS)


  const [changeUserVideoIdent] = useMutation(CHANGE_USER_STATUS_VIDEO_IDENTIFICATION)
  const onChangeUserVideoIdent = (userId, videoIdentificationStatus) => () => {
    changeUserVideoIdent({ variables: { id: userId, videoIdentificationStatus } }).then(() => refetch())
  }

  const handleChangeComment = (event) => {
    setCommentForChangeStatus(event.target.value)
  }

  const onChangeStatus = (customerId, status, refetchCustom = () => {}) => () => {
    let needDialogWithComment = false
    setChangeStatus(status)
    if ((status === CUSTOMER_STATUS_TYPES.REOPEN || status === CUSTOMER_STATUS_TYPES.REJECTED) && commentForChangeStatus === null) {
      needDialogWithComment = true
    }
    setOpenCommentForChangeStatus(needDialogWithComment)
    if (customerType === CUSTOMER_TYPES.INDIVIDUAL && !needDialogWithComment) {
      return changeCustomerStatus({ variables: { input: { id: customerId, status, comment: commentForChangeStatus } } }).then(() => {
        refetch()
        refetchCustom()
      })
    }
    if (customerType === CUSTOMER_TYPES.COMPANY && !needDialogWithComment) {
      return changeCustomerCompanyStatus({ variables: { input: { id: customerId, status, comment: commentForChangeStatus } } }).then(() => {
        refetch()
        refetchCustom()
      })
    }
    return false
  }

  const onActionBtnClick = (clickedUserId) => () => {
    if (selectedUserId === clickedUserId) {
      setActionBtnOpen(null)
    } else {
      setActionBtnOpen(clickedUserId)
    }
  }

  const onActionBtnClickAway = () => {
    setActionBtnOpen(false)
  }

  const onOpenDrawer = () => {
    setOpenDrawer(true)
  }

  const onCloseDrawer = () => {
    setOpenDrawer(false)
  }

  const mainScheme = customerType === CUSTOMER_TYPES.INDIVIDUAL ? MAIN_INFO_SCHEMAS : MAIN_INFO_COMPANY_SCHEMAS
  const addressScheme = customerType === CUSTOMER_TYPES.INDIVIDUAL ? ADDRESS_INFO_SCHEMAS : null
  const filesScheme = customerType === CUSTOMER_TYPES.INDIVIDUAL ? INDIVIDUAL_FILES_SCHEMAS : COMPANY_FILES_SCHEMAS

  const dialogForChangeStatusKyc = () => (
    <Dialog
      open={openCommentForChangeStatus}
      onClose={() => setOpenCommentForChangeStatus(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>
        Comment
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Comment"
          variant="outlined"
          id="filled-multiline-flexible"
          multiline
          rowsMax="4"
          onChange={handleChangeComment}
          value={commentForChangeStatus}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={onChangeStatus(userKyc.id, changeStatus)}
        >
Send
        </Button>
      </DialogContent>
    </Dialog>
  )

  return (
    <>
      {dialogForChangeStatusKyc()}
      <ClickAwayListener onClickAway={onActionBtnClickAway}>
        <div>
          {
            (changeCustomerStatusData.loading || changeCustomerCompanyStatusData.loading)
              ? <div className={classes.circularProgressWrapper}><CircularProgress /></div>
              : <Button onClick={onActionBtnClick(user.id)}><MoreHorizIcon /></Button>
          }
          <Grow in={!!selectedUserId || selectedUserId === 0}>
            <Paper className={classes.actionBtnPaper}>
              <div onClick={onOpenDrawer}>
                <VisibilityOutlinedIcon />
                View Details
              </div>
              {userKyc.status === CUSTOMER_STATUS_TYPES.PENDING && (
                <div onClick={onChangeStatus(userKyc.id, CUSTOMER_STATUS_TYPES.REOPEN)}>
                  <RefreshIcon />
                  {CUSTOMER_STATUS_TYPES.REOPEN.toLowerCase()}
                </div>
              )}

            </Paper>
          </Grow>
        </div>
      </ClickAwayListener>
      <AdminKycDrawer
        refetch={refetch}
        addressScheme={addressScheme}
        mainScheme={mainScheme}
        filesScheme={filesScheme}
        open={openDrawer}
        userKyc={userKyc}
        user={user}
        customerType={customerType}
        onClickDrawerAway={onCloseDrawer}
        onChangeUserVideoIdent={onChangeUserVideoIdent}
        onChangeStatus={onChangeStatus}
      />
    </>
  )
}

KycListActions.propTypes = {
  userKyc: PropTypes.object.isRequired,
  customerType: PropTypes.string.isRequired,
  refetch: PropTypes.func.isRequired,
}

const AdminKycList = ({ type }) => {
  const classes = useStyles()
  const [reqOptions, setReqOptions] = useState({
    search: '',
    statuses: [],
  })
  const [page, setPage] = React.useState(0)
  const [pageSize, setPageSize] = React.useState(5)
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const [editOpen, setEditOpen] = React.useState(false)

  const { data: { exchangeRates } = {}, loading: loadingExchangeRates } = useExchangeRates()

  const tokenToChf = (tokenAmount) => exchangeRates && ethToFiat('chf', tokenToEth(tokenAmount, exchangeRates), exchangeRates)

  const { data, refetch, loading } = useQuery(ADMIN_KYC_LIST, {
    variables: {
      input: {
        ...reqOptions,
        page,
        pageSize,
        type,
      },
    },
  })
  const [changeApprovedToWhitelisted, changeApprovedToWhitelistedData] = useMutation(CHANGE_APPROVED_TO_WHITELISTED_CUSTOMER_STATUS)

  const onClickApprovedToWhitelist = () => {
    changeApprovedToWhitelisted({ variables: { amount: 50, type } }).then(() => refetch())
  }

  const onChangeReqOptions = (name) => (event) => {
    setPage(0)
    return setReqOptions({ ...reqOptions, [name]: event.target.value })
  }

  const onChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const onChangePageSize = (event) => {
    if (parseInt(event.target.value, 10)) {
      setPageSize(parseInt(event.target.value, 10))
      setPage(0)
    } else {
      setPageSize(1)
      setPage(0)
    }
  }

  const onEditClickAway = () => {
    setEditOpen(false)
  }

  const onEditClick = () => {
    setEditOpen((prev) => !prev)
  }

  const onSettingsClickAway = () => {
    setSettingsOpen(false)
  }

  const onSettingsClick = () => {
    setSettingsOpen((prev) => !prev)
  }

  const onChangeFilterStatuses = (status) => () => {
    const newStatuses = reqOptions.statuses.includes(status)
      ? reqOptions.statuses.filter((v) => v !== status)
      : [...reqOptions.statuses, status]

    setReqOptions({ ...reqOptions, statuses: newStatuses })
  }

  const renderKycStatus = (status) => {
    const statusStyles = {
      [CUSTOMER_STATUS_TYPES.IDLE]: classes.idleStatusBadge,
      [CUSTOMER_STATUS_TYPES.WHITELISTED]: classes.activeStatusBadge,
      [CUSTOMER_STATUS_TYPES.APPROVED]: classes.activeStatusBadge,
      [CUSTOMER_STATUS_TYPES.PENDING]: classes.pendingStatusBadge,
      [CUSTOMER_STATUS_TYPES.REOPEN]: classes.pendingStatusBadge,
      [CUSTOMER_STATUS_TYPES.REJECTED]: classes.rejectedStatusBadge,
      [CUSTOMER_STATUS_TYPES.CONTRACTED]: classes.activeStatusBadge,
      [CUSTOMER_STATUS_TYPES.KYC_LVL_CHANGE]: classes.pendingStatusBadge,
    }

    return <span className={statusStyles[status]}>{status}</span>
  }

  const renderSettingsBtn = () => {
    if (loading) {
      return <div className={classes.circularProgressWrapper}><CircularProgress /></div>
    }

    return (
      <ClickAwayListener onClickAway={onSettingsClickAway}>
        <div>
          <Button onClick={onSettingsClick}><SettingsIcon /></Button>
          <Grow in={settingsOpen}>
            <Paper className={classes.settingsPepper}>
              <FormControl component="fieldset">
                <FormGroup>
                  {
                  Object.values(CUSTOMER_STATUS_TYPES).map((v) => (
                    <FormControlLabel
                      key={v}
                      control={(
                        <Checkbox
                          checked={reqOptions.statuses.includes(v)}
                          onChange={onChangeFilterStatuses(v)}
                          value={v}
                          color="primary"
                        />
                      )}
                      label={v}
                    />
                  ))
                }
                </FormGroup>
              </FormControl>
            </Paper>
          </Grow>
        </div>
      </ClickAwayListener>
    )
  }

  const renderEditBtn = () => {
    if (changeApprovedToWhitelistedData.loading) {
      return <div className={classes.circularProgressWrapper}><CircularProgress /></div>
    }
    return (
      <ClickAwayListener onClickAway={onEditClickAway}>
        <div>
          <Button onClick={onEditClick}><EditIcon /></Button>
          <Grow in={editOpen}>
            <Paper className={classes.editPepper}>
              <div onClick={onClickApprovedToWhitelist}>
                <VisibilityOutlinedIcon />
                Whitelist 50 Approved Applications
              </div>
            </Paper>
          </Grow>
        </div>
      </ClickAwayListener>
    )
  }

  const renderKyc = (object) => {
    if (type === CUSTOMER_TYPES.COMPANY && typeof object === 'object') {
      const customerCompany = object
      const tokenToEthCustomerCompany = tokenToEth((customerCompany || {}).amount, exchangeRates)
      return (
        <TableRow key={customerCompany.id} className={classes.tableRow}>
          <TableCell padding="none">
            <div className={classes.nameTableCell}>
              <div className={classes.avatar} />
              { customerCompany.user.email }
            </div>
          </TableCell>
          <TableCell align="center">{object.id}</TableCell>
          <TableCell>{customerCompany.tokenAddress}</TableCell>
          <TableCell>
            {(customerCompany || {}).currency ? (
              <div>
                { +(ethToFiat((customerCompany || {}).currency, tokenToEthCustomerCompany, exchangeRates)) }
                {' '}
                { (customerCompany || {}).currency }
              </div>
            )
              : 'undefined'}
          </TableCell>
          <TableCell>
            { object.user.is_gtoswiss
              ? 'GTOwiss.com'
              : object.user.is_internal_sales ? 'InternalSales'
              : 'Organic'}
          </TableCell>
          <TableCell>
            { tokenToChf((customerCompany || {}).amount) }
            {' '}
chf
          </TableCell>
          <TableCell>
            {new Date(customerCompany.created_at).toDateString()}
            <br/>
            {moment(customerCompany.created_at).format('h:mm:ss a')}
          </TableCell>
          <TableCell>{renderKycStatus(customerCompany.status)}</TableCell>
          <TableCell><KycListActions customerType={type} refetch={refetch} userKyc={customerCompany} /></TableCell>
        </TableRow>
      )
    }
    if (type === CUSTOMER_TYPES.INDIVIDUAL && typeof object === 'object') {
      const customer = object
      const tokenToEthCustomer = tokenToEth((customer || {}).amount, exchangeRates)
      return (
        <TableRow key={customer.id} className={classes.tableRow}>
          <TableCell padding="none">
            <div className={classes.nameTableCell}>
              <div className={classes.avatar} />
              { customer.user.email }
            </div>
          </TableCell>
          <TableCell align="center">{object.id}</TableCell>
          <TableCell>{customer.tokenAddress}</TableCell>
          <TableCell>
            {exchangeRates && (
              <div>
                { ethToFiat((customer || {}).currency, tokenToEthCustomer, exchangeRates) }
                {' '}
                { (customer || {}).currency }
              </div>
            )}
          </TableCell>
          <TableCell>
            { object.user.is_gtoswiss
              ? 'GTOwiss.com'
              : object.user.is_internal_sales ? 'InternalSales'
              : 'Organic'}
          </TableCell>
          <TableCell>
            <TableCell>
              { tokenToChf((customer || {}).amount) }
              {' '}
chf
            </TableCell>
          </TableCell>
          <TableCell>
            {new Date(customer.created_at).toDateString()}
            <br/>
            {moment(customer.created_at).format('h:mm:ss a')}
          </TableCell>
          <TableCell>{renderKycStatus(customer.status)}</TableCell>
          <TableCell><KycListActions customerType={type} refetch={refetch} userKyc={customer} /></TableCell>
        </TableRow>
      )
    }
    return false
  }

  if (data && data.kycList && !loadingExchangeRates) {
    const emptyRows = pageSize - Math.min(pageSize, data.kycList.meta.total - page * pageSize)
    return (
      <>
        <div className={classes.searchBar}>
          <TextField
            label="Type in search"
            type="search"
            value={reqOptions.search}
            onChange={onChangeReqOptions('search')}
            margin="none"
          />
          <div className={classes.buttonsBar}>
            { renderSettingsBtn() }
            { renderEditBtn() }
          </div>
        </div>

        <Table className={classes.table}>
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell align="center">Unique KYC ID</TableCell>
              <TableCell>ETH ADDRESS</TableCell>
              <TableCell>Contribution</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>CHF amount</TableCell>
              <TableCell>Submitted At</TableCell>
              <TableCell>Status</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {
              data.kycList.objects.map(renderKyc)
            }
            {emptyRows > 0 && (
              <TableRow style={{ height: 96 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePaginationActions
          count={data.kycList.meta.total}
          page={page}
          rowsPerPage={pageSize}
          onChangePage={onChangePage}
          onChangeRows={onChangePageSize}
          rowsPerPageOptions={[1, 5, 10, 25]}
        />
      </>
    )
  }

  return <div className={classes.circularProgressWrapper}><CircularProgress /></div>
}

AdminKycList.propTypes = {
  type: PropTypes.string.isRequired,
}

export default AdminKycList
