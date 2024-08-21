import './style.css'

class TicTacToeGame {
  constructor(size = 3) {
      this.boardSize = size ** 2
      this.boardElement = document.getElementById('game-board')
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
      this.levelOfDifficulty = 'easy'
      this.aiDelay = 400

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
      document
          .querySelectorAll('input[name="difficulty"]')
          .forEach((radio) => {
              radio.addEventListener(
                  'change',
                  this.handleDifficultyChange.bind(this)
              )
          })
  }

  handleDifficultyChange(event) {
      this.levelOfDifficulty = event.target.value
  }

  handlePlayerModeChange(event) {
      this.playerMode = event.target.value
      this.toggleAiLevelMenu(this.playerMode)
      this.handleRestartGame()
  }

  renderBoard() {
      // TODO: make amount of columns dynamic when board size allows nxn grid
      this.boardElement.classList.add(
          'grid',
          'grid-cols-3',
          'gap-4',
          'bg-purple-900',
          'rounded-lg',
          'py-8',
          'px-4'
      )
      this.boardElement.innerHTML = ''
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
          this.boardElement.appendChild(cellDiv)
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

  updateUiWithMatchResult(hasWinner, text, winCondition = []) {
      if (hasWinner) {
          const cells = document.querySelectorAll('.cell')
          winCondition.forEach((index) => {
              cells[index].classList.add('!bg-green-500')
          })
      }
      this.statusDisplay.classList.add(hasWinner ? 'winner' : 'draw')
      this.statusDisplay.innerHTML = text
      this.gameActive = false
  }

  handleWinnerValidation() {
      let roundHasWinner = false
      let winCondition
      for (let i = 0; i < this.winningConditions.length; i++) {
          const [a, b, c] = this.winningConditions[i]
          if (
              this.gameState[a] === '' ||
              this.gameState[b] === '' ||
              this.gameState[c] === ''
          ) {
              continue
          }
          if (
              this.gameState[a] === this.gameState[b] &&
              this.gameState[b] === this.gameState[c]
          ) {
              winCondition = this.winningConditions[i]
              roundHasWinner = true
              break
          }
      }

      if (roundHasWinner) {
          this.updateUiWithMatchResult(
              true,
              `Jugador ${this.currentPlayer} Ganó la partida!`,
              winCondition
          )
          this.enableReplayButton()
          return
      }

      let roundDraw = !this.gameState.includes('')
      if (roundDraw) {
          this.updateUiWithMatchResult(false, `Nadie Gana Nadie Pierde!`)
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
      // Prevents playing on already played cells or when game is not active
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

  getBestMove() {
      let bestScore = -Infinity
      let move
      for (let i = 0; i < this.gameState.length; i++) {
          if (this.gameState[i] === '') {
              this.gameState[i] = 'O'
              let score = this.minimax(this.gameState, 0, false)
              this.gameState[i] = ''
              if (score > bestScore) {
                  bestScore = score
                  move = i
              }
          }
      }
      return move
  }

  minimax(board, depth, isMaximizing) {
      let scores = {
          X: -1,
          O: 1,
          draw: 0,
      }

      let result = this.checkWinner()
      if (result !== null) {
          return scores[result]
      }

      if (isMaximizing) {
          let bestScore = -Infinity
          for (let i = 0; i < board.length; i++) {
              if (board[i] === '') {
                  board[i] = 'O'
                  let score = this.minimax(board, depth + 1, false)
                  board[i] = ''
                  bestScore = Math.max(score, bestScore)
              }
          }
          return bestScore
      } else {
          let bestScore = Infinity
          for (let i = 0; i < board.length; i++) {
              if (board[i] === '') {
                  board[i] = 'X'
                  let score = this.minimax(board, depth + 1, true)
                  board[i] = ''
                  bestScore = Math.min(score, bestScore)
              }
          }
          return bestScore
      }
  }

  checkWinner() {
      for (let i = 0; i < this.winningConditions.length; i++) {
          const [a, b, c] = this.winningConditions[i]
          if (
              this.gameState[a] &&
              this.gameState[a] === this.gameState[b] &&
              this.gameState[a] === this.gameState[c]
          ) {
              return this.gameState[a]
          }
      }

      if (!this.gameState.includes('')) {
          return 'draw'
      }

      return null
  }

  handleHardAIMove() {
      const bestMove = this.getBestMove()
      const cells = document.querySelectorAll('.cell')
      const cell = cells[bestMove]
      this.handleCellPlayed(cell, bestMove)
      this.handleWinnerValidation()
  }

  handleAIMove() {
      setTimeout(() => {
          if (this.levelOfDifficulty === 'hard') {
              this.handleHardAIMove()
          } else {
              this.handleEasyAIMove()
          }
      }, this.aiDelay)
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
      if (this.currentPlayer === 'O' && this.playerMode === 'ai') {
          this.statusDisplay.innerHTML = `Es el turno de la CPU (O)`
          return
      }
      this.statusDisplay.innerHTML = `Es el turno de ${
          this.currentPlayer == 'X' ? 'P1 (X)' : 'P2 (O)'
      }`
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