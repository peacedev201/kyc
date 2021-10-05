import IconButton from '@material-ui/core/IconButton'
import classNames from 'classnames'
import TextField from '@material-ui/core/TextField'
import React from 'react'
import PropTypes from 'prop-types'
import makeStyles from '@material-ui/core/styles/makeStyles'
import MenuItem from '@material-ui/core/MenuItem'
import { calculatePagesRange } from '../utils'

const useStyles = makeStyles(() => ({
  tablePage: {
    display: 'inline-block',
    height: '36px',
    minWidth: '36px',
    textAlign: 'center',
    lineHeight: '20px',
    padding: '8px 8px',
    borderRadius: '4px',
    background: '#e0e8f3',
    border: 'none',
    color: '#495463',
    fontWeight: '500',
    fontSize: '12px',
    margin: '0 4px',
    transition: 'color 0.5s',
  },
  tablePageActive: {
    background: '#007bff',
    color: '#FFF',
    transition: 'color 0.5s',
    '&:hover': {
      background: '#007bff',
      color: '#FFF',
    },
  },
  tablePagination: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: '75px',
  },
  rowsTextField: {
    '& .MuiOutlinedInput-input': {
      padding: '8px',
    },
  },
}))

const TablePaginationActions = ({
  count, page, rowsPerPage, onChangePage, onChangeRows, rowsPerPageOptions,
}) => {
  const classes = useStyles()

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1)
  }

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1)
  }

  const totalPages = Math.ceil(count / rowsPerPage)
  const pagesRange = calculatePagesRange(totalPages + 1, page + 1, 6)
  const pages = Array
    .from({ length: pagesRange.end - pagesRange.start }, (_, i) => pagesRange.start + i)
    .map((v) => (
      <IconButton
        onClick={(event) => onChangePage(event, v - 1)}
        className={classNames(classes.tablePage, page + 1 === v ? classes.tablePageActive : '')}
        key={v}
      >
        {v}
      </IconButton>
    ))

  return (
    <div className={classes.tablePagination}>
      <div>
        <IconButton className={classes.tablePage} onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
          PREV
        </IconButton>
        { pages }
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
          className={classes.tablePage}
        >
          NEXT
        </IconButton>
      </div>
      <div>
        Page
        {' '}
        { page + 1 }
        {' '}
        of
        {' '}
        { totalPages }
        {' '}
        - total items
        {' '}
        { count }
      </div>
      {
        (rowsPerPageOptions && onChangeRows) && (
          <TextField
            className={classes.rowsTextField}
            select
            value={rowsPerPage}
            onChange={onChangeRows}
            SelectProps={{
              MenuProps: {
                className: classes.menu,
              },
            }}
            helperText="Rows per page"
            margin="normal"
            variant="outlined"
          >
            {rowsPerPageOptions.map((v) => (
              <MenuItem key={v} value={v}>
                {v}
              </MenuItem>
            ))}
          </TextField>
        )
      }
    </div>
  )
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  onChangeRows: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  rowsPerPageOptions: PropTypes.array,
}

export default TablePaginationActions
