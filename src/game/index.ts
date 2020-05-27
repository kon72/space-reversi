import { Board } from 'game/board'

const dx = [1, 1, 0, -1, -1, -1, 0, 1]
const dy = [0, 1, 1, 1, 0, -1, -1, -1]

export enum Stone {
  Empty, White, Black
}

export interface Point {
  x: number
  y: number
}

export interface Rect {
  left: number
  top: number
  right: number
  bottom: number
}

export interface CellState {
  x: number
  y: number
  stone: Stone
  turnOver: TurnOver
}

export class TurnOver {
  public readonly isTurnedOver: boolean
  public readonly turnOverStep?: number
  public readonly random?: number

  constructor (isTurnedOver: boolean, turnOverStep?: number) {
    this.isTurnedOver = isTurnedOver
    this.turnOverStep = turnOverStep
    if (isTurnedOver) this.random = Math.random()
  }
}

export function reset (): void {
  board.reset()
  turn = Stone.White
  boundingRect = {
    left: -1, top: -1, right: 1, bottom: 1
  }
  enumerateMarkedCells()
}

export function putStone (x: number, y: number): CellState[] | false {
  if (board.at(x, y) !== Stone.Empty) {
    return false
  }

  const result = new Array<CellState>()

  for (let i = 0; i < 8; i++) {
    const temp = new Array<CellState>()

    for (let j = 1; ; j++) {
      const x1 = x + dx[i] * j
      const y1 = y + dy[i] * j
      const stone = board.at(x1, y1)
      if (stone === Stone.Empty) {
        break
      } if (stone === turn) {
        result.push(...temp)
        break
      } else {
        temp.push({
          x: x1,
          y: y1,
          stone: turn,
          turnOver: new TurnOver(true, j - 1)
        })
      }
    }
  }

  if (result.length === 0) {
    return false
  }

  result.push({
    x: x,
    y: y,
    stone: turn,
    turnOver: new TurnOver(false)
  })
  reflectChanges(result)
  updateBoundingRect(x, y)

  if (isSettled() !== Stone.Empty) {
    turn = Stone.Empty
    markedCells = []
    return result
  }

  changeTurn()
  enumerateMarkedCells()

  if (markedCells.length === 0) {
    changeTurn()
    enumerateMarkedCells()
  }

  return result
}

export function getFilledCells (): CellState[] {
  const filledCells: CellState[] = []

  board.forEachFilledCell((point, stone) => {
    filledCells.push({
      x: point.x,
      y: point.y,
      stone: stone,
      turnOver: new TurnOver(false)
    })
  })

  return filledCells
}

export function getMarkedCells (): Point[] {
  return markedCells
}

export function getWhiteCount (): number {
  return board.whiteCount
}

export function getBlackCount (): number {
  return board.blackCount
}

export function getTurn (): Stone {
  return turn
}

export function getBoundingRect (): Rect {
  return boundingRect
}

export function isSettled (): Stone {
  return isSettledInternal()
}

function enumerateMarkedCells (): void {
  markedCells = []

  board.forEachAdjacentEmptyCell(point => {
    if (canPutStone(point.x, point.y)) {
      markedCells.push(point)
    }
  })
}

function reflectChanges (changes: CellState[]): void {
  changes.forEach(change => {
    board.set(change.x, change.y, change.stone)
  })
}

function updateBoundingRect (x: number, y: number): void {
  boundingRect.left = Math.min(x, boundingRect.left)
  boundingRect.right = Math.max(x + 1, boundingRect.right)
  boundingRect.top = Math.min(y, boundingRect.top)
  boundingRect.bottom = Math.max(y + 1, boundingRect.bottom)
}

function changeTurn (): void {
  if (turn === Stone.White) {
    turn = Stone.Black
  } else {
    turn = Stone.White
  }
}

function canPutStone (x: number, y: number): boolean {
  if (board.at(x, y) !== Stone.Empty) {
    return false
  }

  for (let i = 0; i < 8; i++) {
    let inOneDirection = false

    for (let j = 1; ; j++) {
      const x1 = x + dx[i] * j
      const y1 = y + dy[i] * j
      const stone = board.at(x1, y1)
      if (stone === Stone.Empty) {
        inOneDirection = false
        break
      } if (stone === turn) {
        break
      } else {
        inOneDirection = true
      }
    }

    if (inOneDirection) return true
  }

  return false
}

function isSettledInternal (): Stone {
  if (board.blackCount === 0) {
    return Stone.White
  } else if (board.whiteCount === 0) {
    return Stone.Black
  } else {
    return Stone.Empty
  }
}

const board = new Board()
let turn: Stone
let boundingRect: Rect
let markedCells: Point[]

reset()
