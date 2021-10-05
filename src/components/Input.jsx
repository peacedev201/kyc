import React from 'react'

import TextField from '@material-ui/core/TextField'
import { extractMsgFromErrByPropertyName } from '../utils'

const Input = ({
  // eslint-disable-next-line react/prop-types
  propertyName, label = '', type, isRequired, helperText, state, setState, disabled, error = [], loading = false, children, select = false,
} = {}) => {
  const errorsTexts = extractMsgFromErrByPropertyName(error, propertyName)

  const handleChange = (event) => {
    setState({ ...state, [propertyName]: event.target.value })
  }

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="input-item-label" key={`label-${propertyName}`}>
        { label }
        { isRequired && <span className="text-danger"> *</span>}
      </label>
      <div className="input-item" key={propertyName}>
        <TextField
          select={select}
          className="input-bordered"
          value={state[propertyName] || ''}
          onChange={handleChange}
          margin="none"
          type={type || 'text'}
          error={errorsTexts.length !== 0}
          helperText={helperText || ((errorsTexts && errorsTexts.join('. ')) || '')}
          variant="outlined"
          disabled={disabled || loading}
          fullWidth
        >
          {children}
        </TextField>
      </div>
    </>
  )
}

export default Input
