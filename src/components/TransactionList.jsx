import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { useQuery, useMutation } from '@apollo/react-hooks'
import { NavLink } from 'react-router-dom'

import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import Table from '@material-ui/core/Table'
import makeStyles from '@material-ui/core/styles/makeStyles'
import CircularProgress from '@material-ui/core/CircularProgress'

import CheckCircleOutlineRoundedIcon from '@material-ui/icons/CheckCircleOutlineRounded'
import HighlightOffRoundedIcon from '@material-ui/icons/HighlightOffRounded'
import ErrorOutlineRoundedIcon from '@material-ui/icons/ErrorOutlineRounded'
import QueryBuilderRoundedIcon from '@material-ui/icons/QueryBuilderRounded'
import HelpOutlineRoundedIcon from '@material-ui/icons/HelpOutlineRounded'
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined'
import Dialog from '@material-ui/core/Dialog'

import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import Paper from '@material-ui/core/Paper'
import Grow from '@material-ui/core/Grow'
import DoneIcon from '@material-ui/icons/Done'
import CloseIcon from '@material-ui/icons/Close'
import AccountBalanceIcon from '@material-ui/icons/AccountBalance'

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import DialogContent from '@material-ui/core/DialogContent'
import { DialogTitle } from '@material-ui/core'
import SettingsIcon from '@material-ui/icons/Settings'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import TablePaginationActions from './TablePagination'
import { CHANGE_TRANSACTION_STATUS, CANCEL_TRANSACTION_USER } from '../queriesAndMutations'
import { TRANSACTIONS_STATUS_TYPES } from '../constants/transaction'
import { USER_KYC_STATUS_TYPES, USER_RIGHT_TYPES } from '../constants/user'

import { formatDate } from '../utils/table'
import { toaster } from '../utils/toaster'
import { usePublicSettings } from '../myHooks/useSettings'
import { useExchangeRates, useMe } from '../myHooks/index'
import AdminAddPaymentModal from './AdminAddPaymentModal'
import { mandatoryKyc } from '../utils/me'
import { hasUserEnoughRights } from '../utils/me'
import { tokenToEth, ethToFiat } from '../utils/rate'


const useStyles = makeStyles(() => {
  const defaultStatusIcon = {
    margin: '0 8px 0 0',
    opacity: '.8',
  }

  const statusBadge = {
    padding: '6px 12px',
    border: '1px solid #000',
    borderRadius: '8%',
    textTransform: 'lowercase',
  }

  return {
    table: {
      margin: '0',
    },
    tableHeader: {
      '& .MuiTableCell-head': {
        color: '#007bff',
        fontSize: '14px',
        fontWeight: 'bold',
        padding: '10px',
      },
    },
    tableBody: {
      '& .MuiTableRow-root': {
        minHeight: '75px',
      },
      '& .MuiTableCell-body': {
        padding: '10px',
      },
    },
    circularProgressWrapper: {
      display: 'flex',
      justifyContent: 'center',
    },
    activeStatusBadge: {
      textTransform: 'capitalize',
      padding: '6px 12px',
      border: '1px solid #009f65',
      borderRadius: '8%',
    },
    disabledStatusBadge: {
      textTransform: 'lowercase',
      padding: '6px 12px',
      border: '1px solid #ea0b0b',
      borderRadius: '8%',
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
    actionMenuOption: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      '&>svg': {
        marginLeft: '5px',
      },
    },
    txNum: {
      display: 'flex',
      alignItems: 'center',
    },
    cellText: {
      opacity: '.8',
      fontWeight: 'bold',
      fontSize: '14px',
    },
    cellSubText: {
      opacity: '.6',
      fontSize: '12px',
    },
    successIcon: {
      ...defaultStatusIcon,
      color: '#009f65',
    },
    pendingIcon: {
      ...defaultStatusIcon,
      color: '#ffc100',
    },
    errorIcon: {
      ...defaultStatusIcon,
      color: '#f00',
    },
    idleIcon: {
      ...defaultStatusIcon,
      color: '#000',
    },
    buttonPay: {
      color: '#fff',
      fontSize: '11px',
      padding: '5px 15px',
      margin: '8px',
      textTransform: 'capitalize',
      backgroundColor: '#007bff',
      '&:hover': {
        backgroundColor: '#253992',
      },
      '& svg': {
        margin: '0 0 0 8px',
      },
    },
    buttonDelete: {
      borderRadius: '4px',
      color: '#ff6868',
      backgroundColor: '#ffd8d8',
      transition: '.3s',
      '&:hover': {
        transition: '.3s',
        color: '#fff',
        backgroundColor: '#ff6868',
      },
    },
    buttonInfo: {
      color: '#495463',
      backgroundColor: '#e6effb',
      borderRadius: '4px',
      transition: '.3s',
      '&:hover': {
        transition: '.3s',
        color: '#fff',
        backgroundColor: '#495463',
      },
    },
    buttonBar: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      padding: '8px 10px',
      color: 'rgba(0, 0, 0, 0.87)',
    },
    actionIcon: {
      marginRight: '5px',
    },
    idleStatusBadge: statusBadge,
    pendingStatusBadge: {
      ...statusBadge,
      borderColor: '#ffc100',
    },
    rejectedStatusBadge: {
      ...statusBadge,
      borderColor: '#ea0b0b',
    },
    controlBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    searchField: {
      margin: '8px',
    },
    buttonsBar: {
      display: 'flex',
      alignItems: 'center',
    },
    settingsPepper: {
      right: '46px',
      padding: '10px 12px',
      position: 'absolute',
      zIndex: 10,
      '& span': {
        textTransform: 'lowercase',
      },
    },
  }
})


