import React from 'react'
import PropTypes from 'prop-types'
import '../styles/legacy/uploadImageComponent.scss'
import FlipMove from 'react-flip-move'
import ExamplePhotoUploadForPictureId from './ExamplePhotoUploadForPictureId'
import { getOriginalFileExtension } from '../utils/file'

const styles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  width: '100%',
}

class ImageUpload extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pictures: [...props.defaultImages].map(({ imgURI }) => imgURI),
      files: props.defaultImages,
      notAcceptedFileType: [],
      notAcceptedFileSize: [],
      openDialogExampleUploadPhoto: false,
      closeDialogExampleUploadPhoto: false,
      needReUpload: false,
    }
    this.inputElement = ''
    this.onDropFile = this.onDropFile.bind(this)
    this.onUploadClick = this.onUploadClick.bind(this)
    this.triggerFileUpload = this.triggerFileUpload.bind(this)
    this.onDragOver = this.onDragOver.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { files } = this.state
    if (nextProps.defaultImages !== files) {
      this.setState({ pictures: [...nextProps.defaultImages].map(({ imgURI }) => imgURI), files: nextProps.defaultImages })
    }
  }

  // componentDidUpdate(prevProps, prevState) {
  //   const { files, pictures } = this.state
  //   const { onChange } = this.props
  //   if (prevState.files !== files) {
  //     onChange(files, pictures)
  //   }
  // }

  setOpenDialogExampleUploadPhoto(state) {
    this.setState({ openDialogExampleUploadPhoto: state })
  }

  confirm() {
    // eslint-disable-next-line react/no-access-state-in-setstate
    this.setState({
      openDialogExampleUploadPhoto: false,
      closeDialogExampleUploadPhoto: true,
    })
  }

  async reUpload() {
    const { pictures } = this.state
    await pictures.map((picture) => this.removeImage(picture))
    this.confirm()
  }

  onDropFile(e) {
    const { singleFile, onChange } = this.props
    const files = e.target.files || (e.dataTransfer ? e.dataTransfer.files : null)
    const allFilePromises = []

    // Iterate over all uploaded files
    for (let i = 0; i < files.length; i += 1) {
      const f = files[i]

      // Check file size
      if (this.props.maxFileSize < f.size) {
        // eslint-disable-next-line react/no-access-state-in-setstate
        const newArray = this.state.notAcceptedFileSize.slice()
        newArray.push(f.name)
        this.setState({ notAcceptedFileSize: newArray })
        // eslint-disable-next-line no-continue
        continue
      } else {
        this.setState({ notAcceptedFileSize: [] })
      }
      // Check for file extension
      if (!this.hasExtension(f.name)) {
        // eslint-disable-next-line react/no-access-state-in-setstate
        const newArray = this.state.notAcceptedFileType.slice()
        newArray.push(f.name)
        this.setState({ notAcceptedFileType: newArray })
        // eslint-disable-next-line no-continue
        continue
      } else {
        this.setState({ notAcceptedFileType: [] })
      }

      allFilePromises.push(this.readFile(f))
    }

    Promise.all(allFilePromises).then((newFilesData) => {
      const dataURLs = this.state.pictures.slice()
      const allfiles = this.state.files.slice()

      newFilesData.forEach((newFileData) => {
        dataURLs.push(newFileData.dataURL)
        allfiles.push(newFileData.file)
      })

      if (singleFile) {
        onChange([allfiles.pop()], [dataURLs.pop()])
      } else {
        onChange(allfiles, dataURLs)
      }
    })

    if (
      this.state.closeDialogExampleUploadPhoto === false
      && this.state.openDialogExampleUploadPhoto === false
      && this.props.needShowExampleUpload === true
    ) {
      this.setState({ needReUpload: true })
      this.setOpenDialogExampleUploadPhoto(true)
    }
  }

  // eslint-disable-next-line class-methods-use-this
  onUploadClick(e) {
    e.target.value = null
  }

  // eslint-disable-next-line react/sort-comp
  hasExtension(fileName) {
    const pattern = `(${this.props.imgExtension.join('|').replace(/\./g, '\\.')})$`
    return new RegExp(pattern, 'i').test(fileName)
  }

  // eslint-disable-next-line class-methods-use-this
  readFile(file) {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      // Read the image via FileReader API and save image result in state.
      reader.onload = function (e) {
        // Add the file name to the data URL
        let dataURL = e.target.result
        dataURL = dataURL.replace(';base64', `;name=${file.name};base64`)
        resolve({ file, dataURL })
      }

      reader.readAsDataURL(file)
    })
  }

  /*
   Remove the image from state
   */
  removeImage(picture) {
    const removeIndex = this.state.pictures.findIndex((e) => e === picture)
    // eslint-disable-next-line react/no-access-state-in-setstate
    const filteredPictures = this.state.pictures.filter((e, index) => index !== removeIndex)
    // eslint-disable-next-line react/no-access-state-in-setstate
    const filteredFiles = this.state.files.filter((e, index) => index !== removeIndex)

    this.setState({ pictures: filteredPictures, files: filteredFiles }, () => {
      this.props.onChange(this.state.files, this.state.pictures)
    })
  }

  triggerFileUpload() {
    if (
      this.state.closeDialogExampleUploadPhoto === false
      && this.state.openDialogExampleUploadPhoto === false
      && this.props.needShowExampleUpload === true
    ) {
      this.setOpenDialogExampleUploadPhoto(true)
      return null
    }
    this.inputElement.click()
  }

  // eslint-disable-next-line class-methods-use-this
  onDragOver(event) {
    event.stopPropagation()
    event.preventDefault()
  }

  renderErrors() {
    let notAccepted = ''
    if (this.state.notAcceptedFileType.length > 0) {
      notAccepted = this.state.notAcceptedFileType.map((error, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div className={`errorMessage ${this.props.errorClass}`} key={index} style={this.props.errorStyle}>
            *
          {' '}
          {error}
          {' '}
          {this.props.fileTypeError}
        </div>
      ))
    }
    if (this.state.notAcceptedFileSize.length > 0) {
      notAccepted = this.state.notAcceptedFileSize.map((error, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div className={`errorMessage ${this.props.errorClass}`} key={index} style={this.props.errorStyle}>
            *
          {' '}
          {error}
          {' '}
          {this.props.fileSizeError}
        </div>
      ))
    }
    return notAccepted
  }

  renderPreview() {
    return (
      <div className="uploadPicturesWrapper">
        <FlipMove enterAnimation="fade" leaveAnimation="fade" style={styles}>
          {this.renderPreviewPictures()}
        </FlipMove>
      </div>
    )
  }

  renderPreviewPictures() {
    const { singleFile } = this.props
    const { pictures, files } = this.state
    return pictures.map((picture, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <div key={index} className={`uploadPictureContainer ${singleFile ? 'lg-container' : 'sm-container'}`}>
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
        <div className="deleteImage" onClick={() => this.removeImage(picture)}>X</div>
        { getOriginalFileExtension(((files[index] || {}).img || {}).name) === 'pdf' ? (
          <embed
            src={picture}
            width="500"
            height="375"
            type="application/pdf"
          />
        ) : (
          <img src={picture} className="uploadPicture" alt={`${((files[index] || {}).img || {}).name || 'Document'}`} />
        )}
      </div>
    ))
  }

  render() {
    const {
      children,
      className,
      fileContainerStyle,
      buttonClassName,
      buttonStyles,
      name,
      singleImagePick,
      accept,
      withPreview,
      buttonText,
      needShowExampleUpload,
    } = this.props

    const { openDialogExampleUploadPhoto, needReUpload } = this.state

    return (
      <div
        className={`fileUploader ${className}`}
        onDragOver={this.onDragOver}
        onDrop={(e) => {
          e.stopPropagation()
          e.preventDefault()

          this.onDropFile(e)
        }}
      >
        {needShowExampleUpload && (
          <ExamplePhotoUploadForPictureId
            openDialogExampleUploadPhoto={openDialogExampleUploadPhoto}
            setOpenDialogExampleUploadPhoto={() => this.setOpenDialogExampleUploadPhoto()}
            confirm={() => this.confirm()}
            reUpload={() => this.reUpload()}
            needReUpload={needReUpload}
          />
        )}
        <div className="fileContainer" style={fileContainerStyle}>
          { children }
          <div className="errorsContainer">
            {this.renderErrors()}
          </div>
          <button
            type="button"
            className={`${buttonClassName || 'chooseFileButton'}`}
            style={buttonStyles}
            onClick={this.triggerFileUpload}
          >
            {buttonText}
          </button>
          <input
            type="file"
            // eslint-disable-next-line no-return-assign
            ref={(input) => this.inputElement = input}
            name={name}
            multiple={!singleImagePick}
            onChange={this.onDropFile}
            onClick={this.onUploadClick}
            accept={accept}
          />
          { withPreview ? this.renderPreview() : null }
        </div>
      </div>
    )
  }
}

