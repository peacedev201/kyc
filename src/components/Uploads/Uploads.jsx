import React from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import ImageUpload from '../ImageUpload'

import { hasUserEnoughRights, getFileUrl } from '../../utils/index'
import { USER_RIGHT_TYPES } from '../../constants/user'


import { PUBLIC_UPLOADS, PUBLIC_UPLOAD, REMOVE_PUBLIC_UPLOAD } from '../../queriesAndMutations'

import { getOriginalFileExtension } from '../../utils/file'
import { useMe } from '../../myHooks'

const useStyles = makeStyles({
  card: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
  circularProgressWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '300px',
    height: '176px',
  },
})


const UploadPreview = ({ upload, ...rest }) => {
  if (upload.preview_storage_key) {
    return <img alt="" height="375" src={getFileUrl(upload.preview_storage_key)} {...rest} />
  }

  if (getOriginalFileExtension(upload.storage_key) === 'pdf') {
    return <embed src={getFileUrl(upload.storage_key)} height="375" type="application/pdf" {...rest} />
  }

  return <img alt="" src={getFileUrl(upload.storage_key)} {...rest} />
}


const getUploadUrl = (upload) => `${getFileUrl(upload.storage_key)}?origin=${window.location.origin}`

const Uploads = () => {
  const classes = useStyles()
  const { data: { publicUploads = [] } = {}, refetch } = useQuery(PUBLIC_UPLOADS)
  const { data: { me: user } = {} } = useMe()

  const [removePublicUpload] = useMutation(REMOVE_PUBLIC_UPLOAD)
  const [uploadImage, { loading: uploadLoading }] = useMutation(PUBLIC_UPLOAD)

  const onRemoveUpload = (uploadId) => async () => {
    await removePublicUpload({ variables: { upload_id: uploadId } })
    refetch()
  }


  const onDropFile = async (files) => {
    if (files.length > 0) {
      const [upload] = files
      await uploadImage({ variables: { upload } })
      refetch()
    }
  }


  return (
    <Grid spacing={2} container wrap="wrap">
      { hasUserEnoughRights(user.rights, USER_RIGHT_TYPES.ADMIN) && (
      <Grid item sm={6} md={4}>
        {uploadLoading === false ? (
          <ImageUpload
            buttonText="Choose document"
            buttonClassName="btn btn-primary"
            onChange={onDropFile}
            maxFileSize={10000000}
            withPreview
            singleImagePick
            singleFile
            defaultImages={[]}
          >
            <p>NEW DOCUMENT</p>
            <p>DRAG AND DROP THE DOCUMENT</p>
          </ImageUpload>
        ) : <div className={classes.circularProgressWrapper}><CircularProgress /></div>}
      </Grid>
      )}
      {publicUploads.map((upload) => (
        <Grid item key={upload.storage_key} sm={6} md={4}>
          <Card className={classes.card}>
            <UploadPreview upload={upload} />
            <CardContent>
              <Typography variant="body2" color="textSecondary" component="p">
                {upload.original_name}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary" href={getUploadUrl(upload)} target="_blank">
              Open
              </Button>
              { hasUserEnoughRights(user.rights, USER_RIGHT_TYPES.ADMIN)
              && (
              <Button size="small" color="secondary" onClick={onRemoveUpload(upload.id)}>
              Remove
              </Button>
              )}
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default Uploads
