import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import clamp from 'clamp'
import classNames from 'classnames'
import Stone from 'components/Stone'
import Styles from 'components/styles'
import SVGTranslator from 'components/SvgTranslator'
import { eventEmitter } from 'eventEmitter'
import * as React from 'react'
import EventListener from 'react-event-listener'
import { connect } from 'react-redux'
import { Action } from 'redux'
import { putStone } from 'redux/actions'
import { State } from 'redux/reducers'
import { Tool } from 'redux/tool'
import { ResizeObserver } from 'resize-observer'
import { screenToRelative } from 'utils/svg'

const styles = createStyles({
  boardContainer: {
    width: '100%',
    height: '100%'
  },
  board: {
    display: 'block',
    position: 'absolute'
  },
  grabCursor: {
    cursor: 'grab'
  },
  grabbingCursor: {
    cursor: 'grabbing'
  }
})

const scaleStep = [0.125, 0.17, 0.25, 0.33, 0.5, 0.67, 0.75, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5]

interface BoardProps extends State, DispatchProps, WithStyles<typeof styles> {
}

interface DispatchProps {
  dispatchPutStone: (x: number, y: number) => void
}

const mapStateToProps = (state: State): State => ({ ...state })

const mapDispatchToProps = (dispatch: React.Dispatch<Action<string>>): DispatchProps => ({
  dispatchPutStone: (x, y) => dispatch(putStone(x, y))
})

interface BoardState {
  width: number
  height: number
  scrollX: number
  scrollY: number
  scale: number
  isGrabbing: boolean
}

class Board extends React.Component<BoardProps, BoardState> {
  private readonly resizeObserver: ResizeObserver
  private readonly boardContainerRef: React.RefObject<HTMLDivElement>
  private readonly gRef: React.RefObject<SVGSVGElement>
  private readonly svgRef: React.RefObject<SVGSVGElement>

  private scaleIndex: number

  private canTouch: boolean
  private grabbingPointerId: number
  private pointerDownX: number
  private pointerDownY: number
  private prevScrollX: number
  private prevScrollY: number

  constructor (props: Readonly<BoardProps>) {
    super(props)

    this.boardContainerRef = React.createRef()
    this.gRef = React.createRef()
    this.svgRef = React.createRef()
    this.resizeObserver = new ResizeObserver(entries => {
      this.resize(entries[0].contentRect.width, entries[0].contentRect.height)
    })

    this.scaleIndex = 9

    this.canTouch = false
    this.grabbingPointerId = 0
    this.pointerDownX = 0
    this.pointerDownY = 0
    this.prevScrollX = 0
    this.prevScrollY = 0

    this.onWheelOnContainer = this.onWheelOnContainer.bind(this)
    this.onClick = this.onClick.bind(this)
    this.onTouchStartOnWindow = this.onTouchStartOnWindow.bind(this)
    this.onTouchMoveOnWindow = this.onTouchMoveOnWindow.bind(this)
    this.onPointerDownOnContainer = this.onPointerDownOnContainer.bind(this)
    this.onPointerMoveOnWindow = this.onPointerMoveOnWindow.bind(this)
    this.onPointerUpOrCancelOnWindow = this.onPointerUpOrCancelOnWindow.bind(this)

    this.state = {
      width: 0,
      height: 0,
      scrollX: 0,
      scrollY: 0,
      scale: 1,
      isGrabbing: false
    }
  }

  componentDidMount (): void {
    if (this.boardContainerRef.current !== null) {
      this.resizeObserver.observe(this.boardContainerRef.current)
    }

    eventEmitter.on('SCALE_UP', this.scaleUp.bind(this))
    eventEmitter.on('SCALE_DOWN', this.scaleDown.bind(this))
  }

  resize (width: number, height: number): void {
    this.setState((prevState, props) => ({
      width: width,
      height: height,
      scrollX: prevState.scrollX + (width - prevState.width) / 2,
      scrollY: prevState.scrollY + (height - prevState.height) / 2
    }), () => {
      this.scrollTo(this.state.scrollX, this.state.scrollY)
    })
  }

