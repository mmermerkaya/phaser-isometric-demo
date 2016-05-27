export default class Dude {
  constructor(game, startPosition) {
    this.game = game;

    // Create dude
    this.sprite = this.game.add
      .isoSprite(startPosition.x, startPosition.y, 0,
      'char', 'greenhood_idle_front_right');
    this.sprite.anchor.set(0.5, 1);

    // Create dude's animations
    const backRightFrames =
      Phaser.Animation.generateFrameNames('greenhood_walk_back_right_', 1, 8);
    this.sprite.animations.add('walkBackRight', backRightFrames, 12, true, false);

    const backLeftFrames =
      Phaser.Animation.generateFrameNames('greenhood_walk_back_left_', 1, 8);
    this.sprite.animations.add('walkBackLeft', backLeftFrames, 12, true, false);

    const frontRightFrames =
      Phaser.Animation.generateFrameNames('greenhood_walk_front_right_', 1, 8);
    this.sprite.animations.add('walkFrontRight', frontRightFrames, 12, true, false);

    const frontLeftFrames =
      Phaser.Animation.generateFrameNames('greenhood_walk_front_left_', 1, 8);
    this.sprite.animations.add('walkFrontLeft', frontLeftFrames, 12, true, false);
  }

  stop() {
    this.sprite.animations.stop();
  }

  play(animation) {
    this.sprite.animations.play(animation);
  }

  get x() {
    return this.sprite.isoX;
  }

  set x(isoX) {
    this.sprite.isoX = isoX;
  }

  get y() {
    return this.sprite.isoY;
  }

  set y(isoY) {
    this.sprite.isoY = isoY;
  }
}
