import React from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames'
import find from 'lodash/find'

import '../../styles/legacy/style.scss'
import Grid from '@material-ui/core/Grid'
import Hidden from '@material-ui/core/Hidden'

import InfoIcon from '@material-ui/icons/Info'
import DoneIcon from '@material-ui/icons/Done'
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'

import makeStyles from '@material-ui/core/styles/makeStyles'
import FormHelperText from '@material-ui/core/FormHelperText'
import { CUSTOMER_STATUS_TYPES } from '../../constants/customer'


import ImageUpload from '../ImageUpload'

import {
  isFiat,
} from '../../utils/rate'
import { extractMsgFromErrByPropertyName, getFileUrl } from '../../utils'
import { getOriginalFileExtension } from '../../utils/file'

const useStyles = makeStyles(() => ({
  flexAlignCenter: {
    display: 'flex',
    alignItems: 'center',
  },
  info: {
    color: '#758698',
    '&>svg': {
      margin: '0 5px 0 0',
    },
  },
  listCheck: {
    '&>li': {
      display: 'flex',
      alignItems: 'center',
      '&>svg': {
        margin: '0 5px 0 0',
        color: '#6e81a9',
      },
    },
  },
  documentTypeButton: {
    paddingBottom: '22px !important',
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
}))

const KycVerificationFormLevelTwo = ({
  documentTypeEnum, onChangeTab, setValues, onDropFile, fileValues, values, accepted_field_application_individual_fiat,
  accepted_field_application_individual_crypto, isAmountEquallyTwoLVLCurrency, error, customer = {}, settings,
}) => {
  const classes = useStyles()

  const [openDialog, setOpenDialog] = React.useState(false)

  const UploadPreview = ({ upload, ...rest }) => {
    if (getOriginalFileExtension(upload) === 'pdf') {
      return <embed src={getFileUrl(upload)} width="500" height="375" type="application/pdf" {...rest} />
    }

    return <img alt="" src={getFileUrl(upload)} {...rest} />
  }

  const customDialog = () => (
    <Dialog
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <img src={getFileUrl(settings.example_photo_proof_path)} alt="" />
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="form-step form-step2">
      {customDialog()}
      <div className="form-step-head card-innr">
        <div className="step-head">
          <div className="step-number">03</div>
          <div className="step-head-text">
            <h4>Document Upload</h4>
            <p>To verify your identity, please upload any of your document</p>
          </div>
        </div>
      </div>
      <div className="form-step-fields card-innr">
        <div className={classNames(classes.flexAlignCenter, classes.info)}>
          <InfoIcon />
          {' '}
        In order to complete, please upload any of the following personal document.
        </div>
        <div className="gaps-2x" />
        <div className="tab-content" id="myTabContent">
          <div className="tab-pane fade show active" id="passport">
            <h5 className="text-secondary font-bold">
            To avoid delays when verifying account, Please make sure
            bellow:
            </h5>
            <Grid container spacing={4} justify="space-between" alignItems="center">
              <Grid item>
                <ul className={classNames('list-check', classes.listCheck)}>
                  <li>
                    <DoneIcon />
                  Chosen credential must be valid (not expired).
                  </li>
                  <li>
                    <DoneIcon />
                  Document should be good condition and clearly visible.
                  </li>
                  <li>
                    <DoneIcon />
                  Make sure that there is no light glare on the card.
                  </li>
                  <li>
                    <DoneIcon />
                  File is at least 1 MB in size and has at least 300 dpi resolution.
                  </li>
                </ul>
              </Grid>
              <Grid tem>
                <div className={classes.imgLink}>
                  <div onClick={() => setOpenDialog(true)} className={classes.imgLinkMask}><VisibilityOutlinedIcon /></div>
                  <UploadPreview className={classes.img} upload={settings.example_photo_proof_path} alt="Example" />
                </div>
              </Grid>
            </Grid>
            <div />
            <div className="gaps-4x" />
            <ul className="nav nav-tabs nav-tabs-bordered row flex-wrap guttar-20px" role="tablist">
              {
              Object.keys(documentTypeEnum).length > 1 && Object.keys(documentTypeEnum).map((key) => {
                const additionalClassActive = values.documentType === documentTypeEnum[key].value ? 'active' : ''
                return (
                  <li className="nav-item flex-grow-0" key={key}>
                    <div
                      className={classNames('nav-link d-flex align-items-center', additionalClassActive, classes.documentTypeButton)}
                      onClick={onChangeTab('documentType', values, setValues, documentTypeEnum[key].value)}
                      data-toggle="tab"
                    >
                      <div className="nav-tabs-icon">
                        {
                          additionalClassActive
                          && documentTypeEnum[key].iconActive
                          && <img src={documentTypeEnum[key].iconActive} alt="icon" />
                        }
                        {
                          !additionalClassActive
                          && documentTypeEnum[key].icon
                          && <img src={documentTypeEnum[key].icon} alt="icon" />
                        }
                      </div>
                      <span>{documentTypeEnum[key].label || 'Some document'}</span>
                    </div>
                  </li>
                )
              })
            }
            </ul>
            {
            find(
              documentTypeEnum,
              (documentType) => documentType.value === values.documentType
            ).require.map((requiredField) => {
              if (
                (customer[requiredField.schema.propertyPath] !== null && customer.status !== CUSTOMER_STATUS_TYPES.REOPEN)
                && Object.keys(customer).length > 0
              ) return false
              if (customer.status === CUSTOMER_STATUS_TYPES.REOPEN && requiredField.schema.propertyPath === 'proofOfResidenceUpload') {
                if (isFiat(values.currency)) {
                  return false
                }
              }
              if (customer.status !== CUSTOMER_STATUS_TYPES.REOPEN) {
                if (isFiat(values.currency)) {
                  if (requiredField.schema.propertyPath === 'proofOfResidenceUpload') return false
                  if (
                    (!accepted_field_application_individual_fiat[requiredField.schema.propertyPath]
                      && accepted_field_application_individual_fiat[requiredField.schema.propertyPath] !== undefined)
                    || (!isAmountEquallyTwoLVLCurrency && accepted_field_application_individual_fiat[requiredField.schema.propertyPath])
                  ) {
                    return false
                  }
                }
                if (!isFiat(values.currency)) {
                  if (
                    (!accepted_field_application_individual_crypto[requiredField.schema.propertyPath]
                      && accepted_field_application_individual_crypto[requiredField.schema.propertyPath] !== undefined)
                    || (!isAmountEquallyTwoLVLCurrency && accepted_field_application_individual_crypto[requiredField.schema.propertyPath])
                  ) {
                    return false
                  }
                }
              }

              const errorsTexts = extractMsgFromErrByPropertyName(error, requiredField.schema.schemaTitle)
              return (
                <div key={requiredField.schema.schemaTitle}>
                  <h5 className="font-mid">
                    {requiredField.title || ''}
                    <span className="text-danger"> *</span>
                  </h5>
                  <FormHelperText error={errorsTexts.length !== 0}>{errorsTexts}</FormHelperText>
                  <Grid container spacing={2} justify="center" alignItems="center">
                    <Grid item md={9} xs={12}>
                      <ImageUpload
                        buttonText="Choose Image"
                        buttonClassName="btn btn-primary"
                        onChange={onDropFile(requiredField.schema.schemaTitle)}
                        maxFileSize={5242880}
                        withPreview
                        singleImagePick
                        singleFile
                        needShowExampleUpload={requiredField.schema.propertyPath !== 'photoWithMeUpload'}
                        defaultImages={
                          (fileValues[requiredField.schema.schemaTitle] || {}).imgURI
                            ? [fileValues[requiredField.schema.schemaTitle]]
                            : customer[requiredField.schema.propertyPath]
                              ? [{ imgURI: `/file/${(customer[requiredField.schema.propertyPath] || {}).storage_key}` }]
                              : []
                        }
                      >
                        <p>DRAG AND DROP IMAGE</p>
                      </ImageUpload>
                    </Grid>
                    <Hidden smDown>
                      <Grid item md={3}>
                        <img src={requiredField.img} alt="vector" />
                      </Grid>
                    </Hidden>
                  </Grid>
                </div>
              )
            })
          }
          </div>
        </div>
      </div>
    </div>
  )
}

KycVerificationFormLevelTwo.propTypes = {
  onChangeTab: PropTypes.func.isRequired,
  setValues: PropTypes.func.isRequired,
  onDropFile: PropTypes.func.isRequired,
  KYC_WALLET_ENUM: PropTypes.object.isRequired,
  fileValues: PropTypes.object.isRequired,
  isAmountEquallyTwoLVLCurrency: PropTypes.number.isRequired,
  values: PropTypes.object.isRequired,
  kycType: PropTypes.string.isRequired,
  filesSchemas: PropTypes.object.isRequired,
  accepted_field_application_individual_fiat: PropTypes.object.isRequired,
  accepted_field_application_individual_crypto: PropTypes.object.isRequired,
  documentTypeEnum: PropTypes.object.isRequired,
}

export default KycVerificationFormLevelTwo
