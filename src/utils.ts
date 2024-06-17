export type Tile = 'X' | 'O' | null
export type Board = Tile[]

export const getWinner = (board: Board): Tile | 'draw' => {
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (const [a, b, c] of winningCombos) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]
    }
  }
  if (board.every((tile) => tile !== null)) {
    return 'draw'
  }
  return null
}

export const getEmptyBoard = (): Board => Array(9).fill(null)
