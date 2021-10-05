import moment from 'moment'

// eslint-disable-next-line import/prefer-default-export
export const calculatePagesRange = (total, current, display) => {
  let end = total
  let start = 1
  if (display < end) {
    // rounded to the nearest integer smaller
    let beforeNumber = Math.round(display / 2 - 0.5)
    const afterNumber = beforeNumber
    if (display % 2 === 0) {
      beforeNumber -= 1
    }

    if (current <= beforeNumber + 1) {
      end = display
    } else if (current >= (total - afterNumber)) {
      start = total - display + 1
    } else {
      start = current - beforeNumber
      end = current + afterNumber
    }
  }

  return { start, end }
}

export const formatDate = (date) => moment(date).format('YYYY-MM-DD h:mm:ss a')
