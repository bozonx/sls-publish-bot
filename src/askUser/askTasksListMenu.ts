import TgChat from '../apiTg/TgChat';
import {CANCEL_BTN, CANCEL_BTN_CALLBACK, PRINT_SHORT_DATE_TIME_FORMAT} from '../types/constants';
import {addSimpleStep} from '../helpers/helpers';
import {TaskItem} from '../types/TaskItem';
import moment from 'moment';


const TASK_ID_CB = 'TASK_ID_CB:';

export const TASK_LIST_ACTIONS = {
  DELETE_POST: 'DELETE_POST',
  PIN_POST: 'PIN_POST',
  UNPIN_POST: 'UNPIN_POST',
  FINISH_POLL: 'FINISH_POLL',
};


export async function askTasksListMenu(tgChat: TgChat, onDone: (taskId?: string, action?: string) => void) {
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
      {
        text: tgChat.app.i18n.buttons.deletePost,
        callback_data: TASK_LIST_ACTIONS.DELETE_POST,
      },
      {
        text: tgChat.app.i18n.buttons.finishPoll,
        callback_data: TASK_LIST_ACTIONS.FINISH_POLL,
      },
    ],
    [
      {
        text: tgChat.app.i18n.buttons.pinPost,
        callback_data: TASK_LIST_ACTIONS.PIN_POST,
      },
      {
        text: tgChat.app.i18n.buttons.unpinPost,
        callback_data: TASK_LIST_ACTIONS.UNPIN_POST,
      },
    ],
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
    else if (Object.keys(TASK_LIST_ACTIONS).includes(queryData)) {
      onDone(undefined, queryData);
    }
  });
}


function makeTaskItmStr(task: TaskItem): string {
  let result = moment(task.startTime).format(PRINT_SHORT_DATE_TIME_FORMAT)
    + ` ${task.type}`;

  if (task.sn) result += ` in ${task.sn}`;

  return result;
}
