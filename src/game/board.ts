import Queue from 'utils/queue'

const dx = [1, 1, 0, -1, -1, -1, 0, 1]
const dy = [0, 1, 1, 1, 0, -1, -1, -1]

enum Stone {
  Empty, White, Black
}

interface Point {
  x: number
  y: number
}

export class Board {
  //
  //     4  8
  //  5  0  2  9
  //  6  1  3 10
  //     7 11
  //
  private cells: Stone[]

  private _whiteCount: number
  private _blackCount: number

  constructor () {
    this.cells = new Array(16)
    this._whiteCount = 0
    this._blackCount = 0
    this.initialize()
  }

  reset (): void {
    this.cells = new Array(16)
    this._whiteCount = 0
    this._blackCount = 0
    this.initialize()
  }

  at (x: number, y: number): Stone {
    return this.cells[this.pointToIndex(x, y)] ?? Stone.Empty
  }

  set (x: number, y: number, cell: Stone): void {
    switch (this.at(x, y)) {
      case Stone.White:
        this._whiteCount--
        break
      case Stone.Black:
        this._blackCount--
        break
      default:
        break
    }

    switch (cell) {
      case Stone.White:
        this._whiteCount++
        break
      case Stone.Black:
        this._blackCount++
        break
      default:
        break
    }

    this.cells[this.pointToIndex(x, y)] = cell
  }

  forEachFilledCell (callbackfn: (point: Point, stone: Stone) => void, thisArg?: unknown): void {
    this.cells.forEach((stone, index) => {
      callbackfn(this.indexToPoint(index), stone)
    }, thisArg)
  }

  forEachAdjacentEmptyCell (callbackfn: (point: Point) => void, thisArg?: unknown): void {
    if (thisArg !== undefined) {
      callbackfn = callbackfn.bind(thisArg)
    }

    const visited = new Set<number>()
    visited.add(this.pointToIndex(0, 0))
    const queue = new Queue<Point>()
    queue.enqueue({ x: 0, y: 0 })

    while (!queue.empty()) {
      const point = queue.dequeue()

      for (let i = 0; i < 8; i++) {
        const next: Point = { x: point.x + dx[i], y: point.y + dy[i] }
        const nextIndex = this.pointToIndex(next.x, next.y)
        if (visited.has(nextIndex)) continue
        visited.add(nextIndex)
        if (this.cells[nextIndex] === undefined) {
          callbackfn(next)
        } else {
          queue.enqueue(next)
        }
      }
    }
  }

  get whiteCount (): number {
    return this._whiteCount
  }

  get blackCount (): number {
    return this._blackCount
  }

  private initialize (): void {
    this.set(-1, -1, Stone.White)
    this.set(-1, 0, Stone.Black)
    this.set(0, -1, Stone.Black)
    this.set(0, 0, Stone.White)
  }

  private pointToIndex (x: number, y: number): number {
    const n = Math.abs(x + 0.5) + Math.abs(y + 0.5)
    return 2 * n * n + (x >= 0 ? 1 : -1) * n + y
  }

  private indexToPoint (index: number): Point {
    let n = 1
    while (index >= 2 * n * (n + 1)) {
      n++
    }
    index -= 2 * (n - 1) * n
    const m = Math.floor(index / n)
    return {
      x: ((m === 1 || m === 2) ? (index - n * 2) : (-index - 1)) + (m === 3 ? n * 4 : 0),
      y: index - n * (m <= 1 ? 1 : 3)
    }
  }
}