  scrollTo (x: number, y: number): void {
    const minX = -(this.props.game.boundingRect.right + 1) * this.getActualCellSize()
    const maxX = this.state.width + (-this.props.game.boundingRect.left + 1) * this.getActualCellSize()
    const minY = -(this.props.game.boundingRect.bottom + 1) * this.getActualCellSize()
    const maxY = this.state.height + (-this.props.game.boundingRect.top + 1) * this.getActualCellSize()
    const hMargin = this.state.width * 0.1
    const vMargin = this.state.height * 0.1
    this.setState((prevState, props) => ({
      scrollX: clamp(x, minX + hMargin, maxX - hMargin),
      scrollY: clamp(y, minY + vMargin, maxY - vMargin)
    }))
  }

  scaleUp (centerX?: number, centerY?: number): void {
    this.scaleIndex = clamp(this.scaleIndex + 1, 0, scaleStep.length - 1)
    this.setScale(scaleStep[this.scaleIndex], centerX ?? 0, centerY ?? 0)
  }

  scaleDown (centerX?: number, centerY?: number): void {
    this.scaleIndex = clamp(this.scaleIndex - 1, 0, scaleStep.length - 1)
    this.setScale(scaleStep[this.scaleIndex], centerX ?? 0, centerY ?? 0)
  }

  setScale (scale: number, centerX: number, centerY: number): void {
    const x = centerX * scale / this.state.scale - (centerX - this.state.scrollX)
    const y = centerY * scale / this.state.scale - (centerY - this.state.scrollY)
    this.setState((prevState, props) => ({
      scale: scale,
      scrollX: x,
      scrollY: y
    }))
  }

  onClick (e: React.MouseEvent<SVGGElement>): void {
    if (this.gRef.current !== null && this.svgRef.current !== null && this.props.board.tool === Tool.Stone) {
      const p = screenToRelative(e.clientX, e.clientY, this.gRef.current, this.svgRef.current)
      const cell = this.pixelToCellIndex(p.x, p.y)
      this.props.dispatchPutStone(cell[0], cell[1])
    }
  }

  onWheelOnContainer (e: React.WheelEvent<HTMLDivElement>): void {
    const x = this.state.scrollX - e.clientX
    const y = this.state.scrollY - e.clientY

    if (e.deltaY < 0) this.scaleUp(x, y)
    else this.scaleDown(x, y)
  }

  onTouchStartOnWindow (e: TouchEvent): void {
    this.canTouch = true
  }

  onTouchMoveOnWindow (e: TouchEvent): void {
    if (this.state.isGrabbing) {
      if (e.touches.length === 1) {
        const dx = e.touches[0].screenX - this.pointerDownX
        const dy = e.touches[0].screenY - this.pointerDownY
        this.scrollTo(this.prevScrollX + dx, this.prevScrollY + dy)
      } else {
        this.setState((prevState, props) => ({ isGrabbing: false }))
      }
    }
  }

  onPointerDownOnContainer (e: React.PointerEvent<HTMLDivElement>): void {
    if (!this.state.isGrabbing && (this.props.board.tool === Tool.Pan || e.button === 1)) {
      this.setState((prevState, props) => ({ isGrabbing: true }))
      this.grabbingPointerId = e.pointerId
      this.pointerDownX = e.screenX
      this.pointerDownY = e.screenY
      this.prevScrollX = this.state.scrollX
      this.prevScrollY = this.state.scrollY
    }
  }

  onPointerMoveOnWindow (e: PointerEvent): void {
    if (this.canTouch) return

    if (this.state.isGrabbing) {
      const dx = e.screenX - this.pointerDownX
      const dy = e.screenY - this.pointerDownY
      this.scrollTo(this.prevScrollX + dx, this.prevScrollY + dy)
    }
  }

  onPointerUpOrCancelOnWindow (e: PointerEvent): void {
    this.setState((prevState, props) => ({ isGrabbing: false }))
  }

