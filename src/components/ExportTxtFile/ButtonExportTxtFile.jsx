import React, {useState} from 'react'
import PropTypes from 'prop-types'
import '../../styles/legacy/style.scss'
import Button from "@material-ui/core/Button";
import DialogExportTxtFile from './DialogExportTxtFile';

const ButtonExportTxtFile = ({ children, mutation, nameDownloadFile }) => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const openDialog = () => () => {
    setDialogOpen(true)
  }
  const closeDialog = () => () => {
    setDialogOpen(false)
  }

  return (
    <>
      {isDialogOpen && (
        <DialogExportTxtFile
          mutation={mutation}
          isDialogOpen={isDialogOpen}
          openDialog={openDialog()}
          closeDialog={closeDialog()}
          nameDownloadFile={nameDownloadFile}
        />
      )}
      <Button
        onClick={openDialog()}
        color="primary"
        type="submit"
      >
        { children }
      </Button>
    </>
  )
}

ButtonExportTxtFile.propTypes = {
  children: PropTypes.any.isRequired,
  nameDownloadFile: PropTypes.string.isRequired,
}

export default ButtonExportTxtFile
