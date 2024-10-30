export class EventListener<T extends Record<string, any[]>> {
  private _event = {} as Partial<Record<keyof T, Set<Function>>>;
  private _evtOneTime = {} as Partial<Record<keyof T, Set<Function>>>;

  addEventListener<K extends keyof T>(
    evt: K,
    callback: (this: EventListener<T>, ...args: T[K]) => void,
  ) {
    this._addEvtOnMap(this._event, evt, callback);
  }
  removeEventListener<K extends keyof T>(evt: K, callback?: (...args: T[K]) => void) {
    this._removeEvtOnMap(this._event, evt, callback);
    this._removeEvtOnMap(this._evtOneTime, evt, callback);
  }
  removeAllEventListener() {
    this._event = {};
    this._evtOneTime = {};
  }
  addEventListenerAutoRemove<K extends keyof T>(
    evt: K,
    callback: (this: EventListener<T>, remove: () => void, ...args: T[K]) => void,
  ) {
    const remove = () => this.removeEventListener(evt, runCallback as any);
    function runCallback(evt, ...args) {
      args.unshift(evt, remove);
      callback.apply(this, args);
    }
    this.addEventListener(evt, runCallback as any);
  }
  addEventListenerOneTime<K extends keyof T>(
    evt: K,
    callback: (this: EventListener<T>, ...args: T[K]) => void,
  ) {
    this._addEvtOnMap(this._evtOneTime, evt, callback);
  }
  protected _triggerEvent<K extends keyof T>(evt: K);
  protected _triggerEvent<K extends keyof T>(evt: K, ...args: T[K]);
  protected _triggerEvent(evt, ...args) {
    this._triggerEvtOnMap(this._event, evt, args);
    this._triggerEvtOnMap(this._evtOneTime, evt, args);
    delete this._evtOneTime[evt];
  }
  // ----------------------------------------------
  private _addEvtOnMap(map, evt, callback) {
    if (typeof callback !== "function") return;
    const setCallback = this._event[evt] || (map[evt] = new Set());
    setCallback.add(callback);
  }
  private _removeEvtOnMap(map, evt, callback) {
    const setCallback = map[evt];
    if (!setCallback) return;
    if (!callback) return delete map[evt];
    setCallback.delete(callback);
    if (setCallback.size === 0) delete map[evt];
  }
  private _triggerEvtOnMap(map, evt, args) {
    const setCallback = map[evt];
    if (!setCallback) return false;
    if (!setCallback.size) return false;
    for (const callback of setCallback) {
      try {
        callback.apply(this, args);
      } catch (error) {
        console.error(error);
      }
    }
    return true;
  }
}
export const triggerEvent: <T extends Record<string, any[]>, K extends keyof T>(
  obj: EventListener<T>,
  evt: K,
  ...args: T[K]
) => boolean = ((obj, ...args) => {
  return obj._triggerEvent(...args);
}) as any;
