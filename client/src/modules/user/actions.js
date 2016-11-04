
export const USER_INIT = 'USER_INIT'
export const USER_FAVE = 'USER_FAVE'
export const USER_UNFAVE = 'USER_UNFAVE'

export const initUser = () => { return { type: USER_INIT } }
export const fave = song => {
  return { type: USER_FAVE, payload: { time: Date.now(), song } }
}
export const unfave = songId => { return { type: USER_UNFAVE, payload: songId } }

