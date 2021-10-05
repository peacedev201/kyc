import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { useMutation, useQuery } from '@apollo/react-hooks'


import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import Table from '@material-ui/core/Table'
import makeStyles from '@material-ui/core/styles/makeStyles'
import CircularProgress from '@material-ui/core/CircularProgress'


import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'

import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import DeleteIcon from '@material-ui/icons/Delete'
import RestoreIcon from '@material-ui/icons/Restore'
import PersonIcon from '@material-ui/icons/Person'
import PermIdentityIcon from '@material-ui/icons/PermIdentity'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import DoneIcon from '@material-ui/icons/Done'
import ClearIcon from '@material-ui/icons/Clear'
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined'

import AccessTimeIcon from '@material-ui/icons/AccessTime'
import TextField from '@material-ui/core/TextField'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Button from '@material-ui/core/Button'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import Paper from '@material-ui/core/Paper'
import Grow from '@material-ui/core/Grow'
import TablePaginationActions from './TablePagination'
import {
  ADMIN_USER_LIST,
  CHANGE_USER_RIGHTS,
  CHANGE_USER_STATUS,
  CHANGE_USER_STATUS_VIDEO_IDENTIFICATION,
} from '../queriesAndMutations'
import {
  USER_RIGHT_TYPES, USER_STATUS_TYPES, USER_KYC_STATUS_TYPES, USER_VIDEO_IDENT_STATUS,
} from '../constants/user'
import { hasUserEnoughRights } from '../utils/me'
import { useMe } from '../myHooks'
import { usePublicSettings } from '../myHooks/useSettings'

