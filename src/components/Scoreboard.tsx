import { Box, Card, List, ListItem, ListItemIcon, ListItemText, makeStyles, SvgIcon, Theme } from '@material-ui/core'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import classNames from 'classnames'
import Styles from 'components/styles'
import { Stone } from 'game'
import * as React from 'react'
import { useSelector } from 'react-redux'
import { State } from 'redux/reducers'

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    display: 'flex'
  },
  arrowIconContainerSettled: {
    display: 'none'
  },
  arrowIcon: {
    transition: `all ${theme.transitions.duration.shorter}ms ${theme.transitions.easing.easeOut}`
  },
  arrowIconDown: {
    marginTop: 'calc(1em + 16px)'
  },
  list: {
    background: 'black'
  },
  listItemText: {
    userSelect: 'none'
  }
}))

function Scoreboard (): JSX.Element {
  const classes = useStyles()
  const turn = useSelector<State, Stone>(state => state.game.turn)
  const whiteCount = useSelector<State, Stone>(state => state.game.whiteCount)
  const blackCount = useSelector<State, Stone>(state => state.game.blackCount)

  return (
    <Box position="fixed" top={0} right={0} mt={2} mr={2}>
      <Card className={classes.card}>
        <Box className={classNames({ [classes.arrowIconContainerSettled]: turn === Stone.Empty })} display="flex" mt={2} mr={-2} mb={2} ml={0}>
          <ArrowRightIcon color="action"
            className={classNames(classes.arrowIcon, { [classes.arrowIconDown]: turn === Stone.Black })} fontSize="large" />
        </Box>
        <List>
          <ListItem>
            <ListItemIcon>
              <SvgIcon fontSize="large">
                <circle cx={12} cy={12} r={11} fill={Styles.board.whiteStoneColor}
                  stroke={Styles.board.blackStoneColor} strokeWidth={0.5} />
              </SvgIcon>
            </ListItemIcon>
            <ListItemText className={classes.listItemText} primary={whiteCount} />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <SvgIcon fontSize="large">
                <circle cx={12} cy={12} r={11} fill={Styles.board.blackStoneColor}
                  stroke={Styles.board.blackStoneColor} strokeWidth={0.5} />
              </SvgIcon>
            </ListItemIcon>
            <ListItemText className={classes.listItemText} primary={blackCount} />
          </ListItem>
        </List>
      </Card>
    </Box>
  )
}

export default Scoreboard
