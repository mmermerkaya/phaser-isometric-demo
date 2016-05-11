import 'babel-polyfill';
import GameState from 'gameState';

class Game extends Phaser.Game {
  constructor() {
    super(1280, 768, Phaser.AUTO, 'test', null, true, false);
  }
}

const game = new Game();
game.state.add('GameState', GameState, false);
game.state.start('GameState');
