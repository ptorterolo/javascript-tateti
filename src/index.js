import './styles.css'
class TicTacToeGame {
    constructor() {
        this.board = Array(9).fill(null)
        this.restartButton = document.getElementById('restart-button')
        this.statusDisplay = document.getElementById('game-status')
        this.currentPlayer = 'X'
        this.gameState = ['', '', '', '', '', '', '', '', '']
        this.gameActive = true
        this.init()
    }
    init() {
        this.renderBoard()
        this.updateStatusDisplay()
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
        this.board.forEach((_, index) => {
            const cellDiv = document.createElement('div')
            cellDiv.classList.add('cell')
            cellDiv.setAttribute('data-index', index)
            cellDiv.addEventListener('click', this.handleCellClick.bind(this))
            boardElement.appendChild(cellDiv)
        })
    }

    handleCellClick(event) {
        const clickedCell = event.target

        const clickedCellIndex = parseInt(
            clickedCell.getAttribute('data-index')
        )

        if (this.gameState[clickedCellIndex] !== '' || !this.gameActive) {
            return
        }

        this.handleCellPlayed(clickedCell, clickedCellIndex)
        this.handlePlayerChange()
    }

    handlePlayerChange() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X'
        this.updateStatusDisplay()
    }

    handleCellPlayed(clickedCell, clickedCellIndex) {
        this.gameState[clickedCellIndex] = this.currentPlayer
        clickedCell.innerHTML = this.currentPlayer
        const cellColor =
            this.currentPlayer === 'X' ? 'text-cyan-500' : 'text-amber-500'
        clickedCell.classList.add(cellColor)
    }

    updateStatusDisplay() {
        this.statusDisplay.innerHTML = `Es el turno de ${this.currentPlayer}`
    }
}

let game = new TicTacToeGame()
