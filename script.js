/*eslint-disable*/

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 800,
    pixelArt: true,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};

const game = new Phaser.Game(config);
let cursors;
let player;

function preload() {
    
    this.load.image('tiles', 'assets/mars-surface-tiles.png');   
    this.load.tilemapTiledJSON('map', 'assets/mars-surface.json');
    // this.load.image('curiosity', 'assets/curiosity.gif');
    this.load.atlas("atlas", "assets/atlas.png", "assets/atlas.json");
}

function create() {
    // tiles, terrain
    const map = this.make.tilemap({key: 'map'});
    const tileset = map.addTilesetImage('mars-surface-tiles', 'tiles');
    
    // layers
    const botLayer = map.createStaticLayer('bot', tileset,0,0);
    const topLayer = map.createStaticLayer('top', tileset,0,0);

    topLayer.setCollisionByProperty({ collides: true });

    // Starting location of Curiosity
    player = this.physics.add
        .sprite(1200,900, 'atlas');
 
    this.physics.add.collider(player, topLayer);    
    
const anims = this.anims;
anims.create({
    key: "curiosity-left-drive",
    frames: anims.generateFrameNames("atlas", {
      prefix: "curiosity-left-drive.",
      start: 0,
      end: 3,
      zeroPad: 3
    }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: "curiosity-right-drive",
    frames: anims.generateFrameNames("atlas", {
      prefix: "curiosity-right-drive.",
      start: 0,
      end: 3,
      zeroPad: 3
    }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: "curiosity-front-drive",
    frames: anims.generateFrameNames("atlas", {
      prefix: "curiosity-front-drive.",
      start: 0,
      end: 3,
      zeroPad: 3
    }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: "curiosity-back-drive",
    frames: anims.generateFrameNames("atlas", {
      prefix: "curiosity-back-drive.",
      start: 0,
      end: 2,
      zeroPad: 3
    }),
    frameRate: 10,
    repeat: -1
  });

  const camera = this.cameras.main;
  camera.startFollow(player);
  camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    
    // arrow keys
    cursors = this.input.keyboard.createCursorKeys();

     // Debug graphics
    this.input.keyboard.once("keydown_D", event => {
    // Turn on physics debugging to show player's hitbox
    this.physics.world.createDebugGraphic();

    // Create worldLayer collision graphic above the player, but below the help text
    const graphics = this.add
      .graphics()
      .setAlpha(0.75)
      .setDepth(20);
    topLayer.renderDebug(graphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(255, 255, 255, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });
  });
}

function update() {
    
    const speed = 50;
    const prevVelocity = player.body.velocity.clone();

  // Stop any previous movement from the last frame
    player.body.setVelocity(0);

    // Horizontal movement
    if (cursors.left.isDown) {
        player.body.setVelocityX(-speed);
    } else if (cursors.right.isDown) {
        player.body.setVelocityX(speed);
    }

    // Vertical movement
    if (cursors.up.isDown) {
        
        player.body.setVelocityY(-speed);
    } else if (cursors.down.isDown) {
        player.body.setVelocityY(speed);
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    player.body.velocity.normalize().scale(speed);

    // Update the animation last and give left/right animations precedence over up/down animations
    if (cursors.left.isDown) {
        player.anims.play("curiosity-left-drive", true);
      } else if (cursors.right.isDown) {
        player.anims.play("curiosity-right-drive", true);
      } else if (cursors.up.isDown) {
        player.anims.play("curiosity-back-drive", true);
      } else if (cursors.down.isDown) {
        player.anims.play("curiosity-front-drive", true);
      } else {
        player.anims.stop();

        // If we were moving, pick and idle frame to use
        // if (prevVelocity.x < 0) player.setTexture("atlas", "curiosity");
        // else if (prevVelocity.x > 0) player.setTexture("atlas", "curiosity");
        // else if (prevVelocity.y < 0) player.setTexture("atlas", "curiosity");
        // else if (prevVelocity.y > 0) player.setTexture("atlas", "curiosity");
    }
}