## Testing Framework
- Vitest or Jest

## Test Cases

### Initial Tests
- Game should initialize with an empty board
- Player should be set to 'X' at the start
- Game status should display 'Es el turno de X' at the start

Approach
```
test('Game should be initialized correctly', () => {
  const game = new TicTacToeGame();
  expect(game.currentPlayer).toBe('X');
  expect(game.gameState).toEqual(["", "", "", "", "", "", "", "", ""]);
  expect(game.statusDisplay.innerHTML).toBe("Es el turno de X");
});
```

### Gameplay Tests
- Simulate a player clicking on a cell and verify that the value is updated correctly.
- Game should switch player after a valid move.
- Game state should be updated correctly after each move.
- Verify game status text updates correctly after game switches players.

### Winning Condition Tests
- Mock a winning condition and verify that the game status displays the correct winning message.
- Ensure game is marked as inactive after a win.

### Draw Condition Tests
- Mock a draw condition and verify that the game status displays the correct winning message.
- Ensure game is marked as inactive after a win.

### Restart Game Tests
- After restar button is clicked board should be empty.
- Game status, current player, records from last movements should be reset to default values.

Approach
```
test('should reset the game correctly on restart', () => {
  const game = new TicTacToeGame();
  game.gameState = ['X', 'O', 'X', 'X', 'X', 'O', 'O', 'X', 'O'];
  game.handleRestartGame();
  expect(game.gameState).toEqual(["", "", "", "", "", "", "", "", ""]);
  expect(game.currentPlayer).toBe('X');
  expect(game.statusDisplay.innerHTML).toBe("It's X's turn");
});
```

### Replay Game Tests
- Mock a game and check that the replay functionality correctly replays the moves.
- Game active state should be mark as enabled after the replay completes.

Approach
```
test('Should replay last movements correctly', () => {
  const game = new TicTacToeGame();
  game.lastGameMoves = [
    { player: 'X', index: 0, color:'text-cyan-500' },
    { player: 'O', index: 1, color:'text-amber-500' },
    { player: 'X', index: 2, color:'text-cyan-500' }
  ];
  game.handleReplayGame();
  setTimeout(() => {
    expect(game.gameState[0]).toBe('X');
    expect(game.gameState[1]).toBe('O');
    expect(game.gameState[2]).toBe('X');
    expect(game.gameActive).toBe(true);
  }, 1500); // Wait for replay to complete
});
```
