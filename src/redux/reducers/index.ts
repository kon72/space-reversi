import { Action, combineReducers, StateFromReducersMapObject } from 'redux'
import boardReducer from 'redux/reducers/board'
import gameReducer from 'redux/reducers/game'

const allReducersMapObject = {
  board: boardReducer,
  game: gameReducer
}

export type State = StateFromReducersMapObject<typeof allReducersMapObject>

export const allReducers = combineReducers<State, Action<string>>(allReducersMapObject)
