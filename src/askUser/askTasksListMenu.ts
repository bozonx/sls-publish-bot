import TgChat from '../apiTg/TgChat';
import {CANCEL_BTN, CANCEL_BTN_CALLBACK} from '../types/constants';
import {addSimpleStep} from '../helpers/helpers';
import {TaskItem} from '../types/TaskItem';
import moment from 'moment';


export const TASK_ID_CB = 'TASK_ID_CB:';


export async function askTasksListMenu(tgChat: TgChat, onDone: (taskId: string) => void) {
  const taskList = tgChat.app.tasks.getTasksList();
  const tasksIds = Object.keys(taskList);
  const msg = (tasksIds.length) ? tgChat.app.i18n.menu.taskList : tgChat.app.i18n.menu.emptyTaskList;
  const buttons = [
    tasksIds.map((taskId) => {
      return {
        text: makeTaskItmStr(taskList[taskId]),
        callback_data: TASK_ID_CB + taskId,
      }
    }),
    [
      CANCEL_BTN,
    ]
  ];

  await addSimpleStep(tgChat, msg, buttons,async (queryData: string) => {
    if (queryData === CANCEL_BTN_CALLBACK) {
      return tgChat.steps.cancel();
    }
    else if (queryData.indexOf(TASK_ID_CB) === 0) {
      const splat = queryData.split(':');

      onDone(splat[1]);
    }
  });
}


function makeTaskItmStr(task: TaskItem): string {
  let result = moment(task.startTime).format('DD.MM hh:mm')
    + ` ${task.type}`;

  if (task.sn) result += ` sn: ${task.sn}`;

  return result;
}
