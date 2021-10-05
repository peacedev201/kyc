import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined'
import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined'
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined'
import DoneIcon from '@material-ui/icons/Done'
import ClearIcon from '@material-ui/icons/Clear'
import Button from '@material-ui/core/Button'
import { NavLink } from 'react-router-dom'
import Paper from '@material-ui/core/Paper'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useMutation, useQuery } from '@apollo/react-hooks'
import RefreshIcon from '@material-ui/icons/Refresh'
import pick from 'lodash/pick'
import AdminComment from './AdminComment'
import AdminTransactionsUser from './AdminTransactionsUser'
import AdminHistoryChangeStatusKyc from './AdminHistoryChangeStatusKyc'
import AdminDialogUploadPhoto from './AdminDialogUploadPhoto'
import PopoverResponse from './PopoverResponse'

import { CUSTOMER_STATUS_TYPES, CUSTOMER_TYPES } from '../constants/customer'
import { IDENTIFICATION_ERROR } from '../constants/identification'
import { getFileUrl } from '../utils'
import { getOriginalFileExtension } from '../utils/file'
import { USER_VIDEO_IDENT_STATUS, USER_RIGHTS_WEIGHT } from '../constants/user'
import { COMMENT_TYPES } from '../constants/comment'
import { TOKEN_TYPES } from '../constants/settings'
import { usePublicSettings } from '../myHooks/useSettings'
import { tokenToEth, ethToFiat } from '../utils/rate'
import { useExchangeRates } from '../myHooks'
import TablePaginationActions from './TablePagination'
import { KYC_LVL_HISTORY_USER_ADMIN, CHANGE_STATUS_KYC_LEVEL, UPLOAD_NEW_PHOTO, LAST_CHECK_ETH_ADDRESS } from '../queriesAndMutations'
import { SOURCE_OF_FUNDS_SCHEMAS, INDIVIDUAL_FILES_SCHEMAS, COMPANY_FILES_SCHEMAS } from '../schemas/kycVerification'
import moment from 'moment'

const useStyles = makeStyles((theme) => {
  const statusBadge = {
    padding: '6px 12px',
    border: '1px solid #000',
    borderRadius: '8%',
    textTransform: 'lowercase',
  }

  return {
    marginTopBtn: {
      marginTop: '22px',
    },
    marginBottomBtn: {
      marginBottom: '22px',
    },
    drawerHeader: {
      padding: '24px',
      width: '850px',
      borderBottom: '1px solid #d2dde9',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      color: '#253992',
      fontWeight: 500,
      fontSize: '23px',
      margin: 0,
    },
    drawerBody: {
      padding: '24px',
      width: '850px',
    },
    fullList: {
      width: 'auto',
    },
    tableTitle: {
      color: '#758698',
      fontWeight: 'bold',
    },
    info: {
      borderRadius: '4px',
      border: '1px solid #d2dde9',
      '&>li': {
        display: 'flex',
      },
    },
    infoHead: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '10px 30px',
      fontSize: '14px',
      fontWeight: 500,
      color: '#758698',
      width: '190px',
      textAlign: 'center',
    },
    infoDes: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '10px 30px',
      fontSize: '14px',
      color: '#495463',
      fontWeight: 400,
      flexGrow: 1,
      borderBottom: '1px solid #d2dde9',
      borderLeft: '1px solid #d2dde9',
      width: 'calc(100% - 190px)',
      textAlign: 'center',
    },
    imgLink: {
      position: 'relative',
      '&:hover': {

      },
    },
    imgLinkMask: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: '.5s',
      '& svg': {
        opacity: 0,
      },
      '&:hover': {
        transition: '.5s',
        backgroundColor: '#000',
        opacity: '.4',
        '& svg': {
          color: '#007bff',
          opacity: 1,
        },
      },
    },
    img: {
      maxHeight: '200px',
    },
    mainKycInfo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: '4px',
      border: '1px solid #d2dde9',
      padding: '10px 30px',
      '&>div': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '&>span': {
          textAlign: 'center',
        },
      },
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
      right: '25px',
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

    errorStatusIdentification: {
      color: '#ea0b0b',
    },
    succeededStatusIdentification: {
      color: '#009f65',
    },

    confirmParagraph: {
      paddingLeft: '20px',
      margin: '0 0 0 30px',
      listStyleType: 'square',
      '& li:last-child': {
        paddingBottom: '0',
      },
      '& li': {
        padding: '0 0 25px 0',
      },
      '&>li': {
        listStyleType: 'square',
        paddingBottom: '25px',
        '&>ul': {
          padding: '20px 0 0 20px',
          margin: '0 0 0 30px',
          listStyleType: 'circle',
          '&>li': {
            listStyleType: 'circle',
          },
        },
      },
    },
    popover: {
      pointerEvents: 'none',
    },
    paper: {
      padding: theme.spacing(1),
    },
    wordBreak: {
      wordBreak: 'wrap',
    },
    country_high_risk: {
      color: '#ea0b0b',
    },
    country_low_risk: {
      color: '#009f65',
    },
    videoIdentRecoredLink: {
      marginLeft: '10px',
      padding: '10px',
      color: 'white',
      textTransform: 'uppercase',
    },
  }
})

