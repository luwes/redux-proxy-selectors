export function createProxySelectors(selectors = {}) {
  const map = generateSelectorsMap(selectors)

  return createStore => (...args) => {
    const store = createStore(...args)
    let cachedState = getState()
    let oldState

    function dispatch(action) {
      oldState = cachedState
      cachedState = null
      return store.dispatch(action)
    }

    function getState() {
      if (cachedState) {
        return cachedState
      }
      cachedState = createSelectors(oldState, store.getState(), map)
      return cachedState
    }

    return { ...store, dispatch, getState }
  }
}

function createSelectors(oldState, newState, map) {
  for (const key in map) {
    const value = map[key]
    if (typeof value === 'function') {
      defineSelector(newState, key, value, newState)
    } else if (typeof value === 'object') {
      const oldSlice = get(oldState, key)
      const newSlice = get(newState, key)
      // If the slice didn't get updated the defined props are still there.
      if (oldSlice !== newSlice) {
        for (const method in value) {
          defineSelector(newSlice, method, value[method], newState)
        }
      }
    }
  }
  return newState
}

function defineSelector(target, property, selector, state) {
  if (!Object.getOwnPropertyDescriptor(target, property)) {
    Object.defineProperty(target, property, {
      get: () => selector(state)
    })
  }
}

function generateSelectorsMap(obj, keys = []) {
  return Object.keys(obj).reduce((acc, key) => {
    if (typeof obj[key] === 'function' && key !== 'default') {
      const path = keys.join('.')
      if (path) {
        const pathObj = acc[path] || {}
        pathObj[key] = obj[key]
        return Object.assign(acc, { [path]: pathObj })
      }
      return  Object.assign(acc, { [key]: obj[key] })
    }
    if (typeof obj[key] === 'object') {
      return Object.assign(
        acc,
        generateSelectorsMap(obj[key], keys.concat(key))
      )
    }
    return acc
  }, {})
}

function get(obj, path, defaultValue) {
  if (typeof obj === 'undefined') {
    return defaultValue
  }

  const keys = path.split('.')
  for (let i = 0; i < keys.length; i++) {
    if (typeof obj === 'undefined') {
      return defaultValue
    }
    obj = obj[keys[i]]
  }

  return obj[path] || obj
}
