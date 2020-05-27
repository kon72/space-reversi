import { createStyles, withStyles } from '@material-ui/core'
import { WithStyles } from '@material-ui/styles'
import classNames from 'classnames'
import Styles from 'components/styles'
import SVGTranslator from 'components/SvgTranslator'
import * as game from 'game'
import * as React from 'react'

const styles = createStyles({
  turnOut: {
    animationFillMode: 'backwards',
    animation: 'turnOut 150ms cubic-bezier(0.0, 0, 0.2, 1), fadeOut 30ms steps(1)'
  },
  turnIn: {
    animationFillMode: 'backwards',
    animation: 'turnIn 150ms cubic-bezier(0.0, 0, 0.2, 1), fadeIn 30ms steps(1)'
  }
})

interface StoneProps extends WithStyles<typeof styles> {
  cx: number
  cy: number
  r: number
  stone: game.Stone
  turnOver: game.TurnOver
}

class Stone extends React.Component<StoneProps> {
  private prev: number

  constructor (props: Readonly<StoneProps>) {
    super(props)

    this.prev = 0
  }

  render (): JSX.Element {
    const { classes } = this.props

    const animate = this.props.turnOver.isTurnedOver && (this.props.turnOver.random !== this.prev)
    this.prev = this.props.turnOver.random ?? 0

    return (
      <SVGTranslator x={this.props.cx} y={this.props.cy}>
        <circle style={{ animationDelay: `${(this.props.turnOver.turnOverStep ?? 0) * 30}ms` }}
          className={classNames({ [classes.turnOut]: animate })} r={this.props.r}
          fill={this.props.stone === game.Stone.White ? Styles.board.blackStoneColor : Styles.board.whiteStoneColor} />
        <circle style={{ animationDelay: `${(this.props.turnOver.turnOverStep ?? 0) * 30}ms` }}
          className={classNames({ [classes.turnIn]: animate })} r={this.props.r}
          fill={this.props.stone === game.Stone.White ? Styles.board.whiteStoneColor : Styles.board.blackStoneColor} />
      </SVGTranslator>
    )
  }
}

export default withStyles(styles)(Stone)
