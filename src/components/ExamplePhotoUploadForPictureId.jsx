import React from 'react'
import PropTypes from 'prop-types'
import makeStyles from '@material-ui/core/styles/makeStyles'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'
import DialogContent from '@material-ui/core/DialogContent'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'
import { getFileUrl, getOriginalFileExtension } from '../utils/file'
import { usePublicSettings } from '../myHooks/useSettings'

const useStyles = makeStyles(() => ({
  bar: {
    position: 'fixed',
    right: '10px',
    bottom: '10px',
  },
}))

const ExamplePhotoUploadForPictureId = ({
  confirm, reUpload, openDialogExampleUploadPhoto,
  setOpenDialogExampleUploadPhoto, needReUpload = false,
}) => {
  const classes = useStyles()
  const { data: { publicSettings = {} } = {}, loading: loadingPublicSettings } = usePublicSettings()

  const closeExampleUploadPhoto = () => {
    setOpenDialogExampleUploadPhoto(false)
  }

  const UploadPreview = ({ upload, ...rest }) => {
    if (getOriginalFileExtension(upload) === 'pdf') {
      return <embed src={getFileUrl(upload)} width="500" height="375" type="application/pdf" {...rest} />
    }

    return <img alt="" src={getFileUrl(upload)} {...rest} />
  }

  return (

    <Dialog
      open={openDialogExampleUploadPhoto}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>
        <Typography>
          Please confirm that you will upload the documents like this.
          <br />
          <br />
          One document per upload field!
          <br />
          <br />
          Please also note, that you can Upload Passport, National ID Card or a Driver License. Please click the appropriate!
        </Typography>
      </DialogTitle>
      <DialogContent>
        <>
          {loadingPublicSettings
            ? (<CircularProgress />)
            : (
              <>
                <UploadPreview className={classes.img} upload={publicSettings.example_photo_proof_path} alt="Example" />
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      confirm()
                      closeExampleUploadPhoto()
                    }}
                  >
                    I confirm
                  </Button>
                  {needReUpload && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        reUpload()
                        closeExampleUploadPhoto()
                      }}
                    >
                      I will re-upload
                    </Button>
                  )}
                </Grid>
              </>
            )}
        </>
      </DialogContent>
    </Dialog>
  )
}

ExamplePhotoUploadForPictureId.propTypes = {
  confirm: PropTypes.func.isRequired,
  reUpload: PropTypes.func.isRequired,
  openDialogExampleUploadPhoto: PropTypes.bool.isRequired,
  setOpenDialogExampleUploadPhoto: PropTypes.func.isRequired,
  needReUpload: PropTypes.bool,
}

export default ExamplePhotoUploadForPictureId
