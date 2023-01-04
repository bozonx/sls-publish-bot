import {TaskItem} from '../types/TaskItem.js';
import moment from 'moment/moment.js';
import {PRINT_SHORT_DATE_TIME_FORMAT} from '../types/constants.js';
import ru from '../I18n/ru.js';


export function makeTaskDetails(task: TaskItem, i18n: typeof ru): string {
  let result = `${i18n.commonPhrases.type}: ${task.type}\n`
    + `${i18n.commonPhrases.date}: ${moment(task.startTime).format(PRINT_SHORT_DATE_TIME_FORMAT)}\n`;

  if (task.sn) {
    result += `${i18n.commonPhrases.sn}: ${task.sn}`;
  }

  // TODO: add full task details

  return result;
}
