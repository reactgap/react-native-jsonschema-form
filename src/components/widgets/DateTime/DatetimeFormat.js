
import moment from "moment"
const DateFormat = 'DD/MM/YYYY'
export const convertDateToString = (date: Date, format: string) => {
  if (date) {
    const formatDate = format || DateFormat
    const dateMoment = moment(date, formatDate)
    return dateMoment.format(formatDate)
  }
  return null
}

export const isValidDate = (d: Date) => {
  return d instanceof Date && !isNaN(d);
}

export const parserStringToDate = (dateString) => {
  if (dateString) {
    return moment(dateString, DateFormat).toDate()
  }
  return null
}