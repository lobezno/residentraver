ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'game.levels.dorm1',
	'game.levels.dorm2',
	'game.levels.dorm3',
	'impact.font',
	'impact.timer',
	'impact.debug.debug'
)
.defines(function(){
	MyGame = ig.Game.extend({
		gravity: 300,
		instructText: new ig.Font('media/04b03.font.png'),

		// Pantalla stat
		statText: new ig.Font('media/04b03.font.png'),
		showStats: false,
		statMatte: new ig.Image('media/stat-matte.png'),
		levelTimer: new ig.Timer(),
		levelExit: null,
		stats: {time: 0, kills: 0, deaths: 0},
		lives: 3,
		lifeSprite: new ig.Image('media/life-sprite.png'),
		
		init: function() {

			// Initialize your game here; bind keys etc.
			ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
			ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
			ig.input.bind( ig.KEY.X, 'jump' );
			ig.input.bind( ig.KEY.C, 'shoot' );
			ig.input.bind( ig.KEY.Z, 'switch' );
			ig.input.bind( ig.KEY.SPACE, 'continue' );
			this.loadLevel( LevelDorm1 );
			ig.music.add('media/sounds/theme.*');
			ig.music.volume = 0.5;
			ig.music.play();
			
		},
		
		update: function() {
			
			if (!this.showStats) {
				// La camara sigue a player
				var player = this.getEntitiesByType(EntityPlayer)[0];
				if (player) {
					this.screen.x = player.pos.x - ig.system.width/2;	// sin el ig.system.width/2 la camara se posiciona con el player en 0,0
					this.screen.y = player.pos.y - ig.system.height/2;
					if (player.pos.x > 100 && this.instructText)
						this.instructText =  null;
					
				};
				// Update all entities and backgroundMaps
				this.parent();
				
				// Add your own, additional update code here
			}else{
				if (ig.input.state('continue')) {
					this.showStats = false;
					this.levelExit.nextLevel();
					
					this.parent();
				};
			}
		},
		
		draw: function() {
			// Draw all entities and backgroundMaps
			this.parent();
			this.statText.draw('Vidas',5,5);
			for (var i = 0; i < this.lives; i++) {
				this.lifeSprite.draw(((this.lifeSprite.width + 2)* i)+5, 15);
			};
			if (this.instructText) {
				var x = ig.system.width/2;
				var y = ig.system.height - 10;
				this.instructText.draw(' Izquierda/Derecha-mover X-saltar C-disparar Z-cambio de arma', x, y, ig.Font.ALIGN.CENTER);
			};
			if(this.showStats){
				this.statMatte.draw(0,0);
				var x = ig.system.width/2;
				var y = ig.system.height/2 - 20;
				this.statText.draw('Nivel Completado!', x, y, ig.Font.ALIGN.CENTER);
				this.statText.draw('Tiempo: ' + this.stats.time, x, y+30, ig.Font.ALIGN.CENTER);
				this.statText.draw('Enemigos: ' + this.stats.kills, x, y+40, ig.Font.ALIGN.CENTER);
				this.statText.draw('Muertes: ' + this.stats.deaths, x, y+50, ig.Font.ALIGN.CENTER);
				this.statText.draw('Presiona espacio para continuar', x, ig.system.height - 10, ig.Font.ALIGN.CENTER);

			}
		},

		loadLevel:function(data){
			this.parent(data);
			// reseteamos los stats
					this.levelTimer.reset();
					//this.stats = {time: 0, kills: 0, deaths: 0};
			
		},

		toggleStatus: function(levelEnd){

			this.showStats = true;
			this.stats.time = Math.round(this.levelTimer.delta());
			this.levelExit = levelEnd;
			
		},

		gameOver: function(){
			ig.finalStats = ig.game.stats;
			ig.system.setGame(GameOverScreen);
		}
	});

	// Compatibilidad con dispositivos moviles
	if (ig.ua.mobile) {
		// Deshabilita el sonido para dispositivos moviles
		ig.Sound.enabled = false;
	};

	StartScreen = ig.Game.extend({
		instructText: new ig.Font('media/04b03.font.png'),
		background: new ig.Image('media/screen-bg.png'),
		title: new ig.Image('media/game-title.png'),
		init: function(){
			ig.input.bind(ig.KEY.SPACE, 'start');
		},
		update: function(){
			if (ig.input.pressed('start')) {
				ig.system.setGame(MyGame);
			};
			this.parent();
		},
		draw: function(){
			this.parent();
			this.background.draw(0,0);
			this.title.draw(ig.system.width /2 - (this.title.width/2),ig.system.height/2 - (this.title.height/2));
			var x = ig.system.width/2;
			var y = ig.system.height - 10;
			this.instructText.draw('Pulsa espacio para empezar', x+40, y, ig.Font.ALIGN.CENTER);
		},

	});

	GameOverScreen = ig.Game.extend({
		instructText: new ig.Font('media/04b03.font.png'),
		background: new ig.Image('media/screen-bg.png'),
		gameOver: new ig.Image('media/game-over.png'),
		stats: {},

		init: function(){
			ig.input.bind(ig.KEY.SPACE, 'start');
			this.stats = ig.finalStats;
		},

		update: function(){
			if (ig.input.pressed('start')) {
				ig.system.setGame(StartScreen);
			};
			this.parent();
		},

		draw: function(){
			this.parent();
			this.background.draw(0,0);
			var x = ig.system.width/2;
			var y = ig.system.height/2 - 20;
			this.gameOver.draw(x - (this.gameOver.width * .5), y - 30);
			var score = (this.stats.kills * 100) - (this.stats.deaths * 50);
			this.instructText.draw("Enemigos totales: " + this.stats.kills, x, y+30, ig.Font.ALIGN.CENTER );
			this.instructText.draw("Muertes totales: " + this.stats.deaths, x, y+40, ig.Font.ALIGN.CENTER );
			this.instructText.draw("Puntuacion: " + score, x, y+50, ig.Font.ALIGN.CENTER );
			this.instructText.draw("Pulsa espacio para continuar", x, ig.system.height - 10, ig.Font.ALIGN.CENTER );
		}
	});

// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', StartScreen, 60, 320, 240, 2 );

});
