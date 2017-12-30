import { createStore } from 'redux'
import { createProxySelectors } from '../'
import { play } from './helpers/actionCreators'
import reducer, * as selectors from './helpers/reducer'

describe('Index', () => {
  describe('createProxySelectors', () => {
    it('returns a function', () => {
      expect(createProxySelectors()).toBeInstanceOf(Function)
    })

    it('returns the selector as a getter property on the state', () => {
      const store = createStore(reducer, createProxySelectors(selectors))

      expect(store.getState().getDuration).toBe(100)

      store.dispatch(play())
      expect(store.getState().ui.video.isPlaying).toBe(true)
    })
  })
})
