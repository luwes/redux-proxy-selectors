import { PLAY, ENDED, TIME_UPDATE, DURATION_UPDATE } from './actionTypes'

export function play() {
  return { type: PLAY }
}

export function ended() {
  return { type: ENDED }
}

export function timeUpdate(time) {
  return { type: TIME_UPDATE, payload: time }
}

export function durationUpdate(duration) {
  return { type: DURATION_UPDATE, payload: duration }
}
