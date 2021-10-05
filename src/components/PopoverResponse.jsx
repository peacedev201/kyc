import React from 'react'
import PropTypes from 'prop-types'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Typography from '@material-ui/core/Typography'
import Popover from '@material-ui/core/Popover'

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
  },
  wordBreak: {
    wordBreak: 'wrap',
  },
}))

const PopoverResponse = ({ jsonResponse }) => {
  const classes = useStyles()
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }
  const [anchorEl, setAnchorEl] = React.useState(null)
  const openPopover = Boolean(anchorEl)
  if (!jsonResponse) {
    return null
  }

  return (
    <div>
      <Typography
        aria-owns={openPopover ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        color="primary"
      >
        JSON response
      </Typography>
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={openPopover}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography classes={classes.wordBreak}>{ JSON.stringify(JSON.parse(jsonResponse), null, 2) }</Typography>
      </Popover>
    </div>
  )
}

PopoverResponse.propTypes = {
  jsonResponse: PropTypes.object.isRequired,
}

export default PopoverResponse