const TransactionListActions = ({
  transaction, loading, onChangeTransactionStatus = () => {}, onCancelTransaction = () => {}, isAdmin = false,
}) => {
  const classes = useStyles()
  const [selectedTransactionId, setActionBtnOpen] = React.useState(null)
  const [openModalWarning, setOpenModalWarning] = React.useState(false)
  const [openModalAddPayment, setOpenModalAddPayment] = React.useState(false)
  const { data: { publicSettings = {} } = {} } = usePublicSettings()
  const { data: { me } = {} } = useMe()
  const is_gto_sales = transaction.user.is_gtoswiss || transaction.user.is_internal_sales

  const changeModalWarningDialogState = (state) => () => {
    setOpenModalWarning(state)
  }

  const onActionBtnClick = (clickedTransactionId) => () => {
    if (selectedTransactionId === clickedTransactionId) {
      setActionBtnOpen(null)
    } else {
      setActionBtnOpen(clickedTransactionId)
    }
  }

  const onActionBtnClickAway = () => {
    setActionBtnOpen(false)
  }

  const renderDialogWarning = () => (
    <Dialog open={openModalWarning} onClose={changeModalWarningDialogState(false)}>
      <DialogTitle>
          Warning!
      </DialogTitle>
      <DialogContent>
          KYC is not approved for this user
      </DialogContent>
    </Dialog>
  )

  const onCloseAddPayment = () => {
    setOpenModalAddPayment(false)
  }

  const onOpenAddPayment = () => () => {
    setOpenModalAddPayment(true)
  }

  const renderAddPayment = () => (
    <>
      <div onClick={onOpenAddPayment()}>
        <AccountBalanceIcon />
          Add payment
      </div>
    </>
  )

  const renderChangeStatusBtns = () => {
    switch (transaction.status) {
      case TRANSACTIONS_STATUS_TYPES.IN_PROGRESS:
        return (
          <>
            {transaction.currency === 'eth' ? (
              // если владелец транзакции не заполнил kyc и она не откланена и kyc обязательна к заполнению, то выводим
              // предупреждение
              <div onClick={(transaction.user.kyc_status !== USER_KYC_STATUS_TYPES.PASSED
                && transaction.user.kyc_status !== USER_KYC_STATUS_TYPES.REJECTED) && mandatoryKyc(is_gto_sales, (publicSettings.accepted_mandatory_kyc || {}))
                ? changeModalWarningDialogState(true)
                : onChangeTransactionStatus(transaction.id, TRANSACTIONS_STATUS_TYPES.CONTRACTED,
                  transaction.user.kyc_status, transaction)}
              >
                <DoneIcon />
                Contracted
              </div>
            ) : (
              // если владелец транзакции не заполнил kyc и kyc обязательна к заполнению, то выводим
              // предупреждение
              <div className='revenue' onClick={transaction.user.kyc_status !== USER_KYC_STATUS_TYPES.PASSED && mandatoryKyc(is_gto_sales, (publicSettings.accepted_mandatory_kyc || {}))
                ? changeModalWarningDialogState(true)
                : onChangeTransactionStatus(transaction.id, TRANSACTIONS_STATUS_TYPES.APPROVED,
                  transaction.user.kyc_status, transaction)}
              >
                <DoneIcon />
                Approve
              </div>
            )}
            <div onClick={!isAdmin
              // если владелец транзакции не заполнил kyc и она не откланена и kyc обязательна к заполнению и это не админ, то выводим
              // предупреждение
              && (transaction.user.kyc_status !== USER_KYC_STATUS_TYPES.PASSED
              && transaction.user.kyc_status !== USER_KYC_STATUS_TYPES.REJECTED && mandatoryKyc(is_gto_sales, (publicSettings.accepted_mandatory_kyc || {})))
              ? changeModalWarningDialogState(true)
              : onChangeTransactionStatus(transaction.id, TRANSACTIONS_STATUS_TYPES.REJECTED,
                transaction.user.kyc_status, transaction)}
            >
              <CloseIcon />
              Reject
            </div>
          </>
        )
      case TRANSACTIONS_STATUS_TYPES.CONTRACTED:
        if (transaction.currency === 'eth') {
          return (
            <>
              <div onClick={transaction.user.kyc_status !== USER_KYC_STATUS_TYPES.PASSED
                // если владелец транзакции не заполнил kyc и kyc обязательна к заполнению, то выводим
                // предупреждение
                && mandatoryKyc(is_gto_sales, (publicSettings.accepted_mandatory_kyc || {}))
                ? changeModalWarningDialogState(true)
                : onChangeTransactionStatus(transaction.id, TRANSACTIONS_STATUS_TYPES.APPROVED,
                  transaction.user.kyc_status, transaction)}
              >
                <DoneIcon />
                Approve
              </div>
            </>
          )
        }
        break
      default:
    }

    return null
  }

  const renderCancelTransactionBtn = () => {
    switch (transaction.status) {
      case TRANSACTIONS_STATUS_TYPES.IN_PROGRESS:
        return (
          <>
            <div onClick={onCancelTransaction(transaction.id, TRANSACTIONS_STATUS_TYPES.APPROVED)}>
              <CloseIcon />
              Cancel transaction
            </div>
          </>
        )
      default:
    }

    return null
  }


  const renderBasicActions = () => (
    <NavLink className={classes.buttonBar} to={(isAdmin ? `/admin/transactions/${transaction.id}` : `/transactions/${transaction.id}`)}>
      <VisibilityOutlinedIcon className={classes.actionIcon} />
      {' '}
          Details
    </NavLink>
  )


  return (
    <>
      {openModalWarning ? renderDialogWarning() : ''}
      {(openModalAddPayment && is_gto_sales) && (
        <AdminAddPaymentModal
          dialogOpen={openModalAddPayment}
          onCloseDialog={onCloseAddPayment}
          userId={transaction.user.id}
          transactionId={transaction.id}
        />
      ) }
      <ClickAwayListener onClickAway={onActionBtnClickAway}>
        <div>
          {
            loading
              ? <div className={classes.circularProgressWrapper}><CircularProgress /></div>
              : <Button onClick={onActionBtnClick(transaction.id)}><MoreHorizIcon /></Button>
          }
          <Grow in={!!selectedTransactionId || selectedTransactionId === 0}>
            <Paper className={classes.actionBtnPaper}>
              { isAdmin && renderChangeStatusBtns() }
              { (isAdmin && hasUserEnoughRights(me.rights, USER_RIGHT_TYPES.ADMIN) && is_gto_sales) && renderAddPayment() }
              { renderBasicActions() }
              { isAdmin === false && renderCancelTransactionBtn() }

            </Paper>
          </Grow>
        </div>
      </ClickAwayListener>
    </>
  )
}

