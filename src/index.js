import './styles.css'
class TicTacToeGame {
    constructor(size = 3) {
        this.boardSize = size ** 2
        this.restartButton = document.getElementById('restart-button')
        this.statusDisplay = document.getElementById('game-status')
        this.replayButton = document.getElementById('replay-button')
        this.configButton = document.getElementById('game-config')
        this.menuOptions = document.getElementById('menu-options')
        this.closeModalBtn = document.getElementById('close-modal')
        this.playerMode = document.querySelector(
            'input[name="player-mode"]:checked'
        ).value
        this.aiLevelMenu = document.getElementById('ai-difficulty-menu')
        this.levelOfDifficulty = 'easy' // todo make it dynamic based on user selection

        this.currentPlayer = 'X'
        this.gameState = Array(this.boardSize).fill('')
        this.gameActive = true
        this.lastGameMoves = []

        this.winningConditions = [
            [0, 1, 2], // Row
            [3, 4, 5], // Row
            [6, 7, 8], // Row
            [0, 3, 6], // Column
            [1, 4, 7], // Column
            [2, 5, 8], // Column
            [0, 4, 8], // Diagonal
            [2, 4, 6], // Diagonal
        ]

        this.init()
    }

    setListeners() {
        this.restartButton.addEventListener(
            'click',
            this.handleRestartGame.bind(this)
        )
        this.replayButton.addEventListener(
            'click',
            this.handleReplayGame.bind(this)
        )
        this.configButton.addEventListener(
            'click',
            this.handleMenuOptions.bind(this)
        )
        this.closeModalBtn.addEventListener(
            'click',
            this.handleMenuOptions.bind(this)
        )
        document
            .querySelectorAll('input[name="player-mode"]')
            .forEach((radio) => {
                radio.addEventListener(
                    'change',
                    this.handlePlayerModeChange.bind(this)
                )
            })
    }

    handlePlayerModeChange(event) {
        this.playerMode = event.target.value
        this.toggleAiLevelMenu(this.playerMode)
        this.handleRestartGame()
    }

    renderBoard() {
        const boardElement = document.getElementById('game-board')

        // TODO: make amount of columns dynamic when board size allows nxn grid
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
        for (let index = 0; index < this.boardSize; index++) {
            const cellDiv = document.createElement('div')
            cellDiv.classList.add('cell')
            cellDiv.setAttribute('data-index', index)
            cellDiv.setAttribute('role', 'button')
            cellDiv.setAttribute('aria-label', `Cell ${index + 1}`)
            cellDiv.setAttribute('tabindex', `0`)
            cellDiv.addEventListener('click', this.handleCellClick.bind(this))
            cellDiv.addEventListener(
                'keydown',
                this.handleCellKeyDown.bind(this)
            )
            boardElement.appendChild(cellDiv)
        }
    }
    handleCellKeyDown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            this.handleCellClick(event)
        }
    }

    // GAME LOGIC
    handleCellPlayed(clickedCell, clickedCellIndex) {
        this.gameState[clickedCellIndex] = this.currentPlayer
        clickedCell.innerHTML = this.currentPlayer
        const cellColor =
            this.currentPlayer === 'X' ? 'text-cyan-500' : 'text-amber-500'
        clickedCell.classList.add(cellColor)
        this.lastGameMoves.push({
            player: this.currentPlayer,
            index: clickedCellIndex,
            color: cellColor,
        })
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
            this.enableReplayButton()
            return
        }

        let roundDraw = !this.gameState.includes('')
        if (roundDraw) {
            this.statusDisplay.classList.add('draw')
            this.statusDisplay.innerHTML = `Nadie Gana Nadie Pierde!`
            this.gameActive = false
            this.enableReplayButton()
            return
        }

        this.handlePlayerChange()
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

        if (
            this.gameActive &&
            this.currentPlayer === 'O' &&
            this.playerMode === 'ai'
        ) {
            this.handleAIMove()
        }

        if (this.replayButton.hasAttribute('disabled')) {
            this.enableReplayButton()
        }
    }

    handlePlayerChange() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X'
        this.updateStatusDisplay()
    }

    handleEasyAIMove() {
        const availableCells = this.gameState
            .map((cell, index) => (cell === '' ? index : null))
            .filter((index) => index !== null)

        if (availableCells.length > 0) {
            const randomIndex =
                availableCells[
                    Math.floor(Math.random() * availableCells.length)
                ]
            const cells = document.querySelectorAll('.cell')
            const cell = cells[randomIndex]
            this.handleCellPlayed(cell, randomIndex)
            this.handleWinnerValidation()
        }
    }
    handleHardAIMove() {
        // todo
    }

    handleAIMove() {
        switch (this.levelOfDifficulty) {
            case 'hard':
                this.handleHardAIMove()
                break

            default:
                this.handleEasyAIMove()
                break
        }
    }

    // REPLAY GAME
    enableReplayButton() {
        this.replayButton.removeAttribute('disabled')
    }
    disableReplayButton() {
        this.replayButton.setAttribute('disabled', true)
    }
    handleReplayGame() {
        this.renderBoard()
        this.gameActive = false
        const cells = document.querySelectorAll('.cell')
        this.lastGameMoves.forEach((move, index) => {
            setTimeout(() => {
                this.gameState[move.index] = move.player
                cells[move.index].classList.add(move.color)
                cells[move.index].innerHTML = move.player
                if (index === this.lastGameMoves.length - 1) {
                    this.gameActive = true
                }
            }, index * 500)
        })
    }
    // RESTART GAME
    handleRestartGame() {
        this.lastGameMoves = []
        this.disableReplayButton()
        this.gameActive = true
        this.currentPlayer = 'X'
        this.gameState = Array(this.boardSize).fill('')
        this.statusDisplay.classList.remove('winner', 'draw')
        this.renderBoard()
        this.updateStatusDisplay()
    }

    // UI
    updateStatusDisplay() {
        this.statusDisplay.innerHTML = `Es el turno de ${this.currentPlayer}`
    }

    handleMenuOptions() {
        this.menuOptions.classList.toggle('block')
    }

    toggleAiLevelMenu(playerMode) {
        if (playerMode === 'ai') {
            this.aiLevelMenu.classList.remove('hidden')
        } else {
            this.aiLevelMenu.classList.add('hidden')
        }
    }

    // INIT
    init() {
        this.setListeners()
        this.renderBoard()
        this.updateStatusDisplay()
    }
}

let game = new TicTacToeGame()