ImageUpload.defaultProps = {
  className: '',
  fileContainerStyle: {},
  buttonClassName: '',
  buttonStyles: {},
  withPreview: false,
  accept: 'image/*, application/pdf',
  name: '',
  buttonText: 'Choose images',
  imgExtension: ['.jpg', '.jpeg', '.gif', '.png', '.pdf'],
  fileSizeError: ' file size is too big',
  fileTypeError: ' is not a supported file extension',
  errorClass: '',
  errorStyle: {},
  singleImagePick: false,
  singleFile: false,
  onChange: () => {},
  defaultImages: [],
  maxFileSize: 10485760,
  needShowExampleUpload: false,
}

ImageUpload.propTypes = {
  fileContainerStyle: PropTypes.object,
  className: PropTypes.string,
  onChange: PropTypes.func,
  buttonClassName: PropTypes.string,
  buttonStyles: PropTypes.object,
  withPreview: PropTypes.bool,
  accept: PropTypes.string,
  name: PropTypes.string,
  buttonText: PropTypes.string,
  imgExtension: PropTypes.array,
  fileSizeError: PropTypes.string,
  fileTypeError: PropTypes.string,
  errorClass: PropTypes.string,
  errorStyle: PropTypes.object,
  singleImagePick: PropTypes.bool,
  singleFile: PropTypes.bool,
  needShowExampleUpload: PropTypes.bool,
  defaultImages: PropTypes.array,
  maxFileSize: PropTypes.number,
}

export default ImageUpload
