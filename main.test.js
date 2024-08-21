import { expect, test, beforeEach } from 'vitest'
import TicTacToeGame from './main.js';
import { JSDOM } from 'jsdom';

let dom;
let document;

beforeEach(() => {
  dom = new JSDOM(`
    <html>
      <body>
        <input type="radio" name="player-mode" value="single" checked>
        <div id="ai-difficulty-menu"></div>
      </body>
    </html>
  `);
  document = dom.window.document;
  global.document = document;
  global.window = dom.window;
});

test('should initialize the game correctly', async () => {
    const game = new TicTacToeGame();
    expect(game.currentPlayer).toBe('X');
    expect(game.gameState).toEqual(['', '', '', '', '', '', '', '', '']);
    expect(game.statusDisplay.innerHTML).toBe("It's X's turn");
});