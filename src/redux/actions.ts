import { Action } from 'redux'

export interface PointAction extends Action<string> {
  x: number
  y: number
}

export const stoneTool = (): Action<string> => ({
  type: 'BOARD_TOOL_STONE'
})

export const panTool = (): Action<string> => ({
  type: 'BOARD_TOOL_PAN'
})

export const resetGame = (): Action<string> => ({
  type: 'GAME_RESET'
})

export const putStone = (x: number, y: number): PointAction => ({
  type: 'GAME_PUT_STONE',
  x,
  y
})
