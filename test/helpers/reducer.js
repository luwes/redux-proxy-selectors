import { PLAY, ENDED, TIME_UPDATE, DURATION_UPDATE } from './actionTypes'

const initialState = {
  duration: 100
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case DURATION_UPDATE:
      return {
        ...state,
        duration: action.payload
      }
    default:
      return {
        ...state,
        ui: ui(state.ui, action)
      }
  }
}

function ui(state = {}, action) {
  return {
    ...state,
    video: video(state.video, action)
  }
}

const videoInitialState = {
  paused: true,
  playInitiated: false,
  ended: false,
  currentTime: 0
}

function video(state = videoInitialState, action) {
  switch (action.type) {
    case PLAY:
      return {
        ...state,
        paused: false,
        playInitiated: true,
        ended: false
      }
    case ENDED:
      return {
        ...state,
        paused: true,
        playInitiated: true,
        ended: true
      }
    case TIME_UPDATE:
      return {
        ...state,
        currentTime: action.payload
      }
    default:
      return state
  }
}

const getDuration = state => state.duration

const uiSelector = {
  video: {
    isPlaying(state) {
      return !state.ui.video.paused
    },
    timeUntilEnd(state) {
      return state.duration - state.ui.video.currentTime
    }
  }
}

export { getDuration, uiSelector as ui }
