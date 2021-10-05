import React, { useState } from 'react'

import reduce from 'lodash/reduce'

import '../../styles/legacy/style.scss'
import makeStyles from '@material-ui/core/styles/makeStyles'

import Grid from '@material-ui/core/Grid'
import PropTypes from 'prop-types'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import ImageUpload from '../ImageUpload'
import { getFileUrl } from '../../utils'
import { getOriginalFileExtension } from '../../utils/file'


const SETS = {
  logo: {
    label: 'Logo',
  },
  brief_logo: {
    label: 'Brief logo',
  },
}

const useStyles = makeStyles(() => ({
  circularProgressWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
  currentWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}))

const AdminSettingsUploads = ({
  settings, loading, onUpdate, editingAllowed,
}) => {
  const classes = useStyles()

  const [values, setValues] = useState({
    ...reduce(SETS, (memo, value, key) => {
      // eslint-disable-next-line no-param-reassign
      memo[key] = (settings && settings[key]) || {}
      return memo
    }, {}),
  })

  const onUpdateBtnClick = () => {
    const files = Object.keys(values).reduce((prev, current) => ({
      ...prev,
      [current]: values[current].img,
    }), {})

    onUpdate(files)
  }

  const onDropFile = (name) => (img, imgURI) => {
    let newImage = {}
    if (img.length > 0 && imgURI.length > 0) {
      newImage = {
        img: img[0],
        imgURI: imgURI[0],
      }
    }

    setValues({ ...values, [name]: newImage })
  }

  const UploadPreview = ({ path, ...rest }) => {
    if (getOriginalFileExtension(path) === 'pdf') {
      return <embed src={getFileUrl(path)} width="500" height="375" type="application/pdf" {...rest} />
    }

    return <img alt="" src={getFileUrl(path)} {...rest} />
  }


  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <h5 className="font-mid">
            Logo
          </h5>
          {settings.logo_path && (
          <div className={classes.currentWrapper}>
            Current logo
            <UploadPreview path={settings.logo_path} alt="logo" />
          </div>
          )}
          {editingAllowed && (
          <ImageUpload
            buttonText="Choose Logo"
            buttonClassName="btn btn-primary"
            onChange={onDropFile('logo')}
            maxFileSize={1048576}
            withPreview
            singleImagePick
            singleFile
            defaultImages={
              (values.logo || {}).imgURI
                ? [values.logo]
                : []
            }
          >
            <p>NEW LOGO</p>
            <p>DRAG AND DROP IMAGE</p>
          </ImageUpload>
          )}
        </Grid>

        <Grid item xs={6}>
          <h5 className="font-mid">
            Logo for dark BG
          </h5>
          {settings.logo_for_dark_bg_path && (
            <div className={classes.currentWrapper}>
              Current logo
              <UploadPreview path={settings.logo_for_dark_bg_path} alt="logo" />
            </div>
          )}
          {editingAllowed && (
          <ImageUpload
            buttonText="Choose Logo"
            buttonClassName="btn btn-primary"
            onChange={onDropFile('logo_for_dark_bg')}
            maxFileSize={1048576}
            withPreview
            singleImagePick
            singleFile
            defaultImages={
              (values.logo_for_dark_bg || {}).imgURI
                ? [values.logo_for_dark_bg]
                : []
            }
          >
            <p>NEW LOGO FOR DARK BG</p>
            <p>DRAG AND DROP IMAGE</p>
          </ImageUpload>
          )}
        </Grid>


        <Grid item xs={6}>
          <h5 className="font-mid">
            Brief Logo
          </h5>
          {settings.brief_logo_path && (
          <div className={classes.currentWrapper}>
            Current brief logo
            <UploadPreview path={settings.brief_logo_path} alt="logo" />
          </div>
          )}
          {editingAllowed && (
          <ImageUpload
            buttonText="Choose Logo"
            buttonClassName="btn btn-primary"
            onChange={onDropFile('brief_logo')}
            maxFileSize={1048576}
            withPreview
            singleImagePick
            singleFile
            defaultImages={
              (values.brief_logo || {}).imgURI
                ? [values.brief_logo]
                : []
            }
          >
            <p>NEW BRIEF LOGO</p>
            <p>DRAG AND DROP IMAGE</p>
          </ImageUpload>
          )}
        </Grid>

        <Grid item xs={6}>
          <h5 className="font-mid">
            Dataroom logo
          </h5>
          {settings.brief_logo_path && (
            <div className={classes.currentWrapper}>
              Current dataroom logo
              <UploadPreview path={settings.dataroom_logo_path} alt="logo" />
            </div>
          )}
          {editingAllowed && (
          <ImageUpload
            buttonText="Choose dataroom logo"
            buttonClassName="btn btn-primary"
            onChange={onDropFile('dataroom_logo')}
            maxFileSize={1048576}
            withPreview
            singleImagePick
            singleFile
            defaultImages={
              (values.dataroom_logo || {}).imgURI
                ? [values.dataroom_logo]
                : []
            }
          >
            <p>NEW DATAROOM LOGO</p>
            <p>DRAG AND DROP IMAGE</p>
          </ImageUpload>
          )}
        </Grid>

        <Grid item xs={6}>
          <h5 className="font-mid">
            Example photo proof
          </h5>
          {settings.example_photo_proof_path && (
            <div className={classes.currentWrapper}>
              Current example photo proof
              <UploadPreview path={settings.example_photo_proof_path} alt="logo" />
            </div>
          )}
          {editingAllowed && (
          <ImageUpload
            buttonText="Choose example photo proof"
            buttonClassName="btn btn-primary"
            onChange={onDropFile('example_photo_proof')}
            maxFileSize={1048576}
            withPreview
            singleImagePick
            singleFile
            defaultImages={
              (values.example_photo_proof || {}).imgURI
                ? [values.example_photo_proof]
                : []
            }
          >
            <p>NEW EXAMPLE PHOTO PROOF</p>
            <p>DRAG AND DROP IMAGE</p>
          </ImageUpload>
          )}
        </Grid>

        <Grid item xs={6}>
          <h5 className="font-mid">
            Source of funds example
          </h5>
          {settings.source_of_funds_example_path && (
            <div className={classes.currentWrapper}>
              Current source of funds example
              <UploadPreview path={settings.source_of_funds_example_path} alt="logo" />
            </div>
          )}
          {editingAllowed && (
          <ImageUpload
            buttonText="Choose source of funds example"
            buttonClassName="btn btn-primary"
            onChange={onDropFile('source_of_funds_example')}
            maxFileSize={10485760}
            withPreview
            singleImagePick
            singleFile
            defaultImages={
              (values.source_of_funds_example || {}).imgURI
                ? [values.source_of_funds_example]
                : []
            }
          >
            <p>NEW SOURCE OF FUNDS EXAMPLE</p>
            <p>DRAG AND DROP A PDF</p>
          </ImageUpload>
          )}
        </Grid>

        <Grid item xs={6}>
          <h5 className="font-mid">
            Rights of Withdrawal
          </h5>
          {settings.rights_of_withdrawal_path && (
            <div className={classes.currentWrapper}>
              Current Rights of Withdrawal
              <UploadPreview path={settings.rights_of_withdrawal_path} alt="logo" />
            </div>
          )}
          {editingAllowed && (
          <ImageUpload
            buttonText="Choose source of funds example"
            buttonClassName="btn btn-primary"
            onChange={onDropFile('rights_of_withdrawal')}
            maxFileSize={10485760}
            withPreview
            singleImagePick
            singleFile
            defaultImages={
              (values.rights_of_withdrawal || {}).imgURI
                ? [values.rights_of_withdrawal]
                : []
            }
          >
            <p>NEW RIGHTS OF WITHDRAWAL</p>
            <p>DRAG AND DROP A PDF</p>
          </ImageUpload>
          )}
        </Grid>

        <Grid item xs={6}>
          <h5 className="font-mid">
            Source of address for tokens example
          </h5>
          {settings.source_of_address_for_tokens_example_path && (
            <div className={classes.currentWrapper}>
              Current address for tokens example
              <UploadPreview path={settings.source_of_address_for_tokens_example_path} alt="logo" />
            </div>
          )}
          {editingAllowed && (
          <ImageUpload
            buttonText="Choose source of address for tokens example"
            buttonClassName="btn btn-primary"
            onChange={onDropFile('source_of_address_for_tokens_example')}
            maxFileSize={10485760}
            withPreview
            singleImagePick
            singleFile
            defaultImages={
              (values.source_of_address_for_tokens_example_path || {}).imgURI
                ? [values.source_of_address_for_tokens_example_path]
                : []
            }
          >
            <p>NEW SOURCE OF ADDRESS FOR TOKENS EXAMPLE</p>
            <p>DRAG AND DROP A PDF</p>
          </ImageUpload>
          )}
        </Grid>

      </Grid>
      {
        loading
          ? <div className={classes.circularProgressWrapper}><CircularProgress /></div>
          : (
            <Button disabled={!editingAllowed} variant="contained" color="primary" onClick={onUpdateBtnClick}>
              Update
            </Button>
          )
      }
    </>
  )
}

AdminSettingsUploads.propTypes = {
  settings: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
}

export default AdminSettingsUploads
