import * as React from 'react'

export interface TetrisConfig {
  width: number
}

export interface Props {
  config?: TetrisConfig
}

export const Tetris: React.StatelessComponent<Props> = (props: Props) => {
  return (
    <div>tetris</div>
  )
}
