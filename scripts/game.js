// Creating a game


var gameCanvas = document.getElementById('game-canvas');
var game = new Phaser.Game(1024, 448, Phaser.AUTO, gameCanvas, {
	preload, create, update
});


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

}

// Elements update

function update() {

}
