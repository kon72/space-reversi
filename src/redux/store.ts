import { Action, CombinedState, createStore, Store, StoreEnhancer } from 'redux'
import { allReducers, State } from 'redux/reducers'

let store: Store<CombinedState<State>, Action<string>>

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: () => StoreEnhancer
  }
}

export function initialize (): Store<CombinedState<State>, Action<string>> {
  store = createStore(
    allReducers,
    '__REDUX_DEVTOOLS_EXTENSION__' in window ? window.__REDUX_DEVTOOLS_EXTENSION__() : undefined
  )
  return store
}
