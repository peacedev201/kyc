import CheckCircleOutlineRoundedIcon from '@material-ui/icons/CheckCircleOutlineRounded'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import { NavLink } from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress'
import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import HighlightOffRoundedIcon from '@material-ui/icons/HighlightOffRounded'
import ErrorOutlineRoundedIcon from '@material-ui/icons/ErrorOutlineRounded'
import QueryBuilderRoundedIcon from '@material-ui/icons/QueryBuilderRounded'
import HelpOutlineRoundedIcon from '@material-ui/icons/HelpOutlineRounded'
import { makeStyles } from '@material-ui/core'
import { TRANSACTIONS_USER } from '../queriesAndMutations'
import TablePaginationActions from './TablePagination'
import { formatDate } from '../utils/table'
import { TRANSACTIONS_STATUS_TYPES } from '../constants/transaction'

const useStyles = makeStyles(() => {
  const defaultStatusIcon = {
    margin: '0 8px 0 0',
    opacity: '.8',
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
  }
})

const AdminTransactionsUser = ({
  user, exchangeRates, publicSettings,
}) => {
  const classes = useStyles()

  const [page, setPage] = React.useState(0)
  const [pageSize, setPageSize] = React.useState(5)

  const convertRate = (token, toConvert = 'eth_to_chf') => {
    const tokenToETH = token * ((exchangeRates || {}).token_to_eth || 1)

    return tokenToETH * ((exchangeRates || {})[toConvert] || 1)
  }

  const {
    data: { transactionsUser: transactionsUserList } = {},
  } = useQuery(TRANSACTIONS_USER, {
    variables: {
      input: {
        page,
        pageSize,
        userId: user.id,
      },
    },
    fetchPolicy: 'network-only',
  })

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
      {renderStatus(transaction.status)}
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

  if (transactionsUserList) {
    const emptyRows = pageSize - Math.min(pageSize, transactionsUserList.meta.total - page * pageSize)
    return (
      <>
        <Table className={classes.table}>
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell align="center">TRANX NO</TableCell>
              <TableCell align="center">TOKENS</TableCell>
              <TableCell align="center">AMOUNT</TableCell>
              <TableCell align="center">CHF AMOUNT</TableCell>
              {(publicSettings || {}).show_source_signup && (
                <TableCell>Source</TableCell>
              )}
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody className={classes.tableBody}>
            {
              transactionsUserList.objects.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell padding="none">{renderTxNum(transaction)}</TableCell>
                  <TableCell padding="none" align="center">
                    <span className={classes.cellText}>{+transaction.token_amount}</span>
                    <br />
                    <span className={classes.cellSubText}>{publicSettings && publicSettings.token_symbol}</span>
                  </TableCell>
                  <TableCell padding="none" align="center">
                    <span className={classes.cellText}>{+transaction.currency_amount}</span>
                    <br />
                    <span className={classes.cellSubText}>{transaction.currency}</span>
                  </TableCell>
                  <TableCell padding="none" align="center">
                    <span className={classes.cellText}>{convertRate(transaction.token_amount)}</span>
                    <br />
                    <span className={classes.cellSubText}>CHF</span>
                  </TableCell>
                  {(publicSettings || {}).show_source_signup && (
                  <TableCell padding="none">
                    {user.is_gtoswiss
                      ? 'GTOwiss.com'
                      : user.is_internal_sales ? 'InternalSales' : 'Organic'}
                  </TableCell>
                  )}
                  <TableCell size="small" align="center">
                    <NavLink target="_blank" to={`/admin/transactions/${transaction.id}`} className={classes.kycLink}>
                      <span>Go to transaction</span>
                    </NavLink>
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
          count={transactionsUserList.meta.total}
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

export default AdminTransactionsUser
