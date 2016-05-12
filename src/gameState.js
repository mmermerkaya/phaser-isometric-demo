import tilesetImage from 'assets/tileset.png';
import tilesetData from 'assets/tileset.json';
import EasyStar from 'easystarjs';
import { map, direction } from 'map';

class State extends Phaser.State {
  preload() {
    this.game.time.advancedTiming = true;
    this.game.debug.renderShadow = false;
    this.game.stage.disableVisibilityChange = true;

    this.game.plugins.add(new Phaser.Plugin.Isometric(this.game));

    this.game.load.atlasJSONHash('tileset', tilesetImage, null, tilesetData);

    this.game.iso.anchor.setTo(0.3, 0.1);
  }

  create() {
    this.isoGroup = this.game.add.group();
    this.water = [];
    this.cursorPos = new Phaser.Plugin.Isometric.Point3();
    this.easystar = new EasyStar.js(); // eslint-disable-line new-cap
    this.size = 36;
    this.finding = false;

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

    this.easystar.setGrid(map);
    this.easystar.setAcceptableTiles([1, 2, 3, 4, 5, 6, 7]);
    this.easystar.enableDiagonals();
    this.easystar.disableCornerCutting();

    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        const tile = this.game.add.isoSprite(this.size * x, this.size * y, 0,
          'tileset', tileArray[map[y][x]], this.isoGroup);
        tile.scale.x = direction[y][x];

        // Anchor is bottom middle
        tile.anchor.set(0.5, 1);
        tile.initialZ = 0;

        if (map[y][x] === 4) {
          // Make bridge higher
          tile.isoZ += 4;
          tile.initialZ += 4;

          const waterUnderBridge = this.game.add.isoSprite(this.size * x, this.size * y, 0,
            'tileset', tileArray[0], this.isoGroup);
          waterUnderBridge.anchor.set(0.5, 1);
          waterUnderBridge.initialZ = -2;
          this.water.push(waterUnderBridge);
        }
        if (map[y][x] === 0) {
          tile.initialZ = -2;
          // Add to water tiles
          this.water.push(tile);
        }
      }
    }

    this.game.iso.simpleSort(this.isoGroup);
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

    // Loop through all tiles
    this.isoGroup.forEach(t => {
      const tile = t;
      const x = tile.isoX / this.size;
      const y = tile.isoY / this.size;
      const inBounds = tile.isoBounds.containsXY(this.cursorPos.x, this.cursorPos.y);

      // Test to see if the 3D position from above intersects
      // with the automatically generated IsoSprite tile bounds.
      if (!tile.selected && inBounds && !this.water.includes(tile)) {
        // If it does, do a little animation and tint change.
        tile.selected = true;
        if (!tile.inPath) {
          tile.tint = 0x86bfda;
        }
        this.game.add
          .tween(tile)
          .to({ isoZ: tile.initialZ + 4 }, 200, Phaser.Easing.Quadratic.InOut, true);
      } else if (tile.selected && !inBounds) {
        // If not, revert back to how it was.
        tile.selected = false;
        if (!tile.inPath) {
          tile.tint = 0xffffff;
        }
        this.game.add
          .tween(tile)
          .to({ isoZ: tile.initialZ + 0 }, 200, Phaser.Easing.Quadratic.InOut, true);
      }

      if (!this.finding && this.game.input.activePointer.isDown && inBounds) {
        // Start path finding
        this.finding = true;
        this.easystar.findPath(5, 10, x, y, this.processPath.bind(this));
        this.easystar.calculate();
      }
    });

    this.water.forEach(w => {
      const waterTile = w;
      waterTile.isoZ =
        waterTile.initialZ +
        (-2 * Math.sin((this.game.time.now + (waterTile.isoX * 7)) * 0.004))
        + (-1 * Math.sin((this.game.time.now + (waterTile.isoY * 8)) * 0.005));
      waterTile.alpha = Phaser.Math.clamp(1 + (waterTile.isoZ * 0.1), 0.2, 1);
    });
  }

  render() {
    this.game.debug.text(this.game.time.fps || '--', 2, 14, '#a7aebe');
  }

  processPath(path) {
    this.finding = false;
    if (!path) {
      return;
    }

    // Loop tiles
    this.isoGroup.forEach(t => {
      const tile = t;
      if (tile.inPath) {
        // Clear tint from previous path
        tile.tint = 0xffffff;
      }
      const x = tile.isoX / this.size;
      const y = tile.isoY / this.size;
      const inPath = path.some(point => point.x === x && point.y === y);
      if (inPath) {
        tile.tint = 0xaa3333;
        tile.inPath = true;
      } else {
        tile.inPath = false;
      }
    });
    this.path = path;
  }
}

export default State;
