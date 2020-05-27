import Board from 'components/Board'
import BottomPane from 'components/BottomPane'
import Scoreboard from 'components/Scoreboard'
import ZoomPane from 'components/ZoomPane'
import React from 'react'

function App (): JSX.Element {
  return (
    <React.Fragment>
      <Board />
      <Scoreboard />
      <ZoomPane />
      <BottomPane />
    </React.Fragment>
  )
}

export default App
