import React, { useState } from 'react'

import '../styles/legacy/style.scss'
import Grid from '@material-ui/core/Grid'
import { useMutation, useQuery } from '@apollo/react-hooks'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Checkbox from '@material-ui/core/Checkbox'
import { useMe } from '../myHooks'
import { SAVE_COMMENT, COMMENTS } from '../queriesAndMutations'

const useStyles = makeStyles((theme) => ({
  circularProgressWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  textComment: {
    wordWrap: 'break-word',
  },
  comment: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: '4px',
    border: '1px solid #d2dde9',
    padding: '10px 30px',
    marginBottom: '5px',
    '&>div': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
  inputComment: {
    marginTop: '10px',
  },
  paper: {
    margin: `${theme.spacing(1)}px auto`,
    padding: theme.spacing(2),
  },
  boxComment: {
    maxHeight: '300px',
    overflow: 'auto',
    padding: '10px',
  },
  buttonSend: {
    marginTop: '10px',
  },
}))

const AdminComment = ({ type, id, user }) => {
  const classes = useStyles()

  const { data, refetch, loading } = useQuery(COMMENTS, {
    variables: {
      type,
      id,
    },
  })
  const { data: { me: userData } } = useMe()

  const [inputComment, setInputComment] = useState()
  const [isExternal, setIsExternal] = useState(false)

  const handleChangeComment = (event) => {
    setInputComment(event.target.value)
  }

  const changeCheckbox = (event) => {
    setIsExternal(event.target.checked)
  }

  const [saveComment] = useMutation(SAVE_COMMENT)

  const onClickSaveComment = () => {
    saveComment({
      variables: {
        input: {
          id, type, comment: inputComment, isExternal, userId: +userData.id,
        },
      },
    }).then(() => {
      setInputComment('')
      setIsExternal(false)
      refetch()
    })
  }
  return (
    <>
      {loading
        ? <div className={classes.circularProgressWrapper}><CircularProgress /></div>
        : (
          <div>
            <div className={classes.boxComment}>
              {data.comments.objects === null && (
              <div className={classes.comment}>
                Not comment
              </div>
              )}
              {data.comments.objects !== null && (
                data.comments.objects.map((comment) => (
                  <div>
                    <Paper fullWidth className={classes.paper}>
                      <Grid container wrap="nowrap" spacing={2}>
                        <Grid item>
                          <Avatar>{comment.user.first_name[0]}</Avatar>
                          <p>
Name:
                            <br />
                            {comment.user.first_name} {' '} {comment.user.last_name}
                          </p>
                          <p>
Comment Type:
                            <br />
                            {comment.is_external ? 'External' : 'Internal'}
                          </p>
                        </Grid>
                        <Grid item xs>
                          <Typography className={classes.textComment}>{comment.comment}</Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </div>
                ))
              )}
            </div>
            <div className={classes.inputComment}>
              <TextField
                fullWidth
                label="Comment"
                variant="outlined"
                id="filled-multiline-flexible"
                multiline
                rowsMax="4"
                onChange={handleChangeComment}
                value={inputComment}
              />
              <Checkbox
                checked={isExternal}
                onChange={changeCheckbox}
                value="secondary"
                color="primary"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
              <span>Send on email</span>
            </div>
            <Button
              className={classes.buttonSend}
              onClick={onClickSaveComment}
              variant="contained"
              color="primary"
            >
            Send
            </Button>
          </div>
        )}
    </>
  )
}

AdminComment.propTypes = {
  type: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
}

export default AdminComment
