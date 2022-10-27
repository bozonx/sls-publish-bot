import IndexedEventEmitter from "./IndexedEventEmitter";
import {DEFAULT_WAIT_EVENT_TIMEOUT_SEC} from "../types/consts";


// TODO: remove
export async function waitEvent(
  events: IndexedEventEmitter,
  eventName: string | number,
  cb: (data: any) => Boolean | undefined
): Promise<any> {
  return new Promise((resolve, reject) => {
    const handlerIndex = events.addListener(eventName, (data: any) => {
      const timeout = setTimeout(() => {
        events.removeListener(handlerIndex);
        reject(`Event ${eventName} timout`);
      }, DEFAULT_WAIT_EVENT_TIMEOUT_SEC * 1000);

      try {
        const result = cb(data);

        if (result) {
          clearTimeout(timeout);
          resolve(data);
        }
      }
      catch (e) {
        console.error(e);
      }
    });
  });

}