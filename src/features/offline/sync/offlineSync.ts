import { store } from '../../../store/store';
import { clearQueue } from '../slices/offlineSlice';

export function setupOfflineSync() {
  window.addEventListener('online', () => {
    const state = store.getState() as any;
    const queue: any[] = state.offline.queue;

    queue.forEach((req) => {
      const actionCreator = req.type;
      if (actionCreator) {
        store.dispatch(actionCreator(req.payload));
      }
    });

    store.dispatch(clearQueue());
  });
}
