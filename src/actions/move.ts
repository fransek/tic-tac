'use server'

import { Board, Player, Tile, getWinner, winningCombos } from '~/utils'

export const getAIMove = async (board: Board): Promise<Board> => {
  const bestMoveIndex = getBestMove(board)
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

const getBestMove = (board: Board): number => {
  const scores: Record<string, number> = {}

  const simMoves = (
    currentBoard: Board,
    player: Player,
    moves: number[] = []
  ) => {
    const topMoves = getTopCandidates(currentBoard, player)
    for (const { index } of topMoves) {
      const newBoard = [...currentBoard]
      newBoard[index] = player
      const newMoves = [...moves, index]
      const winner = getWinner(newBoard)
      if (!winner) {
        simMoves(newBoard, player === 'X' ? 'O' : 'X', newMoves)
      } else if (winner === 'X') {
        scores[newMoves[0]] = (scores[newMoves[0]] || 0) - 1 / newMoves.length
      } else {
        scores[newMoves[0]] = (scores[newMoves[0]] || 0) + 1 / newMoves.length
      }
    }
  }

  simMoves(board, 'O')

  const randomizedScores = randomizeArray(Object.keys(scores))

  return parseInt(
    randomizedScores.reduce((a, b) => (scores[a] > scores[b] ? a : b))
  )
}

const getHeuristicBoardScore = (board: Board, player: Player) => {
  const opponent = player === 'X' ? 'O' : 'X'
  let score = 0
  const baseScores = [1, 0, 1, 0, 2, 0, 1, 0, 1]

  board.forEach((tile, index) => {
    if (tile === player) {
      score += baseScores[index]
    } else if (tile === opponent) {
      score -= baseScores[index]
    }
  })

  for (const combo of winningCombos) {
    const playerCount = getCount(combo, board, opponent)
    const opponentCount = getCount(combo, board, player)
    const emptyCount = getCount(combo, board, null)
    if (opponentCount === 3) {
      score += 100
    } else if (opponentCount === 2 && emptyCount === 1) {
      score += 25
    } else if (playerCount === 2 && emptyCount === 1) {
      score -= 50
    }
  }
  return score
}

const getTopCandidates = (board: Board, player: Player) => {
  let highestScore = -Infinity
  const possibleMoves = getEmptyIndices(board)

  const moveScores = possibleMoves.map((index) => {
    const newBoard = [...board]
    newBoard[index] = player
    const score = getHeuristicBoardScore(newBoard, player)
    if (score > highestScore) {
      highestScore = score
    }
    return { index, score }
  })

  return moveScores
    .filter(({ score }) => score >= highestScore)
    .toSorted((a, b) => b.score - a.score)
}

const getCount = (combo: number[], board: Board, player: Tile) =>
  combo.reduce((acc, index: number) => {
    return board[index] === player ? acc + 1 : acc
  }, 0)

const randomizeArray = (array: any[]) => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}
