
var COLORS = {'blue': '#00f', 'red': '#f00', 'yellow': '#ffa500', 'darkgreen': '#004600', 'teal': '#008080', 'purple': '#800080', 'green': '#008000', 'maroon': '#800000'}

var yourColor = null;
// create an observer instance
var tileObserver = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		var elt = mutation.target
		var props = elt.className.split(' ')

		// give 'mountain' type once a mountain is seen
		if (props.indexOf('mountain') !== -1) {
			elt.type = 'mountain'
		}

		// once something is a mountain it is permanently a mountain
		if (props.indexOf('fog') !== -1 && elt.type === 'mountain') {
			elt.className = elt.className.replace(/\bfog\b/,'mountain')
			elt.className = elt.className.replace(/\bobstacle\b/,'')
		}

		// draw a white border around seen generals
		if (props.indexOf('general') !== -1) {
			elt.type = 'general'
			if (!yourColor) {
				yourColor = props[0]
			}
			elt.style.border = '1px solid white'
			// elt.clr = props[0]
			// elt.pastGen = true;
		}

		// keep generals visible with what color they are!
		// if (elt.type === 'general') {
		// 	if (elt.className.indexOf('general') === -1) {
		// 		elt.type = 'city'
		// 	}
		// 	elt.className = elt.className.replace(/\bfog\b/,elt.clr)
		// }

		// someone's general got taken or died
		if (props.indexOf('obstacle') !== -1 && elt.type === 'unexplored') {
			elt.type = 'general'
			elt.style.border = '1px solid white'
			elt.pastGen = true;
		}

		// give 'city' type once a city is seen
		if (props.indexOf('city') !== -1) {
			elt.type = 'city'
			if (props.indexOf('') === -1) {
				elt.nextBorder = '1px dashed ' + COLORS[props[0]]
			} else {
				elt.nextBorder = '1px dashed white'
			}
		}

		// once something is a city it is permanently a city, possibly with affiliation
		if (elt.type === 'city') {
			if (props.indexOf('fog') !== -1) {
				// elt.className = elt.className.replace(/\bfog\b/,'')
				// elt.className = elt.className.replace(/\bobstacle\b/,'city')
				elt.style.border = elt.nextBorder;
			} else {
				elt.style.border = '1px solid black'
			}
			
			// if (elt.hasOwnProperty('pastGen')) {
			// 	elt.className = elt.className.replace(/\bcity\b/,'general')
			// }
		}

		// denote seen area where there are no generals
		if (props.indexOf('neutral') !== -1 || (props.indexOf('fog') === -1)) {
			if (props.indexOf('attackable') !== -1) {
				elt.style.opacity = '0.4'
			} else {
				elt.style.opacity = '1'
			}
			// elt.type = 'nothing'
		}
		// if (elt.type === 'nothing') {
		// 	if (props.indexOf('fog') !== -1) {
		// 		elt.style.border = '1px dotted #999'
		// 	} else {
		// 		elt.style.border = '1px black solid'
		// 	}
		// }
	});    
});


var gameObserver = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		console.log(mutation)
		if (mutation.addedNodes.length > 0 && mutation.addedNodes[0].id === 'game-page') {
			tileObserver.disconnect();

			setTimeout(function() {
				console.log('loading map')
				var map = document.getElementById('map')
				var tiles = map.getElementsByTagName('td')
				console.log(tiles)

				for (var i = 0; i < tiles.length; i++) {
					var props = tiles[i].className.split(' ')
					if (props.indexOf('obstacle') === -1) {
						tiles[i].type = 'unexplored'
						if (props.indexOf('fog') !== -1) {
							tiles[i].style.opacity = '0.5'
						}
					} else {
						tiles[i].type = 'obstacle'
					}
				}

				for (var i = 0; i < tiles.length; i++) {
					target = tiles[i]
					var config = { attributes: true, childList: false, characterData: true };
					tileObserver.observe(target, config);
				}
			}, 100)
			
		}
	})
})

var gameConfig = { attributes: true, childList: true, characterData: true }
var gameTarget = document.getElementById('react-container').children[0]

console.log(gameTarget)
gameObserver.observe(gameTarget, gameConfig)

