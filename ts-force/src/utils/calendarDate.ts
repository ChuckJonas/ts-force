/** Mapping type & helpers for converting Salesforce Date types into a object that's easier to work with.
 *    The format was chosen to be as compatible as possible with the standard Date object and other popular libraries
*/

export type CalendarDate = { year: number; month: number; date: number; };

/**
*  Creates a new CalendarDate object.
*
* @param {(Date | string | Momentish)} [d] Optional Date, String (in the format "yyyy-mm-dd" where month is 1 based) or Moment.
*   If no value is passed it, will use `new Date()`.
* @returns {CalendarDate}
*/
export const getCalendarDate = (d?: Date | string | Momentish): CalendarDate => {
  if (!d) {
    d = new Date();
  }

  if (d instanceof Date) {
    return { year: d.getFullYear(), month: d.getMonth(), date: d.getDate() };
  } else if (d instanceof Object) {
    if (isMomentish(d)) {
      return { year: d.year(), month: d.month(), date: d.date() };
    }
    throw new Error('Not a valid object.  Must have year(), month(), date() functions');
  } else {
    let parts = d.split('-').map(p => parseInt(p, 10));
    if (parts.length !== 3 || parts.find(p => isNaN(p))) {
      throw new Error('Not a valid CalendarDate string.  Required Format: yyyy-mm-dd');
    }
    return { year: parts[0], month: parts[1] - 1, date: parts[2] };
  }
};

/**
*  Converts a CalendarDate to a Javascript Date obj.
*
* @param {CalendarDate} [d] CalendarDate to convert
* @returns {Date}
*/
export const calendarToDateObj = (d: CalendarDate): Date => {
  if (!d) {
    return null;
  }

  return new Date(d.year, d.month, d.date);
};

/**
*  Converts a CalendarDate to a string in the format "yyyy-mm-dd". (where month is 1 based)
* @param {CalendarDate} [d] CalendarDate to convert
* @returns {Date}
*/
export const calendarToString = (d: CalendarDate): string => {
  if (!d) {
    return null;
  }
  return `${d.year}-${('0' + (d.month + 1)).slice(-2)}-${('0' + d.date).slice(-2)}`;
};

function isMomentish(arg: any): arg is Momentish {
  return arg.year !== undefined && arg.month !== undefined && arg.date !== undefined;
}

// to allow easy parsing from moment.
// Will expand to accommodate other popular libraries if they don't follow this format
interface Momentish {
  year: () => number;
  month: () => number;
  date: () => number;
}
