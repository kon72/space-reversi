/**
 * Returns the position relative to {element}
 */
export function screenToRelative (x: number, y: number, element: SVGGraphicsElement, svg: SVGSVGElement): DOMPoint {
  const p = svg.createSVGPoint()
  p.x = x
  p.y = y
  return p.matrixTransform(element.getScreenCTM()?.inverse())
}
