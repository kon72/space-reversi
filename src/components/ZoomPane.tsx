import { Box, Button, ButtonGroup, makeStyles, Theme } from '@material-ui/core'
import ZoomInIcon from '@material-ui/icons/ZoomIn'
import ZoomOutIcon from '@material-ui/icons/ZoomOut'
import { eventEmitter } from 'eventEmitter'
import * as React from 'react'

const useStyles = makeStyles((theme: Theme) => ({
  buttonGroup: {
    background: theme.palette.background.paper
  },
  button: {
    padding: 15,
    color: theme.palette.text.secondary
  }
}))

function ZoomPane (): JSX.Element {
  const classes = useStyles()

  const zoomIn = (): void => {
    eventEmitter.emit('SCALE_UP')
  }

  const zoomOut = (): void => {
    eventEmitter.emit('SCALE_DOWN')
  }

  return (
    <Box position="fixed" right={0} bottom={0} mr={2} mb={2}>
      <ButtonGroup className={classes.buttonGroup} orientation="vertical" size="large">
        <Button className={classes.button} onClick={zoomIn} aria-label="zoom in">
          <ZoomInIcon fontSize="large" />
        </Button>
        <Button className={classes.button} onClick={zoomOut} aria-label="zoom out">
          <ZoomOutIcon fontSize="large" />
        </Button>
      </ButtonGroup>
    </Box>
  )
}

export default ZoomPane
