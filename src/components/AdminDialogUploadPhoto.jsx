import React from 'react'
import PropTypes from 'prop-types'


import { makeStyles, DialogTitle } from '@material-ui/core'
import DialogContent from '@material-ui/core/DialogContent'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import MenuItem from '@material-ui/core/MenuItem'
import ImageUpload from './ImageUpload'
import { INDIVIDUAL_DOCUMENT_TYPE_ENUM } from '../schemas/kycVerification'
import Input from './Input'

const useStyles = makeStyles(() => ({
  buttonSend: {
    marginTop: '10px',
  },
}))

const AdminDialogUploadPhoto = ({
  userKyc, open, onClickDialogAway, onUploadPhoto, filesSchemas, fileValues, setFileValues, documentTypeValues,
  setDocumentTypeValues,
}) => {
  const classes = useStyles()

  const onDropFile = (name) => (img, imgURI) => {
    const newImage = {
      img: img.length > 0 ? img[0] : null,
      imgURI: imgURI.length > 0 ? imgURI[0] : '',
    }

    setFileValues({ ...fileValues, [name]: newImage })
  }

  return (
    <Dialog fullWidth open={open} onBackdropClick={onClickDialogAway} onClose={onClickDialogAway}>
      <DialogTitle>Upload photo</DialogTitle>
      <DialogContent>
        <>
          <Input
            propertyName="documentType"
            label="Document type"
            state={documentTypeValues}
            setState={setDocumentTypeValues}
            select
          >
            {
              Object.values(INDIVIDUAL_DOCUMENT_TYPE_ENUM).map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))
            }
          </Input>
          {Object.values(filesSchemas).map((fileSchema) => (
            <div key={fileSchema.schemaTitle}>
              <h5 className="font-mid">
                {fileSchema.label || ''}
              </h5>
              <Grid container spacing={2} justify="center" alignItems="center">
                <Grid item md={9} xs={12}>
                  <ImageUpload
                    buttonText="Choose Image"
                    buttonClassName="btn btn-primary"
                    onChange={onDropFile(fileSchema.schemaTitle)}
                    maxFileSize={5242880}
                    withPreview
                    singleImagePick
                    singleFile
                    defaultImages={
                      (fileValues[fileSchema.schemaTitle] || {}).imgURI
                        ? [fileValues[fileSchema.schemaTitle]]
                        : []
                    }
                  >
                    <p>DRAG AND DROP IMAGE</p>
                  </ImageUpload>
                </Grid>
              </Grid>
            </div>
          ))}
        </>
        <Button
          className={classes.buttonSend}
          onClick={onUploadPhoto(userKyc.id)}
          variant="contained"
          color="primary"
        >
Upload
        </Button>
      </DialogContent>
    </Dialog>
  )
}

AdminDialogUploadPhoto.propTypes = {
  userKyc: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClickDialogAway: PropTypes.func.isRequired,
  onUploadPhoto: PropTypes.func.isRequired,
  documentTypeValues: PropTypes.func.isRequired,
  setDocumentTypeValues: PropTypes.func.isRequired,
}


export default AdminDialogUploadPhoto
