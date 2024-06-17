'use server'

import { Board } from '~/utils'

export const getAIMove = async (board: Board): Promise<Board> => {
  const emptyIndices = getEmptyIndices(board)
  const bestMoveIndex = getBestMove(emptyIndices)
  const newBoard = [...board]
  newBoard[bestMoveIndex] = 'O'
  return newBoard
}

const getEmptyIndices = (board: Board): number[] => {
  return board.reduce((acc: number[], tile, index) => {
    if (tile === null) {
      acc.push(index)
    }
    return acc
  }, [])
}

const getBestMove = (indices: number[]): number => {
  return indices[Math.floor(Math.random() * indices.length)]
}
