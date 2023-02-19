import App from '../App.js';
import {TaskItem} from '../types/TaskItem.js';
import {calcSecondsToDate} from '../lib/common.js';
import {MAX_TIMEOUT_SECONDS} from '../types/constants.js';
import {makeTaskDetails} from './makeTaskDetails.js';


export async function validateTask(task: TaskItem, app: App): Promise<string | undefined> {
  // seconds from now to start time
  const secondsToPublish = calcSecondsToDate(task.startTime)

  if (secondsToPublish > MAX_TIMEOUT_SECONDS) {
    return `Too big timeout number! ${task.startTime} is ${secondsToPublish} seconds. `
      + `Max is (${MAX_TIMEOUT_SECONDS}) seconds (24 days)`;
  }

  if (secondsToPublish <= app.appConfig.expiredTaskOffsetSec) {
    return `The task has expired time to publish - ${secondsToPublish} seconds.\n`
      + `The minimum time is ${app.appConfig.expiredTaskOffsetSec} seconds.\n`
      + `Task:\n`
      + await makeTaskDetails(task, app);
  }

  // TODO: validate other params
}
