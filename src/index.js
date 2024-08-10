import './styles.css'
class TicTacToeGame {
    constructor() {
        this.board = Array(9).fill(null)
        this.restartButton = document.getElementById('restart-button')
        this.init()
    }
    init() {
        this.renderBoard()
    }
    renderBoard() {
        const boardElement = document.getElementById('game-board')
        boardElement.classList.add(
            'grid',
            'grid-cols-3',
            'gap-4',
            'bg-purple-900',
            'rounded-lg',
            'py-8',
            'px-4'
        )
        boardElement.innerHTML = ''
        this.board.forEach((cell, index) => {
            const cellDiv = document.createElement('div')
            cellDiv.classList.add('cell')
            cellDiv.setAttribute('data-index', index)
            boardElement.appendChild(cellDiv)
        })
    }
}

let game = new TicTacToeGame()
