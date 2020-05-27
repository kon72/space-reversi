interface Node<T> {
  data: T
  next: Node<T> | undefined
}

export default class Queue<T> {
  private _head: Node<T> | undefined
  private _tail: Node<T> | undefined
  private _length: number

  constructor () {
    this._head = undefined
    this._tail = undefined
    this._length = 0
  }

  get length (): number {
    return this._length
  }

  enqueue (value: T): void {
    const newNode: Node<T> = {
      data: value,
      next: undefined
    }

    if (this._tail === undefined) {
      this._head = newNode
      this._tail = newNode
    } else {
      this._tail.next = newNode
      this._tail = newNode
    }

    this._length++
  }

  dequeue (): T {
    if (this._head === undefined) {
      throw new ReferenceError()
    }

    const headData = this._head.data
    this._head = this._head.next

    if (this._head === undefined) {
      this._tail = undefined
    }

    this._length--

    return headData
  }

  empty (): boolean {
    return this.length === 0
  }
}