const AdminKycDrawer = ({
  user, userKyc, open, onClickDrawerAway, mainScheme, addressScheme, filesScheme, onChangeStatus,
  onChangeUserVideoIdent, customerType, refetch,
}) => {
  const classes = useStyles()
  const [actionOpen, setActionOpen] = React.useState(false)
  const [openUploadNewPhoto, setOpenUploadNewPhoto] = React.useState(false)
  const [pageKycLvlHistory, setPageKycLvlHistory] = React.useState(0)
  const [pageSizeKycLvlHistory, setPageSizeKycLvlHistory] = React.useState(5)
  const { data: { publicSettings = {} } = {}, loading: loadingPublicSetting } = usePublicSettings()
  const { data: { exchangeRates } = {} } = useExchangeRates()
  const [changeStatusKycLevel] = useMutation(CHANGE_STATUS_KYC_LEVEL)
  const [uploadNewPhoto] = useMutation(UPLOAD_NEW_PHOTO)
  const { data: { kycLvlHistoryUserAdmin = {} } = {}, refetch: refetchKycLvlHistoryUserAdmin } = useQuery(KYC_LVL_HISTORY_USER_ADMIN, {
    variables: {
      input: {
        userId: userKyc.user_id,
        customerId: userKyc.id,
        page: pageKycLvlHistory,
        pageSize: pageSizeKycLvlHistory,
        customerType,
      },
    },
  })
  const { data: { lastCheckEthAddress = {} } = {} } = useQuery(LAST_CHECK_ETH_ADDRESS, {
    variables: {
      input: {
        type: customerType,
        kycId: userKyc.id
      },
    },
  });
  const filesSchemas = customerType === CUSTOMER_TYPES.INDIVIDUAL ? INDIVIDUAL_FILES_SCHEMAS : COMPANY_FILES_SCHEMAS
  const [fileValues, setFileValues] = useState({})
  const [documentTypeValues, setDocumentTypeValues] = useState({ documentType: userKyc.documentType })

  const onActionBtnClickAway = () => {
    setActionOpen(false)
  }

  const onCloseDialogUploadPhoto = () => {
    setOpenUploadNewPhoto(false)
  }

  const onOpenDialogUploadPhoto = () => {
    setOpenUploadNewPhoto(true)
  }

  const onChangePage = (event, newPage) => {
    setPageKycLvlHistory(newPage)
  }

  const onChangePageSize = (event) => {
    if (parseInt(event.target.value, 10)) {
      setPageSizeKycLvlHistory(parseInt(event.target.value, 10))
      setPageKycLvlHistory(0)
    } else {
      setPageSizeKycLvlHistory(1)
      setPageKycLvlHistory(0)
    }
  }

  const renderKycStatus = (status) => {
    const statusStyles = {
      [CUSTOMER_STATUS_TYPES.IDLE]: classes.idleStatusBadge,
      [CUSTOMER_STATUS_TYPES.WHITELISTED]: classes.activeStatusBadge,
      [CUSTOMER_STATUS_TYPES.APPROVED]: classes.activeStatusBadge,
      [CUSTOMER_STATUS_TYPES.PENDING]: classes.pendingStatusBadge,
      [CUSTOMER_STATUS_TYPES.REJECTED]: classes.rejectedStatusBadge,
      [CUSTOMER_STATUS_TYPES.REOPEN]: classes.pendingStatusBadge,
    }

    return <span className={statusStyles[status]}>{status}</span>
  }

  const changeKycLvl = async (newStatus, id) => {
    await changeStatusKycLevel({
      variables: {
        input: {
          id,
          customerId: userKyc.id,
          customerType,
          newStatus,
        },
      },
    })
    refetchKycLvlHistoryUserAdmin()
  }

  const onUploadPhoto = (kyc_id) => () => {
    const files = Object.keys(fileValues).reduce((prev, current) => ({
      ...prev,
      [current]: fileValues[current].img,
    }), {})

    const inputData = {
      ...pick(files, [
        ...Object.keys(filesSchemas),
      ]),
      ...documentTypeValues,
    }
    inputData.customerType = customerType
    inputData.kycId = kyc_id

    uploadNewPhoto({ variables: { input: inputData } }).then(() => {
      onCloseDialogUploadPhoto()
    })
  }

  const renderKyc = (object) => {
    if (customerType === CUSTOMER_TYPES.COMPANY && typeof object === 'object') {
      const customerCompany = object
      return (
        <TableRow key={customerCompany.id} className={classes.tableRow}>
          <TableCell>
            {new Date(customerCompany.created_at).toDateString()}
            <br/>
            {moment(customerCompany.created_at).format('h:mm:ss a')}
          </TableCell>
          <TableCell>{customerCompany.kyc_level}</TableCell>
          <TableCell>
            { publicSettings.kyc_levels[customerCompany.kyc_level].min_invest_amount }
            -
            { publicSettings.kyc_levels[customerCompany.kyc_level].max_invest_amount }
            {' '}
            chf
          </TableCell>
          <TableCell>
            {customerCompany.kyc_status === CUSTOMER_STATUS_TYPES.KYC_LVL_CHANGE
              ? (
                <>
                  <div onClick={() => changeKycLvl(CUSTOMER_STATUS_TYPES.APPROVED, customerCompany.id)}>
                    <span className="btn btn-auto btn-sm btn-primary">
                    To be Approved
                    </span>
                  </div>
                  <div className={classes.marginTopBtn} onClick={() => changeKycLvl(CUSTOMER_STATUS_TYPES.REJECTED, customerCompany.id)}>
                    <span className="btn btn-auto btn-sm btn-primary">
                    To be Denied
                    </span>
                  </div>
                </>
              )
              : renderKycStatus(customerCompany.kyc_status)}
          </TableCell>
        </TableRow>
      )
    }
    if (customerType === CUSTOMER_TYPES.INDIVIDUAL && typeof object === 'object') {
      const customer = object
      return (
        <TableRow key={customer.id} className={classes.tableRow}>
          <TableCell>
            {new Date(customer.created_at).toDateString()}
            <br/>
            {moment(customer.created_at).format('h:mm:ss a')}
          </TableCell>
          <TableCell>{customer.kyc_level}</TableCell>
          <TableCell>
            { publicSettings.kyc_levels[customer.kyc_level].min_invest_amount }
            -
            { publicSettings.kyc_levels[customer.kyc_level].max_invest_amount }
            {' '}
            chf
          </TableCell>
          <TableCell>
            {customer.kyc_status === CUSTOMER_STATUS_TYPES.KYC_LVL_CHANGE
              ? (
                <>
                  <div onClick={() => changeKycLvl(CUSTOMER_STATUS_TYPES.APPROVED, customer.id)}>
                    <span className="btn btn-auto btn-sm btn-primary">
                    To be Approved
                    </span>
                  </div>
                  <div className={classes.marginTopBtn} onClick={() => changeKycLvl(CUSTOMER_STATUS_TYPES.REJECTED, customer.id)}>
                    <span className="btn btn-auto btn-sm btn-primary">
                    To be Denied
                    </span>
                  </div>
                </>
              )
              : renderKycStatus(customer.kyc_status)}
          </TableCell>
        </TableRow>
      )
    }
    return false
  }

  const renderKycLevelHistory = () => (
    <>
      <Table className={classes.table}>
        <TableHead className={classes.tableHeader}>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Level</TableCell>
            <TableCell>Amount in CHF</TableCell>
            <TableCell>Status</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          { Object.keys(kycLvlHistoryUserAdmin).length > 0
          && kycLvlHistoryUserAdmin.objects.map(renderKyc)}
        </TableBody>
      </Table>
      <TablePaginationActions
        count={Object.keys(kycLvlHistoryUserAdmin).length > 0 ? kycLvlHistoryUserAdmin.meta.totalPages : 0}
        page={pageKycLvlHistory}
        rowsPerPage={pageSizeKycLvlHistory}
        onChangePage={onChangePage}
        onChangeRows={onChangePageSize}
        rowsPerPageOptions={[1, 5, 10, 25]}
      />
    </>
  )


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

  const UploadPreview = ({ upload, ...rest }) => {
    if (upload.preview_storage_key) {
      return <img alt="" src={getFileUrl(upload.preview_storage_key)} {...rest} />
    }

    if (getOriginalFileExtension(upload.storage_key) === 'pdf') {
      return <embed src={getFileUrl(upload.storage_key)} width="500" height="375" type="application/pdf" {...rest} />
    }

    return <img alt="" src={getFileUrl(upload.storage_key)} {...rest} />
  }

  const getUploadUrl = (upload) => `${getFileUrl(upload.storage_key)}?origin=${window.location.origin}`


  return loadingPublicSetting
    ? <CircularProgress />
    : (
      <Drawer anchor="right" open={open} onClose={onClickDrawerAway}>
        {openUploadNewPhoto && (
          <AdminDialogUploadPhoto
            open={openUploadNewPhoto}
            userKyc={userKyc}
            filesSchemas={filesSchemas}
            onClickDialogAway={onCloseDialogUploadPhoto}
            onUploadPhoto={onUploadPhoto}
            fileValues={fileValues}
            setFileValues={setFileValues}
            documentTypeValues={documentTypeValues}
            setDocumentTypeValues={setDocumentTypeValues}
          />
        )}
        <div className={classes.drawerHeader}>
          <h3 className={classes.title}>KYC Details</h3>
          <ClickAwayListener onClickAway={onActionBtnClickAway}>
            <div>
              <Grow in={actionOpen}>
                <Paper className={classes.actionBtnPaper}>
                  <div onClick={onChangeStatus(userKyc.id, CUSTOMER_STATUS_TYPES.APPROVED)}>
                    <CheckOutlinedIcon />
                    Approve
                  </div>
                  <div onClick={onChangeStatus(userKyc.id, CUSTOMER_STATUS_TYPES.REJECTED)}>
                    <ClearOutlinedIcon />
                    Decline
                  </div>
                  {userKyc.status === CUSTOMER_STATUS_TYPES.PENDING && (
                    <div onClick={onChangeStatus(userKyc.id, CUSTOMER_STATUS_TYPES.REOPEN)}>
                      <RefreshIcon />
                      {CUSTOMER_STATUS_TYPES.REOPEN.toLowerCase()}
                    </div>
                  )}
                  {renderChangeVideoIdentBtn()}
                </Paper>
              </Grow>
            </div>
          </ClickAwayListener>
        </div>
        <div
          className={classes.drawerBody}
          role="presentation"
          // onClick={onClickDrawerAway}
        >
          <div className={classes.mainKycInfo}>
            <div>
              <span>Submitted By</span>
              <span>{`${userKyc.first_name} ${userKyc.last_name}`}</span>
            </div>
            <div>
              <span>Video ident status</span>
              <span>{user.video_ident_status}</span>
            </div>
            <div>
              <span>User account email</span>
              <span>{userKyc.email}</span>
            </div>
            <div>
              <span>Amount</span>
              {(userKyc || {}).currency ? (
                <div>
                  {exchangeRates && (
                  <span>
                    { +(ethToFiat((userKyc || {}).currency, tokenToEth((userKyc || {}).amount, exchangeRates), exchangeRates)) }
                    {' '}
                    { (userKyc || {}).currency }
                  </span>
                  )}
                </div>
              )
                : 'undefined'}
            </div>
            <div>
              <span>Submitted On</span>
              <span>
                {new Date(userKyc.created_at).toDateString()}
                <br/>
                {moment(userKyc.created_at).format('h:mm:ss a')}
              </span>
            </div>
            <div>
              <span>Updated On</span>
              <span>
                {new Date(userKyc.updated_at).toDateString()}
                <br/>
                {moment(userKyc.updated_at).format('h:mm:ss a')}
              </span>
            </div>
            <div>{ renderKycStatus(userKyc.status) }</div>
          </div>
          <h5 className={classes.tableTitle}>Transactions</h5>
          { <AdminTransactionsUser
            publicSettings={(publicSettings || {})}
            user={user}
            exchangeRates={exchangeRates}
          /> }

          <h5 className={classes.tableTitle}>KYC submissions</h5>
          <AdminHistoryChangeStatusKyc customerType={customerType} userKyc={userKyc} onChangeStatus={onChangeStatus} />

          <h5 className={classes.tableTitle}>KYC level history</h5>
          { renderKycLevelHistory() }


          <h5 className={classes.tableTitle}>Personal Details</h5>
          <ul className={classes.info}>
            {customerType === CUSTOMER_TYPES.INDIVIDUAL && (
              <>
                <li key={`source_of_funds_${userKyc.id}`}>
                  <div className={classes.infoHead}>Source of funds</div>
                  <div className={classes.infoDes}>{ SOURCE_OF_FUNDS_SCHEMAS[userKyc.source_of_funds.toLowerCase()].label }</div>
                </li>
                {userKyc.source_of_funds_other && (
                  <li key={`source_of_funds_other_${userKyc.id}`}>
                    <div className={classes.infoHead}>Source of funds other</div>
                    <div className={classes.infoDes}>{ userKyc.source_of_funds_other }</div>
                  </li>
                )}
              </>
            )}
            <li key={`eth_address_${userKyc.id}`}>
              <div className={classes.infoHead}>ETH Address</div>
              <div className={classes.infoDes}>
                { userKyc.tokenAddress }
                <br/>
                {(lastCheckEthAddress !== null && Object.keys(lastCheckEthAddress).length > 0) && (
                  <>
                    Score: { JSON.parse(lastCheckEthAddress.response).score }
                    <PopoverResponse
                      jsonResponse={lastCheckEthAddress.response}
                    />
                  </>
                )}
              </div>
            </li>
            {
              Object.keys(mainScheme).map((key) => {
                const { label } = mainScheme[key]
                const value = userKyc[key]
                if (key === 'firstName') {
                  return (
                    <>
                      <li key="firstName">
                        <div className={classes.infoHead}>First name</div>
                        <div className={classes.infoDes}>{ userKyc.first_name }</div>
                      </li>
                    </>
                  )
                }
                if (key === 'lastName') {
                  return (
                    <>
                      <li key="lastName">
                        <div className={classes.infoHead}>Last name</div>
                        <div className={classes.infoDes}>{ userKyc.last_name }</div>
                      </li>
                    </>
                  )
                }
                return (
                  <li key={key}>
                    <div className={classes.infoHead}>{ label }</div>
                    <div className={classes.infoDes}>{ value }</div>
                  </li>
                )
              })
            }
          </ul>
          {
            addressScheme
            && (
              <>
                <h5 className={classes.tableTitle}>Address</h5>
                <ul className={classes.info}>
                  {
                    Object.keys(addressScheme).map((key) => {
                      const { label } = addressScheme[key]
                      let value = userKyc[key]

                      if (addressScheme[key].type && addressScheme[key].type === 'date') {
                        value = new Date(value).toDateString()
                      }

                      return (
                        <li key={key}>
                          <div className={classes.infoHead}>{ label }</div>
                          <div className={classes.infoDes}>
                            { value }
                            {key === 'countryOfResidence' && (
                              <div>
                                {Object.values((publicSettings.high_risk_countries || {})).find((el) => el === value) && (
                                  <p className={classes.country_high_risk}>High risk</p>
                                )}
                                {Object.values((publicSettings.low_risk_countries || {})).find((el) => el === value) && (
                                  <p className={classes.country_low_risk}>Low risk</p>
                                )}
                              </div>
                            )}
                          </div>
                        </li>
                      )
                    })
                  }
                </ul>
              </>
            )
          }
          <h5 className={classes.tableTitle}>Files</h5>
          <div className={classes.marginBottomBtn}>
            <Button
              variant="contained"
              color="primary"
              onClick={onOpenDialogUploadPhoto}
            >
              Upload photo
            </Button>
            {
              user.video_ident_status === USER_VIDEO_IDENT_STATUS.PASSED
                ? <a href={`/video-id-recored/${user.video_ident_id}`} className={`btn btn-auto btn-xs btn-success ${classes.videoIdentRecoredLink}`} target='_blank' rel='noopener noreferrer'>Video Ident Status & Link Video Recored: {user.video_ident_status}</a>
                : null
            }
          </div>

          <ul className={classes.info}>
            {
              Object.keys(filesScheme).map((key) => userKyc[filesScheme[key].propertyPath] && (
                <li key={key}>
                  <div className={classes.infoHead}>
                    {key === 'mainDocumentPhoto'
                      ? (
                        <div>
                          {filesScheme[key].label}
                          {userKyc[filesScheme[key].propertyPath].identification_status && (
                            <>
                              <p className={userKyc[filesScheme[key].propertyPath].identification_error
                                ? classes.errorStatusIdentification
                                : classes.succeededStatusIdentification}
                              >
                                Check is
                                {' '}
                                {' '}
                                { userKyc[filesScheme[key].propertyPath].identification_status }
                              </p>
                              <PopoverResponse
                                jsonResponse={userKyc[filesScheme[key].propertyPath].identification_json_response}
                              />
                            </>
                          )}
                          {userKyc[filesScheme[key].propertyPath].identification_error && (
                            <p className={classes.errorStatusIdentification}>
                              { IDENTIFICATION_ERROR[userKyc[filesScheme[key].propertyPath].identification_error] }
                            </p>
                          )}
                        </div>
                      )
                      : filesScheme[key].label}
                  </div>
                  <div className={classes.infoDes}>
                    <a
                      className={classes.imgLink}
                      href={getUploadUrl(userKyc[filesScheme[key].propertyPath] || {}) || ''}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <div className={classes.imgLinkMask}><VisibilityOutlinedIcon /></div>
                      <UploadPreview className={classes.img} upload={userKyc[filesScheme[key].propertyPath] || {}} alt={filesScheme[key].label} />
                    </a>
                    {(userKyc.logUploadPhoto || []).map((logUploadPhoto) => (
                      <div className={classes.marginTop}>
                        {logUploadPhoto.field_name_kyc === filesScheme[key].nameInDb && (
                          <>
                            <a
                              className={classes.imgLink}
                              href={getUploadUrl(logUploadPhoto.upload || {}) || ''}
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              <div className={classes.imgLinkMask}><VisibilityOutlinedIcon /></div>
                              <UploadPreview className={classes.img} upload={logUploadPhoto.upload || {}} alt={filesScheme[key].label} />
                            </a>
                            <Typography>
                              Uploaded by
                              {' '}
                              {' '}
                              {logUploadPhoto.user.first_name}
                              {' '}
                              {' '}
                              {logUploadPhoto.user.last_name}
                            </Typography>
                            <Typography>
                              Role
                              {' '}
                              {USER_RIGHTS_WEIGHT[logUploadPhoto.user.right] < 2 ? 'user' : 'admin'}
                            </Typography>
                            <Typography>
                              Date by
                              {new Date(logUploadPhoto.user.created_at).toString()}
                            </Typography>
                            {(logUploadPhoto.upload || {}).identification_json_response && (
                              <PopoverResponse
                                jsonResponse={logUploadPhoto.upload.identification_json_response}
                              />
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </li>
              ))
            }
          </ul>


          <h5 className={classes.tableTitle}>Legal disclaimers</h5>
          <ul className={classes.info}>
            <li>
              <div className={classes.infoHead}><DoneIcon /></div>
              <div className={classes.infoDes}>
                I Confirm That I Act On My Own Account, In My Own Economic Interests And Not
                On Behalf Of Others. Or The Beneficial Owner Is, If Different From The Subscriber
              </div>
            </li>
            <li>
              <div className={classes.infoHead}><DoneIcon /></div>
              <div className={classes.infoDes}>
                Hereby Confirm The Receipt Of The Prospectus Of The Issuer Dated
                {' '}
                {publicSettings.prospectusDate}
                {' '}
                Regarding The
                {publicSettings.token_type === TOKEN_TYPES.BOND ? 'Bond' : 'Shares'}
                Which Among Other Things Contain The Information According To Art.
                5 Liechtenstein Act On Distance Marketing Of Consumer Financial Services.
              </div>
            </li>

            <li>
              <div className={classes.infoHead}><DoneIcon /></div>
              <div className={classes.infoDes}>
                I Hereby Confirm To Have Been Informed
                {' '}
                <br />
                <NavLink to="/right-of-withdrawal"> About The Right Of Withdrawal.</NavLink>
              </div>
            </li>

            <li>
              <div className={classes.infoHead}><DoneIcon /></div>
              <div className={classes.infoDes}>
                I Hereby Declare And Confirm That, At The Same Time As The Subscription Is Accepted,
                I Am Requested To Transfer The Subscription Amount To The Following Special
                Account Of The Issuer Within The Duration Of The Offer. Please Refer To Further
                Instructions In Your My Account (This Account Will Be Created Once The KYC Form
                Has Been Successfully Submitted)
              </div>
            </li>

            <li>
              <div className={classes.infoHead}><DoneIcon /></div>
              <div className={classes.infoDes}>
                I Hereby Confirm That, Before Subscribing, I Have Received And Read The Prospectus Of The
                Issuer Dated
                {' '}
                {publicSettings.prospectusDate}
                {' '}
                Regarding The Shares, In Particular The Risk Information,
                Promptly And In Full And I Agree With The Content Of The Prospectus, And In Particular That
                <ul className={classes.confirmParagraph}>
                  <li>I Accept The Subscription Applications</li>
                  <li>
                    I Have Duly Noted The Sales Restrictions Stipulated In The Prospectus And Hereby Con
                    Firm That Those Restrictions Are Observed, Especially I Certify That I As A Single
                    Natural Person Or Legal Entity
                    <ul>
                      <li>Am Not A Citizen Of The USA, Canada And Australia</li>
                      <li>
                        Do Not Hold A Permanent Residence And Work Permit For The US (Green Card), Canada Or Australia
                      </li>
                      <li>
                        Have No Residence Or Principal Place Of Business In The USA,
                        Canada Or Australia Or Their Respective Territories
                      </li>
                      <li>
                        Am Not A Corporation Or Any Other Asset Organized Under The Laws Of The United States,
                        Canada Or Australia, The Income Of Which Is Governed By The Laws Of Canada Or Australia
                      </li>
                      <li>
                        Am Not On Any Of The Sanction Lists Of The European Union, The United States, Canada Or Australia
                      </li>
                    </ul>
                  </li>
                  <li>
                    I Have Duly Noted The Risks And Their Potential Implications
                    Described In The Prospectus And Hereby Accept Them
                  </li>
                </ul>
              </div>
            </li>

            <li>
              <div className={classes.infoHead}><DoneIcon /></div>
              <div className={classes.infoDes}>
                I Hereby Consent To My Personal Data Being Processed By The Issuer And All Companies
                Affiliated With It, As Well As The Persons And Entities Involved In The Management
                And Supervision Of My Investment (In Particular The Issuer’s Business, Banks, Tax
                Advisors, Auditors) Being Stored In Computer Equipment And Be Used. The Data Collected
                May Also Be Used For The Purposes Of Advertising By Email And Post, Regardless
                Of A Contractual Relationship.Please
                {' '}
                <NavLink to="/declaration-of-consent">See The Declaration Of Consent</NavLink>
              </div>
            </li>


            <li>
              <div className={classes.infoHead}><DoneIcon /></div>
              <div className={classes.infoDes}>
                I Hereby Declare That I Have Been Provided With The
                {' '}
                <NavLink to="/privacy-policy">Privacy Policy</NavLink>
                {' '}
                Of The Issuer
                And That I Have Been Informed About The Details Of The Data Processing As Well As About
                My Data Protection Rights.
              </div>
            </li>
            <li>
              <div className={classes.infoHead}><DoneIcon /></div>
              <div className={classes.infoDes}>
                I Hereby Confirm That The Declarations Made To The Best Of My Knowledge And Belief
                Are Correct And Complete. Any Changes To The Aforementioned Circumstances Will
                Be Communicated To The Issuer Without Delay In Written Form And Must Be Forwarded
                An Updated Self-Assessment Within 30 Days Upon Request.
              </div>
            </li>

            <li>
              <div className={classes.infoHead}><DoneIcon /></div>
              <div className={classes.infoDes}>
                I Have Read The Aforementioned “Warnings” And Especially
                The “Risk Information” In The Prospectus. I Am Aware Of The Risk Of The Acquisition Of The Shares.
              </div>
            </li>

          </ul>
          <h5 className={classes.tableTitle}>Comments</h5>
          <AdminComment user={user} type={COMMENT_TYPES[`KYC_${customerType}`]} id={userKyc.id} />
        </div>
      </Drawer>
    )
}

AdminKycDrawer.propTypes = {
  user: PropTypes.object.isRequired,
  userKyc: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClickDrawerAway: PropTypes.func.isRequired,
  mainScheme: PropTypes.object.isRequired,
  addressScheme: PropTypes.object,
  filesScheme: PropTypes.object,
  onChangeStatus: PropTypes.func.isRequired,
}


export default AdminKycDrawer