const useStyles = makeStyles(() => ({
  table: {
    margin: '0',
  },
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
  circularProgressWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
  verifiedStatus: {
    '&>div': {
      minHeight: '75px',
      display: 'flex',
      flexWrap: 'wrap',
      '&>div': {
        display: 'flex',
        alignItems: 'center',
        margin: '6px',
        '&>svg': {
          marginRight: '3px',
        },
      },
    },
  },
  activeStatusBadge: {
    padding: '6px 12px',
    border: '1px solid #009f65',
    borderRadius: '8%',
  },
  disabledStatusBadge: {
    padding: '6px 12px',
    border: '1px solid #ea0b0b',
    borderRadius: '8%',
  },
  nameTableCell: {
    display: 'flex',
    alignItems: 'center',
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
  avatar: {
    backgroundColor: ' #007bff',
    borderRadius: '50%',
    margin: '8px',
    width: '36px',
    height: '36px',
  },
  successIcon: {
    color: '#009f65',
  },
  pendingIcon: {
    color: '#ffc100',
  },
  errorIcon: {
    color: '#f00',
  },
  idleIcon: {
    color: '#000',
    opacity: 0.6,
  },
}))

const UserListActions = ({
  me, user, loading, onChangeUserStatus, onChangeUserRights, onChangeUserVideoIdent,
}) => {
  const classes = useStyles()
  const [selectedUserId, setActionBtnOpen] = React.useState(null)

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

  const renderChangeRightsBtn = () => {
    if (!user) {
      return false
    }

    switch (user.rights) {
      case USER_RIGHT_TYPES.COMMON:
        return (
          <>
            <div onClick={onChangeUserRights(user.id, USER_RIGHT_TYPES.ADMIN)}>
              <PermIdentityIcon />
            Make admin
            </div>
            <div onClick={onChangeUserRights(user.id, USER_RIGHT_TYPES.COMPLIANCE_OFFICER)}>
              <PermIdentityIcon />
            Make compliance officer
            </div>
          </>
        )
      case USER_RIGHT_TYPES.ADMIN:
        return (
          <>
            <div onClick={onChangeUserRights(user.id, USER_RIGHT_TYPES.COMMON)}>
              <PersonIcon />
            Revoke admin rights
            </div>
            <div onClick={onChangeUserRights(user.id, USER_RIGHT_TYPES.COMPLIANCE_OFFICER)}>
              <PermIdentityIcon />
            Make compliance officer
            </div>
          </>
        )
      case USER_RIGHT_TYPES.COMPLIANCE_OFFICER:
        return (
          <>
            <div onClick={onChangeUserRights(user.id, USER_RIGHT_TYPES.COMMON)}>
              <PersonIcon />
            Revoke compliance officer rights
            </div>
            <div onClick={onChangeUserRights(user.id, USER_RIGHT_TYPES.ADMIN)}>
              <PermIdentityIcon />
            Make admin
            </div>
          </>
        )
      case USER_RIGHT_TYPES.GENERAL_ADMIN:
        return (
          <div>
            <PersonIcon />
            General admin
          </div>
        )
      default:
    }

    return <CircularProgress />
  }

  const renderChangeStatusBtn = () => {
    if (!user) {
      return false
    }

    switch (user.status) {
      case USER_STATUS_TYPES.ACTIVE:
        return (
          <div onClick={onChangeUserStatus(user.id, USER_STATUS_TYPES.DELETED)}>
            <DeleteIcon />
            {' '}
            Delete user
          </div>
        )
      case USER_STATUS_TYPES.DELETED:
        return (
          <div onClick={onChangeUserStatus(user.id, USER_STATUS_TYPES.ACTIVE)}>
            <RestoreIcon />
            {' '}
            Restore user
          </div>
        )
      default:
    }

    return <CircularProgress />
  }

  const renderChangeVideoIdentBtn = () => {
    if (!user || user.video_ident_status === USER_VIDEO_IDENT_STATUS.NOT_NEEDED) {
      return false
    }

    if (user.video_ident_status === USER_VIDEO_IDENT_STATUS.PENDING) {
      return (
        <>
          <div onClick={onChangeUserVideoIdent(user.id, USER_VIDEO_IDENT_STATUS.PASSED)}>
            <DoneIcon />
            {' '}
          Video ident approve
          </div>
          <div onClick={onChangeUserVideoIdent(user.id, USER_VIDEO_IDENT_STATUS.DENIED)}>
            <ClearIcon />
            {' '}
          Video ident deny
          </div>
        </>
      )
    }

    if (user.video_ident_status === USER_VIDEO_IDENT_STATUS.DENIED) {
      return (
        <div onClick={onChangeUserVideoIdent(user.id, USER_VIDEO_IDENT_STATUS.PASSED)}>
          <DoneIcon />
          {' '}
          Video ident approve
        </div>
      )
    }

    return (user.video_ident_status === USER_VIDEO_IDENT_STATUS.PASSED) && (
      <div onClick={onChangeUserVideoIdent(user.id, USER_VIDEO_IDENT_STATUS.DENIED)}>
        <ClearIcon />
        {' '}
        Video ident deny
      </div>
    )
  }

  return (
    <ClickAwayListener onClickAway={onActionBtnClickAway}>
      <div>
        {
          loading
            ? <div className={classes.circularProgressWrapper}><CircularProgress /></div>
            : <Button onClick={onActionBtnClick(user.id)}><MoreHorizIcon /></Button>
        }
        <Grow in={!!selectedUserId || selectedUserId === 0}>
          <Paper className={classes.actionBtnPaper}>
            { renderChangeVideoIdentBtn() }
            { hasUserEnoughRights(me.rights, USER_RIGHT_TYPES.GENERAL_ADMIN) && renderChangeRightsBtn() }
            { renderChangeStatusBtn() }
          </Paper>
        </Grow>
      </div>
    </ClickAwayListener>

  )
}

UserListActions.propTypes = {
  user: PropTypes.object.isRequired,
  me: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  onChangeUserStatus: PropTypes.func.isRequired,
  onChangeUserRights: PropTypes.func.isRequired,
  onChangeUserVideoIdent: PropTypes.func.isRequired,
}

const AdminUserList = () => {
  const { data: { publicSettings } = {} } = usePublicSettings()
  const classes = useStyles()
  const [reqOptions, setReqOptions] = useState({
    email: '',
  })
  const [page, setPage] = React.useState(0)
  const [pageSize, setPageSize] = React.useState(5)

  const { data: { me } } = useMe()

  const { data, error, refetch } = useQuery(ADMIN_USER_LIST, {
    variables: {
      input: {
        ...reqOptions,
        page,
        pageSize,
      },
    },
  })
  const [changeUserStatus, changeUserStatusData] = useMutation(CHANGE_USER_STATUS)
  const [changeUserRights, changeUserRightsData] = useMutation(CHANGE_USER_RIGHTS)
  const [changeUserVideoIdent, changeUserVideoIdentData] = useMutation(CHANGE_USER_STATUS_VIDEO_IDENTIFICATION)

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

  const onChangeReqOptions = (name) => (event) => {
    switch (name) {
      case 'email':
        if (event.target.value.length >= 50) {
          return false
        }
        break
      default:
    }
    setPage(0)
    return setReqOptions({ ...reqOptions, [name]: event.target.value })
  }

  const onChangeUserStatus = (userId, status) => () => {
    changeUserStatus({ variables: { input: { id: +userId, status } } }).then(() => refetch())
  }

  const onChangeUserRights = (userId, rights) => () => {
    changeUserRights({ variables: { input: { id: +userId, rights } } }).then(() => refetch())
  }

  const onChangeUserVideoIdent = (userId, videoIdentificationStatus) => () => {
    changeUserVideoIdent({ variables: { id: +userId, videoIdentificationStatus } }).then(() => refetch())
  }

  const renderVerifiedStatus = (user) => (
    <div>
      <div>
        {
          user.is_active
            ? <CheckCircleOutlineIcon className={classes.successIcon} />
            : <ErrorOutlineIcon className={classes.pendingIcon} />
        }
        Email
      </div>
      {(user.rights === USER_RIGHT_TYPES.ADMIN || user.rights === USER_RIGHT_TYPES.GENERAL_ADMIN) && (
      <div>
        <CheckCircleOutlineIcon className={classes.successIcon} />
        Admin
      </div>
      )}
      <div>
        {user.kyc_status === USER_KYC_STATUS_TYPES.NOT_SUBMITTED && <HelpOutlineIcon className={classes.idleIcon} />}
        {user.kyc_status === USER_KYC_STATUS_TYPES.PENDING && <AccessTimeIcon className={classes.pendingIcon} />}
        {user.kyc_status === USER_KYC_STATUS_TYPES.PASSED && <CheckCircleOutlineIcon className={classes.successIcon} />}
        {user.kyc_status === USER_KYC_STATUS_TYPES.REJECTED && <ErrorOutlineIcon className={classes.errorIcon} />}

        KYC
      </div>
      {user.video_ident_status !== USER_VIDEO_IDENT_STATUS.NOT_NEEDED && (
      <div>
        {
          user.video_ident_status === USER_VIDEO_IDENT_STATUS.PASSED
            ? <CheckCircleOutlineIcon className={classes.successIcon} />
            : (user.video_ident_status === USER_VIDEO_IDENT_STATUS.DENIED ? <CancelOutlinedIcon className={classes.errorIcon} />
              : <ErrorOutlineIcon className={classes.pendingIcon} />)

        }

        Video ident
      </div>
      )}
    </div>
  )

  const renderUserStatus = (user) => {
    switch (user.status) {
      case USER_STATUS_TYPES.ACTIVE:
        return <span className={classes.activeStatusBadge}>{user.status}</span>
      case USER_STATUS_TYPES.BLOCKED:
      case USER_STATUS_TYPES.DELETED:
        return <span className={classes.disabledStatusBadge}>{user.status}</span>
      default:
        return false
    }
  }

  if (error) {
    return <div>Some error</div>
  }


  if (data && data.userList) {
    const emptyRows = pageSize - Math.min(pageSize, data.userList.meta.total - page * pageSize)

    return (
      <>
        <TextField
          label="Type in search"
          type="search"
          value={reqOptions.email}
          onChange={onChangeReqOptions('email')}
          margin="normal"
        />
        <Table className={classes.table}>
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Tokens</TableCell>
              <TableCell>Status</TableCell>
              {publicSettings.show_source_signup && (
                <TableCell>Source</TableCell>
              )}
              <TableCell>Last login</TableCell>
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {
              data.userList.objects.map((user) => (
                <TableRow key={user.id} className={classes.tableRow}>
                  <TableCell padding="none">
                    <div className={classes.nameTableCell}>
                      <div className={classes.avatar} />
                      { user.email }
                    </div>
                  </TableCell>
                  <TableCell padding="none">{ user.email }</TableCell>
                  <TableCell padding="none" size="small">{ user.sum_invest_token }</TableCell>
                  <TableCell className={classes.verifiedStatus} padding="none">{ renderVerifiedStatus(user) }</TableCell>
                  {publicSettings.show_source_signup && (
                  <TableCell padding="none">
                    {user.is_gtoswiss
                      ? 'GTOwiss.com'
                      : user.is_internal_sales ? 'InternalSales' : 'Organic'}
                  </TableCell>
                  )}
                  <TableCell padding="none">{ user.lastLogin && new Date(+user.lastLogin).toDateString() }</TableCell>
                  <TableCell padding="none">{ renderUserStatus(user) }</TableCell>
                  <TableCell>
                    <UserListActions
                      me={me}
                      user={user}
                      onChangeUserRights={onChangeUserRights}
                      onChangeUserStatus={onChangeUserStatus}
                      onChangeUserVideoIdent={onChangeUserVideoIdent}
                      loading={
                        changeUserStatusData.loading
                        || changeUserRightsData.loading
                        || changeUserVideoIdentData.loading
                      }
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
          count={data.userList.meta.total}
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

AdminUserList.propTypes = {

}

export default AdminUserList
