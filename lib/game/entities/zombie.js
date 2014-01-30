ig.module(
	'game.entities.zombie'
)
.requires(
	'impact.entity'
)
.defines(function(){
	EntityZombie  = ig.Entity.extend({
		animSheet: new ig.AnimationSheet( 'media/zombie.png', 16 , 16),
		size: {x: 8, y: 14},
		offset: {x: 4, y: 2},
		health: 10,
		flip: false,
		maxVel: {x: 100, y: 100},
		friction:{x: 150, y:0},
		speed: 14,

		// Colisiones
		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.PASSIVE,

		init: function(x, y, settings){
			this.parent(x, y, settings);
			this.addAnim('walk', .07, [0,1,2,3,4,5]);
		},

		update: function(){

			// Cerca de un borde? Da la vuelta!
			if (!ig.game.collisionMap.getTile(
					this.pos.x + (this.flip ? +4 : this.size.x -4),
						this.pos.y + this.size.y+1
				)
			) {
				this.flip = !this.flip;
			}
			var xdir = this.flip ? -1 : 1;
			this.vel.x = this.speed * xdir;
			this.currentAnim.flip.x = this.flip;
			this.parent();
		},

		handleMovementTrace: function( res ){
			this.parent( res );
			//Collision con un muro? Vuelta!
			if ( res.collision.x ) {
				this.flip = !this.flip;
			}
		},

		check:function( other ){
			other.receiveDamage(1, this );
		},

		kill: function(){
			this.parent();
			ig.game.stats.kills ++;
			console.log('kills: ' + ig.game.stats.kills);
		},

		receiveDamage:function(value){
			this.parent(value);
			if (this.health > 0) {
				ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {colorOffset: 1});
			};
		}

		
	});



});