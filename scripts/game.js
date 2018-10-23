// Creating a game


var gameCanvas = document.getElementById('game-canvas');
var game = new Phaser.Game(1024, 448, Phaser.AUTO, gameCanvas, {
	preload, create, update
});


// ********************************* Global variables

var boardSize = [1024, 1024]; // [width, height] dimensions in px;
var gridSize = [64, 64];

var ground;
var tiles;
var player;
var playerIsAlive = true;
var gameOver = false;
var cursor;
var goldGroup;
var enemy;
var collectedGold = 0;

var level = [
	['.', '$', '.', '$', '.', '.', '.', '.', '$', '.', '.', '.', '.', '$', '.', '.'],
	['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
	['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
	['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
	['.', '.', '.', '.', '.', '.', '.', '1', '2', '3', '4', '.', '.', '.', '.', '.'],
	['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '$', '.', '.', '.', '.', '.'],
	['1', '4', '.', '.', '.', '.', '.', '.', '.', '.', '.', '1', '2', '3', '2', '3'],
	['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
	['.', '.', '.', '.', '.', '.', '1', '4', '.', '.', '.', '.', '.', '.', '.', '.'],
	['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
	['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
	['1', '2', '3', '4', '.', '.', '.', '.', '.', '.', '1', '2', '3', '4', '.', '.'],
	['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '!', '.', '.', '.', '.'],
	['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
	['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
	['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.']
];


// ********************************* Game status


// Loading items

function preload() {
	game.load.image('background', 'assets/background.jpg');
	game.load.image('ground', 'assets/ground.png');
	game.load.image('arrows', 'assets/arrows.png');
	game.load.image('totem', 'assets/totem.png');

	game.load.image('tile-1', 'assets/tile-1.png');
	game.load.image('tile-2', 'assets/tile-2.png');
	game.load.image('tile-3', 'assets/tile-3.png');
	game.load.image('tile-4', 'assets/tile-4.png');

	game.load.spritesheet('enemy', 'assets/enemy.png', 128, 128);
	game.load.spritesheet('player', 'assets/knight.png', 128, 128);
	game.load.spritesheet('gold', 'assets/gold.png', 64, 64);
}

// Creating elements

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.add.sprite(0, 0, 'background');
	game.world.setBounds(0, 0, boardSize[0], boardSize[1]);

	game.add.sprite(gridSize[0], boardSize[1] - (4 * gridSize[1]), 'arrows');
	game.add.sprite(boardSize[0] - (2 * gridSize[0]), boardSize[1] - (5 * gridSize[0]), 'totem');

	ground = game.add.sprite(0, boardSize[1] - gridSize[1], 'ground');
	game.physics.arcade.enable(ground);
	ground.body.immovable = true;

	createPlayer();
	game.camera.follow(player);
	cursor = game.input.keyboard.createCursorKeys();

	goldGroup = game.add.group();
	goldGroup.enableBody = true;

	tiles = game.add.group();
	tiles.enableBody = true;
	createLevel();
	game.physics.arcade.enable(tiles);
}

// Elements update

function update() {
	var hitGround = game.physics.arcade.collide(player, ground);
	var hitTiles = game.physics.arcade.collide(player, tiles);

	game.physics.arcade.collide(goldGroup, ground);
	game.physics.arcade.collide(goldGroup, tiles);

	game.physics.arcade.collide(enemy, ground);
	game.physics.arcade.collide(enemy, tiles);

	game.physics.arcade.overlap(player, goldGroup, collectGold, null, this);
	game.physics.arcade.overlap(player, enemy, killPlayer, null, this);

	playerControl(hitGround, hitTiles);
}


// ********************************* Auxiliary functions


function createPlayer() {
	player = game.add.sprite(0, game.world.height - 200, 'player');

	game.physics.arcade.enable(player);
	player.body.collideWorldBounds = true;

	player.body.gravity.y = 500;
	player.body.bounce.y = 0.2;

	player.animations.add('left', [0, 1, 2, 3, 4, 5], 6, true);
	player.animations.add('right', [7, 8, 9, 10, 11, 12], 6, true);
	player.animations.add('attack', [13, 14, 15, 16, 17, 18, 19], 12, true);
	player.animations.add('die', [20, 21, 22, 23, 24, 25], 6, false);
}


function playerControl(hitGround, hitTiles) {
	player.body.velocity.x = 0;

	if (playerIsAlive && !gameOver) {
		if (cursor.left.isDown) {
			player.body.velocity.x = -200;
			player.animations.play('left');
		} else if (cursor.right.isDown) {
			player.body.velocity.x = 200;
			player.animations.play('right');
		} else if (cursor.down.isDown) {
			player.animations.play('attack');
		} else {
			player.animations.stop();
			player.frame = 6;
		}

		if (cursor.up.isDown && player.body.touching.down && hitGround) {
			player.body.velocity.y = -520;
		}

		if (cursor.up.isDown && player.body.touching.down && hitTiles) {
			player.body.velocity.y = -520;
		}
	}
}


function createEndText() {
	var text;
	var style = {
		font: 'bold 64px Arial',
		boundsAlignH: 'center',
		boundsAlignV: 'top'
	};

	if (playerIsAlive) {
		style.fill = '#227700';
		text = game.add.text(0, 0, '- VICTORY -', style);
	} else {
		style.fill = '#770000';
		text = game.add.text(0, 0, '- GAME OVER -', style);
	}

	text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

	text.setTextBounds(0, 0, boardSize[0], boardSize[1] / 2);
	text.fixedToCamera = true;
}


function killPlayer(playerSprite, orc) {
	function killAnimation() {
		player.animations.stop();
		player.frame = 25;
		orc.animations.stop();
		orc.frame = 0;
	}

	if (playerIsAlive) {
		playerIsAlive = false;
		player.animations.play('die');
		orc.animations.play('attack');

		setTimeout(killAnimation, 800);

		gameOver = true;
		createEndText();
	}
}


function collectGold(playerSprite, gold) {
	var point;

	gold.kill();
	collectedGold += 1;
	point = document.getElementById('gold' + collectedGold);
	point.src = 'assets/point.png';

	if (collectedGold === 5) {
		gameOver = true;
		createEndText();
	}
}


function createTile(i, j, name) {
	var tile;

	tile = tiles.create(gridSize[0] * j, gridSize[1] * i, name);
	tile.body.immovable = true;
	tiles.add(tile);
}


function createGold(i, j, name) {
	var gold;

	gold = goldGroup.create(gridSize[0] * j, gridSize[1] * i, name);
	gold.scale.setTo(0.7, 0.7);

	gold.enableBody = true;
	gold.body.gravity.y = 200;
	gold.body.bounce.y = 0.4 + (Math.random() * 0.2);

	gold.animations.add('rotate', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10, true);
	gold.animations.play('rotate');

	goldGroup.add(gold);
}


function createEnemy(i, j, name) {
	enemy = game.add.sprite(64 * j, 64 * i, name);

	game.physics.arcade.enable(enemy);
	enemy.enableBody = true;
	enemy.body.gravity.y = 500;
	enemy.body.bounce.y = 0.2;
	enemy.scale.setTo(1.2, 1.2);

	enemy.animations.add('left', [21, 22, 23, 24, 25, 26, 27], 7, true);
	enemy.animations.add('right', [7, 8, 9, 10, 11, 12, 13], 7, true);
	enemy.animations.add('attack', [0, 1, 2, 3, 4, 5, 6], 12, true);
	enemy.animations.add('die', [14, 15, 16, 17, 18, 19, 20], 7, false);

	enemy.frame = 0;
}


function createLevel() {
	var i;
	var j;

	for (i = 0; i < level.length; i += 1) {
		for (j = 0; j < level[i].length; j += 1) {
			switch (level[i][j]) {
			case '$': {
				createGold(i, j, 'gold');
				break;
			}
			case '!': {
				createEnemy(i, j, 'enemy');
				break;
			}
			case '1': {
				createTile(i, j, 'tile-1');
				break;
			}
			case '2': {
				createTile(i, j, 'tile-2');
				break;
			}
			case '3': {
				createTile(i, j, 'tile-3');
				break;
			}
			case '4': {
				createTile(i, j, 'tile-4');
				break;
			}
			default:
				// do nothing
			}
		}
	}
}
