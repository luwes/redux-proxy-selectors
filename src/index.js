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
      cachedState = defineSelectors(oldState, store.getState(), map)
      return cachedState
    }

    return { ...store, dispatch, getState }
  }
}

function defineSelectors(oldState, newState, map) {
  for (const path in map) {
    const oldSlice = get(oldState, path)
    const newSlice = get(newState, path)
    // If the slice didn't get updated the defined props are still there.
    if (newSlice && oldSlice !== newSlice) {
      const selectors = map[path]
      for (const name in selectors) {
        const selector = selectors[name]
        if (!Object.getOwnPropertyDescriptor(newSlice, name)) {
          Object.defineProperty(newSlice, name, {
            get: () => selector(newState)
          })
        }
      }
    }
  }
  return newState
}

function generateSelectorsMap(obj, keys = []) {
  return Object.keys(obj).reduce((acc, key) => {
    if (typeof obj[key] === 'function' && key !== 'default') {
      const path = keys.join('.')
      const pathObj = acc[path] || {}
      pathObj[key] = obj[key]
      return Object.assign(acc, { [path]: pathObj })
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
  const keys = path.split('.')
  for (let i = 0; i < keys.length; i++) {
    if (typeof obj === 'undefined') {
      return defaultValue
    }
    obj = obj[keys[i]]
  }
  return obj
}
