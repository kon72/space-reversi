import React from 'react'

interface SVGTranslatorProps extends React.SVGProps<SVGGElement> {
  x?: number
  y?: number
  children: React.ReactNode
}

function SVGTranslator (props: SVGTranslatorProps): JSX.Element {
  const x = props.x ?? 0
  const y = props.y ?? 0
  const p = { ...props, x: undefined, y: undefined }

  return (
    <g transform={`matrix(1, 0, 0, 1, ${x}, ${y})`} {...p}>
      {props.children}
    </g>
  )
}

export default SVGTranslator