  render (): JSX.Element {
    const { classes, board } = this.props

    return (
      <div ref={this.boardContainerRef}
        className={classNames(classes.boardContainer, {
          [classes.grabCursor]: board.tool === Tool.Pan && !this.state.isGrabbing,
          [classes.grabbingCursor]: this.state.isGrabbing
        })}
        onPointerDown={this.onPointerDownOnContainer}
        onWheel={this.onWheelOnContainer}>
        <EventListener target="window"
          onTouchStart={this.onTouchStartOnWindow}
          onTouchMove={this.onTouchMoveOnWindow}
          onPointerMove={this.onPointerMoveOnWindow}
          onPointerUp={this.onPointerUpOrCancelOnWindow}
          onPointerLeave={this.onPointerUpOrCancelOnWindow}
          onPointerCancel={this.onPointerUpOrCancelOnWindow}/>
        <svg className={classes.board} xmlns="http://www.w3.org/2000/svg"
          width={this.state.width} height={this.state.height} ref={this.svgRef}>
          <SVGTranslator x={this.state.scrollX} y={this.state.scrollY}>
            <g ref={this.gRef} onClick={this.onClick}>
              {this.renderBackground()}
              {this.renderBorders()}
              {this.renderStones()}
              {this.renderHints()}
            </g>
          </SVGTranslator>
        </svg>
      </div>
    )
  }

  private pixelToCellIndex (x: number, y: number): [number, number] {
    return [
      Math.floor(x / this.getActualCellSize()),
      Math.floor(y / this.getActualCellSize())
    ]
  }

  private getActualCellSize (): number {
    return Styles.board.cellSize * this.state.scale
  }

  private getActualHintSize (): number {
    return Styles.board.hintSize * this.state.scale
  }

  private renderBackground (): JSX.Element {
    const { game } = this.props

    return <rect x={(game.boundingRect.left - 1) * this.getActualCellSize()}
      y={(game.boundingRect.top - 1) * this.getActualCellSize()}
      width={(game.boundingRect.right - game.boundingRect.left + 2) * this.getActualCellSize()}
      height={(game.boundingRect.bottom - game.boundingRect.top + 2) * this.getActualCellSize()}
      fill={Styles.board.backgoundColor} />
  }

  private renderBorders (): JSX.Element[] {
    const { game } = this.props
    const borders: JSX.Element[] = []
    const x0 = (game.boundingRect.left - 1) * this.getActualCellSize()
    const y0 = (game.boundingRect.top - 1) * this.getActualCellSize()
    const w = (game.boundingRect.right - game.boundingRect.left + 2) * this.getActualCellSize()
    const h = (game.boundingRect.bottom - game.boundingRect.top + 2) * this.getActualCellSize()

    for (let i = 0; i <= (game.boundingRect.bottom - game.boundingRect.top + 2); i++) {
      const y = i * this.getActualCellSize()
      borders.push(<line key={`h${i}`} x1={x0} y1={y0 + y} x2={x0 + w} y2={y0 + y}
        stroke={Styles.board.borderColor} strokeWidth={1} />)
    }
    for (let i = 0; i <= (game.boundingRect.right - game.boundingRect.left + 2); i++) {
      const x = i * this.getActualCellSize()
      borders.push(<line key={`v${i}`} x1={x0 + x} y1={y0} x2={x0 + x} y2={y0 + h}
        stroke={Styles.board.borderColor} strokeWidth={1} />)
    }

    return borders
  }

  private renderStones (): JSX.Element[] {
    const { game } = this.props

    return game.cells.map(cell => {
      return <Stone key={`${cell.x} ${cell.y}`}
        cx={(cell.x + 0.5) * this.getActualCellSize()}
        cy={(cell.y + 0.5) * this.getActualCellSize()}
        r={Styles.board.stoneRadius * this.state.scale}
        stone={cell.stone}
        turnOver={cell.turnOver}/>
    })
  }

  private renderHints (): JSX.Element[] {
    const { game } = this.props

    return game.markedCells.map((point, i) => {
      return <rect key={i}
        x={(point.x + 0.5) * this.getActualCellSize() - this.getActualHintSize() / 2}
        y={(point.y + 0.5) * this.getActualCellSize() - this.getActualHintSize() / 2}
        width={this.getActualHintSize()}
        height={this.getActualHintSize()}
        fill={Styles.board.hintColor} />
    })
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Board))
