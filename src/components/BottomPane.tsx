import { Box, makeStyles, SvgIcon, Theme } from '@material-ui/core'
import PanToolOutlinedIcon from '@material-ui/icons/PanToolOutlined'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import * as React from 'react'
import { useDispatch } from 'react-redux'
import { panTool, stoneTool } from 'redux/actions'

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    transform: 'translateX(-50%)'
  },
  toggleButtonGroup: {
    background: theme.palette.background.paper
  }
}))

function BottomPane (): JSX.Element {
  const classes = useStyles()
  const dispatch = useDispatch()

  const [tool, setTool] = React.useState('stone')

  const handleChange = (e: React.MouseEvent<HTMLElement>, newTool: string): void => {
    if (newTool === null) return
    switch (newTool) {
      case 'stone':
        dispatch(stoneTool())
        break
      case 'pan':
        dispatch(panTool())
        break
      default:
        break
    }
    setTool(newTool)
  }

  return (
    <Box className={classes.container} position="fixed" bottom={0} left="50%" mb={2}>
      <ToggleButtonGroup className={classes.toggleButtonGroup} size="large" value={tool} exclusive onChange={handleChange}>
        <ToggleButton value="stone" aria-label="put stone">
          <SvgIcon fontSize="large">
            <path d="M 3 14 L 1 14 C 1 18.967 5.929 23 12 23 C 18.071 23 23 18.967 23 14 L 21 14 C 21 17.863 16.967 21 12 21 C 7.033 21 3 17.863 3 14 Z" fillRule="evenodd" />
            <path d="M 1 10 C 1 5.033 5.929 1 12 1 C 18.071 1 23 5.033 23 10 L 23 10 L 23 14 L 21.855 14 C 20.054 16.962 16.315 19 12 19 C 7.685 19 3.946 16.962 2.145 14 L 1 14 L 1 10 Z  M 3 10 L 3 10 C 3 6.137 7.033 3 12 3 C 16.967 3 21 6.137 21 10 L 21 10 C 21 13.863 16.967 17 12 17 C 7.033 17 3 13.863 3 10 L 3 10 L 3 10 L 3 10 Z" fillRule="evenodd" />
          </SvgIcon>
        </ToggleButton>
        <ToggleButton value="pan" aria-label="pan">
          <PanToolOutlinedIcon fontSize="large" />
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  )
}

export default BottomPane
