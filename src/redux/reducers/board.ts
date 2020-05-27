import { Action } from 'redux'
import { Tool } from 'redux/tool'

const initialState = {
  tool: Tool.Stone
}

type boardState = typeof initialState

const boardReducer = (state = initialState, action: Action<string>): boardState => {
  switch (action.type) {
    case 'BOARD_TOOL_STONE': {
      state = {
        ...state,
        tool: Tool.Stone
      }
      return state
    }
    case 'BOARD_TOOL_PAN': {
      state = {
        ...state,
        tool: Tool.Pan
      }
      return state
    }
    default: {
      return state
    }
  }
}

export default boardReducer