TransactionListActions.propTypes = {
  transaction: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  onChangeTransactionStatus: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
}

const TransactionList = ({ query, isAdmin, filteredStatus }) => {
  const classes = useStyles()
  const { data: { publicSettings } = {} } = usePublicSettings()

  const [reqOptions, setReqOptions] = useState({
    search: '',
    statuses: [],
  })
  const [page, setPage] = React.useState(0)
  const [pageSize, setPageSize] = React.useState(5)
  const [settingsOpen, setSettingsOpen] = React.useState(false)

  const { data: { exchangeRates } = {} } = useExchangeRates()

  const {
    data: { [isAdmin ? 'transactionsAdmin' : 'transactions']: transactionList } = {}, error, loading, refetch,
  } = useQuery(query, {
    variables: {
      input: {
        ...reqOptions,
        page,
        pageSize,
      },
    },
    fetchPolicy: 'network-only',
  })

  const [changeTransactionStatus, { error: errorChangeStatus }] = useMutation(CHANGE_TRANSACTION_STATUS)

  if (errorChangeStatus) {
    toaster.error(`${errorChangeStatus.message}`)
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

    filteredStatus(newStatuses);

    setReqOptions({ ...reqOptions, statuses: newStatuses })
  }

  const tokenToEur = (amount) => {
    return ethToFiat('eur', tokenToEth(amount, exchangeRates), exchangeRates);
  }

  const onChangeTransactionStatus = (id, status, kyc_status, transaction) => async () => {
    let is_gto_sales = transaction.user.is_gtoswiss || transaction.user.is_internal_sales
    if (isAdmin || (kyc_status === USER_KYC_STATUS_TYPES.PASSED || kyc_status === USER_KYC_STATUS_TYPES.REJECTED || !mandatoryKyc(is_gto_sales, (publicSettings.accepted_mandatory_kyc || {})))) {
      await changeTransactionStatus({
        variables: {
          id,
          status,
        },
      })

      if (TRANSACTIONS_STATUS_TYPES.APPROVED === status && window.dataLayer) {
        window.dataLayer.push({
          'event': 'approve',
          'transactionId': id,
          'transactionTotal': tokenToEur(transaction.token_amount),
        });
      }
      refetch()
    }
  }

  const [cancelTransactionUser] = useMutation(CANCEL_TRANSACTION_USER)

  const onCancelTransaction = (id) => async () => {
    await cancelTransactionUser({
      variables: {
        id,
      },
    })
    refetch()
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

  const convertRate = (token, toConvert = 'eth_to_chf') => {
    const tokenToETH = token * ((exchangeRates || {}).token_to_eth || 1)

    return tokenToETH * ((exchangeRates || {})[toConvert] || 1)
  }

  const onChangeReqOptions = (name) => (event) => {
    switch (name) {
      case 'search':
        if (event.target.value.length >= 50) {
          return false
        }
        break
      default:
    }
    setPage(0)
    return setReqOptions({ ...reqOptions, [name]: event.target.value })
  }

  const renderTextStatus = (status) => {
    const statusStyles = {
      [TRANSACTIONS_STATUS_TYPES.REJECTED]: classes.rejectedStatusBadge,
      [TRANSACTIONS_STATUS_TYPES.IDLE]: classes.idleStatusBadge,
      [TRANSACTIONS_STATUS_TYPES.PENDING]: classes.pendingStatusBadge,
      [TRANSACTIONS_STATUS_TYPES.IN_PROGRESS]: classes.activeStatusBadge,
      [TRANSACTIONS_STATUS_TYPES.APPROVED]: classes.activeStatusBadge,
      [TRANSACTIONS_STATUS_TYPES.CONTRACTED]: classes.activeStatusBadge,
    }

    return <span className={statusStyles[status]}>{status.toLowerCase()}</span>
  }

  const renderStatus = (status) => {
    switch (status) {
      case TRANSACTIONS_STATUS_TYPES.APPROVED:
        return <span className={classes.successIcon}><CheckCircleOutlineRoundedIcon fontSize="large" /></span>
      case TRANSACTIONS_STATUS_TYPES.CONTRACTED:
        return <span className={classes.successIcon}><CheckCircleOutlineRoundedIcon fontSize="large" /></span>
      case TRANSACTIONS_STATUS_TYPES.IN_PROGRESS:
        return <span className={classes.successIcon}><QueryBuilderRoundedIcon fontSize="large" /></span>
      case TRANSACTIONS_STATUS_TYPES.PENDING:
        return <span className={classes.pendingIcon}><ErrorOutlineRoundedIcon fontSize="large" /></span>
      case TRANSACTIONS_STATUS_TYPES.REJECTED:
        return <span className={classes.errorIcon}><HighlightOffRoundedIcon fontSize="large" /></span>
      default:
        return <span className={classes.idleIcon}><HelpOutlineRoundedIcon fontSize="large" /></span>
    }
  }

  const renderTxNum = (transaction) => (
    <div className={classes.txNum}>
      { renderStatus(transaction.status) }
      <div>
        <span className={classes.cellText}>
          TNX
          {transaction.id}
        </span>
        {' '}
        <br />
        <span className={classes.cellSubText}>{formatDate(transaction.created_at)}</span>
      </div>
    </div>
  )

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
                    Object.values(TRANSACTIONS_STATUS_TYPES).map((v) => (
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

  if (error) {
    return <div>Some error</div>
  }


  if (transactionList && exchangeRates) {
    const emptyRows = pageSize - Math.min(pageSize, transactionList.meta.total - page * pageSize)

    return (
      <>
        <div className={classes.controlBar}>
          <TextField
            className={classes.searchField}
            label="Type in to search"
            type="search"
            value={reqOptions.search}
            onChange={onChangeReqOptions('search')}
            margin="none"
          />
          <div className={classes.buttonsBar}>
            { renderSettingsBtn() }
          </div>
        </div>

        <Table className={classes.table}>
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell align="center">TRANX NO</TableCell>
              <TableCell align="center">TOKENS</TableCell>
              <TableCell align="center">AMOUNT</TableCell>
              <TableCell align="center">CHF AMOUNT</TableCell>
              <TableCell align="center">ETH wallet</TableCell>
              <TableCell align="center">FROM</TableCell>
              {(publicSettings || {}).show_source_signup && (
                <TableCell>Source</TableCell>
              )}
              <TableCell align="center">STATUS</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody className={classes.tableBody}>
            {
              transactionList.objects.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell padding="none">{ renderTxNum(transaction) }</TableCell>
                  <TableCell padding="none" align="center">
                    <span className={classes.cellText}>{+transaction.token_amount}</span>
                    <br />
                    <span className={classes.cellSubText}>{publicSettings && publicSettings.token_symbol}</span>
                  </TableCell>
                  <TableCell padding="none" align="center">
                    <span className={classes.cellText}>{(+transaction.currency_amount).toFixed(2)}</span>
                    <br />
                    <span className={classes.cellSubText}>{transaction.currency}</span>
                    <br />
                    <span className={classes.cellSubText}>({transaction.payment_type})</span>
                  </TableCell>
                  <TableCell padding="none" align="center">
                    <span className={classes.cellText}>{convertRate(transaction.token_amount).toFixed(2)}</span>
                    <br />
                    <span className={classes.cellSubText}>CHF</span>
                  </TableCell>
                  <TableCell padding="none" align="center">
                    <span className={classes.cellText}>
                      {transaction.user.eth_receiving_wallet}
                    </span>
                  </TableCell>
                  <TableCell padding="none" align="center">
                    <span className={classes.cellText}>
                      {transaction.user.email}
                    </span>
                    <br />
                    <span className={classes.cellSubText}>{formatDate(transaction.created_at)}</span>
                  </TableCell>
                  {(publicSettings || {}).show_source_signup && (
                  <TableCell padding="none">
                    { transaction.user.is_gtoswiss
                      ? 'GTOwiss.com'
                      : transaction.user.is_internal_sales ? 'InternalSales'
                      : 'Organic'}
                  </TableCell>
                  )}
                  <TableCell padding="none" align="center">{renderTextStatus(transaction.status)}</TableCell>
                  <TableCell size="small" align="center">
                    <TransactionListActions
                      isAdmin={isAdmin}
                      transaction={transaction}
                      loading={loading}
                      onChangeTransactionStatus={onChangeTransactionStatus}
                      onCancelTransaction={onCancelTransaction}
                    />
                  </TableCell>
                </TableRow>
              ))
            }
            {emptyRows > 0 && (
              <TableRow style={{ height: 96 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePaginationActions
          count={transactionList.meta.total}
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

TransactionList.propTypes = {

}

export default TransactionList
