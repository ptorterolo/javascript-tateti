import './styles.css'
class TicTacToeGame {
    constructor() {
        this.board = Array(9).fill(null)
        this.restartButton = document.getElementById('restart-button')
        this.statusDisplay = document.getElementById('game-status')
        this.currentPlayer = 'X'
        this.gameState = ['', '', '', '', '', '', '', '', '']
        this.gameActive = true

        this.restartButton.addEventListener(
            'click',
            this.handleRestartGame.bind(this)
        )

        this.winningConditions = [
            [0, 1, 2], // Row
            [3, 4, 5], // Row
            [6, 7, 8], // Row
            [0, 3, 6], // Column
            [1, 4, 7], // Column
            [2, 5, 8], // Column
            [0, 4, 8], //Diagonal
            [2, 4, 6], //Diagonal
        ]

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
        this.handleWinnerValidation()
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

    handleWinnerValidation() {
        let roundHasWinner = false
        for (let i = 0; i < this.winningConditions.length; i++) {
            const condition = this.winningConditions[i]
            let a = this.gameState[condition[0]]
            let b = this.gameState[condition[1]]
            let c = this.gameState[condition[2]]
            if (a === '' || b === '' || c === '') {
                continue
            }
            if (a === b && b === c) {
                roundHasWinner = true
                break
            }
        }

        if (roundHasWinner) {
            this.statusDisplay.classList.add('winner')
            this.statusDisplay.innerHTML = `Jugador ${this.currentPlayer} Ganó la partida!`
            this.gameActive = false
            return
        }

        let roundDraw = !this.gameState.includes('')
        if (roundDraw) {
            this.statusDisplay.classList.add('draw')
            this.statusDisplay.innerHTML = `Nadie Gana Nadie Pierde!`
            this.gameActive = false
            return
        }

        this.handlePlayerChange()
    }

    updateStatusDisplay() {
        this.statusDisplay.innerHTML = `Es el turno de ${this.currentPlayer}`
    }

    handleRestartGame() {
        this.gameActive = true
        this.currentPlayer = 'X'
        this.gameState = ['', '', '', '', '', '', '', '', '']
        this.statusDisplay.classList.remove('winner', 'draw')
        this.renderBoard()
        this.updateStatusDisplay()
    }
}

let game = new TicTacToeGame()
