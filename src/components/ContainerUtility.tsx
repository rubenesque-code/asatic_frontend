import { ReactElement } from 'react'
import { useMeasure } from 'react-use'
import { TwStyle } from 'twin.macro'

export function ContainerWidth({
  children,
  styles: style,
}: {
  children: (width: number) => ReactElement | null
  styles?: TwStyle
}) {
  const [ref, { width }] = useMeasure<HTMLDivElement>()

  return (
    <div ref={ref} style={style}>
      {width ? children(width) : null}
    </div>
  )
}
