import { For, Show, createSignal } from 'solid-js'
import { getAIMove } from '~/actions/move'
import { Board, Tile, getEmptyBoard, getWinner } from '~/utils'

export default function Home() {
  const [board, setBoard] = createSignal<Board>(getEmptyBoard())
  const [isPlayersTurn, setIsPlayersTurn] = createSignal(true)
  const [winner, setWinner] = createSignal<Tile | 'draw'>(null)

  const makeMove = async (tile: Tile, index: number) => {
    if (tile === null && isPlayersTurn()) {
      setIsPlayersTurn(false)
      const newBoard = [...board()]
      newBoard[index] = 'X'
      setBoard(newBoard)
      if (checkWinner(newBoard)) {
        return
      }
      const newerBoard = await getAIMove(newBoard)
      setBoard(newerBoard)
      if (checkWinner(newerBoard)) {
        return
      }
      setIsPlayersTurn(true)
    }
  }

  const checkWinner = (board: Board) => {
    const winner = getWinner(board)
    console.log(winner)
    if (winner) {
      setWinner(winner)
      return true
    }
    return false
  }

  const restart = () => {
    setBoard(getEmptyBoard())
    setWinner(null)
    setIsPlayersTurn(true)
  }

  return (
    <main class='flex items-center pt-10 flex-col gap-3'>
      <Show when={winner()}>
        <div class='flex flex-col gap-1'>
          <p class='text-lg font-bold'>
            {winner() === 'draw' ? 'Draw!' : `Winner: ${winner()}`}
          </p>
          <button onClick={restart} class='rounded bg-blue-600 text-white'>
            Restart
          </button>
        </div>
      </Show>
      <div class='grid grid-cols-3 gap-1 w-fit'>
        <For each={board()}>
          {(tile, index) => (
            <div
              class={`bg-gray-200 w-12 h-12 flex justify-center items-center text-3xl font-bold ${
                tile === null && isPlayersTurn()
                  ? 'cursor-pointer'
                  : 'cursor-default'
              }`}
              onClick={() => makeMove(tile, index())}
            >
              {tile}
            </div>
          )}
        </For>
      </div>
    </main>
  )
}
