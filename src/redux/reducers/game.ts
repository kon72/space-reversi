import { CellState, getBlackCount, getBoundingRect, getFilledCells, getMarkedCells, getTurn, getWhiteCount, Point, putStone, Rect, reset, Stone, TurnOver } from 'game'
import { Action } from 'redux'
import { PointAction } from 'redux/actions'

interface GameState {
  turn: Stone
  boundingRect: Rect
  whiteCount: number
  blackCount: number
  cells: CellState[]
  markedCells: Point[]
}

const initialState: GameState = {
  turn: Stone.White,
  boundingRect: {
    left: 0, top: 0, right: 0, bottom: 0
  },
  whiteCount: 0,
  blackCount: 0,
  cells: [],
  markedCells: []
}

const gameReducer = (state = initialState, action: Action<string>): GameState => {
  switch (action.type) {
    case 'GAME_RESET': {
      reset()
      return {
        turn: getTurn(),
        boundingRect: getBoundingRect(),
        whiteCount: getWhiteCount(),
        blackCount: getBlackCount(),
        cells: getFilledCells(),
        markedCells: getMarkedCells()
      }
    }
    case 'GAME_PUT_STONE': {
      const pointAction = action as PointAction
      const updatedCells = putStone(pointAction.x, pointAction.y)
      if (updatedCells === false) return state
      const newCellsSet = new Set(updatedCells.map(cell => `${cell.x} ${cell.y}`))
      return {
        turn: getTurn(),
        boundingRect: getBoundingRect(),
        whiteCount: getWhiteCount(),
        blackCount: getBlackCount(),
        cells: [
          ...updatedCells,
          ...state.cells.filter(cell => !newCellsSet.has(`${cell.x} ${cell.y}`)).map(cell => {
            // cell.isTurnedOver = false
            // delete cell.turnOverStep
            cell.turnOver = new TurnOver(false)
            return cell
          })
        ],
        markedCells: getMarkedCells()
      }
    }
    default: {
      return state
    }
  }
}

export default gameReducer
