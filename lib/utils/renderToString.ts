import { renderToStaticMarkup } from 'react-dom/server'
import { ReactElement } from 'react'

export function renderToString(element: ReactElement): string {
  return renderToStaticMarkup(element)
}