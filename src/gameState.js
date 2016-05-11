import tilesetImage from 'assets/tileset.png';
import tilesetData from 'assets/tileset.json';


class State extends Phaser.State {
  preload() {
    this.game.time.advancedTiming = true;
    this.game.debug.renderShadow = false;
    this.game.stage.disableVisibilityChange = true;

    this.game.plugins.add(new Phaser.Plugin.Isometric(this.game));

    this.game.load.atlasJSONHash('tileset', tilesetImage, null, tilesetData);

    this.game.iso.anchor.setTo(0.5, 0.2);
  }

  create() {
    this.isoGroup = this.game.add.group();
    this.water = [];
    this.cursorPos = new Phaser.Plugin.Isometric.Point3();

    const tileArray = [];
    tileArray[0] = 'water';
    tileArray[1] = 'sand';
    tileArray[2] = 'grass';
    tileArray[3] = 'stone';
    tileArray[4] = 'wood';
    tileArray[5] = 'watersand';
    tileArray[6] = 'grasssand';
    tileArray[7] = 'sandstone';
    tileArray[8] = 'bush1';
    tileArray[9] = 'bush2';
    tileArray[10] = 'mushroom';
    tileArray[11] = 'wall';
    tileArray[12] = 'window';

    const tiles = [
      [9, 2, 1, 1, 4, 4, 1, 6, 2, 10, 2],
      [2, 6, 1, 0, 4, 4, 0, 0, 2, 2, 2],
      [6, 1, 0, 0, 4, 4, 0, 0, 8, 8, 2],
      [0, 0, 0, 0, 4, 4, 0, 0, 0, 9, 2],
      [0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0],
      [11, 11, 12, 11, 3, 3, 11, 12, 11, 11, 11],
      [3, 7, 3, 3, 3, 3, 3, 3, 7, 3, 3],
      [7, 1, 7, 7, 3, 3, 7, 7, 1, 1, 7],
    ];

    const size = 36;

    for (let y = 0; y < tiles.length; y++) {
      for (let x = 0; x < tiles[y].length; x++) {
        const tile = this.game.add.isoSprite(size * x, size * y, 0,
          'tileset', tileArray[tiles[y][x]], this.isoGroup);

        // Anchor is bottom middle
        tile.anchor.set(0.5, 1);

        if (tiles[y][x] === 4) {
          // Make bridge higher
          tile.isoZ += 6;
        }
        // if (tiles[y][x] <= 10 && (tiles[y][x] < 5 || tiles[y][x] > 6)) {
        //   // Randomize direction
        //   tile.scale.x = this.game.rnd.pick([-1, 1]);
        // }
        if (tiles[y][x] === 0) {
          // Add to water tiles
          this.water.push(tile);
        }
      }
    }
  }

  update() {
    // Update the cursor position.
    //
    // It's important to understand that screen-to-isometric projection means
    // you have to specify a z position manually, as this cannot be easily
    // determined from the 2D pointer position without extra trickery.
    //
    // By default, the z position is 0 if not set.
    this.game.iso.unproject(this.game.input.activePointer.position, this.cursorPos);

    // Loop through all tiles and test to see if the 3D position from above
    // intersects with the automatically generated IsoSprite tile bounds.
    this.isoGroup.forEach(t => {
      const tile = t;
      const inBounds = tile.isoBounds.containsXY(this.cursorPos.x, this.cursorPos.y);

      if (!tile.selected && inBounds) {
        // If it does, do a little animation and tint change.
        tile.selected = true;
        tile.tint = 0x86bfda;
        this.game.add.tween(tile).to({ isoZ: 4 }, 200, Phaser.Easing.Quadratic.InOut, true);
      } else if (tile.selected && !inBounds) {
        // If not, revert back to how it was.
        tile.selected = false;
        tile.tint = 0xffffff;
        this.game.add.tween(tile).to({ isoZ: 0 }, 200, Phaser.Easing.Quadratic.InOut, true);
      }
    });

    this.water.forEach(w => {
      const waterTile = w;
      waterTile.isoZ =
        (-2 * Math.sin((this.game.time.now + (waterTile.isoX * 7)) * 0.004))
        + (-1 * Math.sin((this.game.time.now + (waterTile.isoY * 8)) * 0.005))
        - 2;
      waterTile.alpha = Phaser.Math.clamp(1 + (w.isoZ * 0.1), 0.2, 1);
    });
  }

  render() {
    this.game.debug.text(this.game.time.fps || '--', 2, 14, '#a7aebe');
  }
}

export default State;
