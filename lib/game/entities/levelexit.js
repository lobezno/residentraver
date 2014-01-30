ig.module(
	'game.entities.levelexit'
)
.requires(
	'impact.entity'
)
.defines(function(){

	EntityLevelexit  = ig.Entity.extend({
			_wmDrawBox: true,
			_wmBoxColor: 'rgba(0, 0, 255, 0.7)',
			size: {x: 8, y: 8},
			level: null,
			checkAgainst: ig.Entity.TYPE.A,

			update: function(){},	// Se sobrescribe el metodo update sin la llamada a this.parent() puesto que no queremos perder ciclos de render en algo que no se tiene que repintar en cada update
			
			check: function( other ){
				if (other instanceof EntityPlayer) {
					console.log("Choque!");
					if (this.level) {
						var levelName = this.level.replace(/^(Level)?(\w)(\w*)/, function(m, l, a, b){
							return a.toUpperCase() + b;
						})
						ig.game.loadLevelDeferred( ig.global['Level'+levelName]);
					};
				};
			}

		
	});

});