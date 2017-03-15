// GENERALS.IO TOOLS

var COLORS = {
	'blue': '#0000ff', 'red': '#ff0000',
	'orange': '#ffa500', 'darkgreen': '#004600',
	'teal': '#008080', 'purple': '#800080',
	'green': '#008000', 'maroon': '#800000'
}

var yourColor = null;
var players = {}
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
		}

		// someone's general got taken, or person has left
		if (props.indexOf('obstacle') !== -1 && elt.type === 'unexplored') {
			elt.type = 'general'
			elt.style.border = '1px solid white'
		}

		// give 'city' type once a city is seen
		if (props.indexOf('city') !== -1) {
			elt.type = 'city'
			// only give a border when you can't see the city
			if (props.indexOf('') === -1) {
				elt.nextBorder = '1px dashed ' + COLORS[props[0]]
			} else {
				elt.nextBorder = '1px dashed white'
			}
		}

		// once something is a city it is permanently a city, possibly with a color
		if (elt.type === 'city') {
			if (props.indexOf('fog') !== -1) {
				elt.style.border = elt.nextBorder;
			} else {
				elt.style.border = '1px solid black'
			}
		}

		// denote seen area where there are no generals
		if (props.indexOf('neutral') !== -1 || (props.indexOf('fog') === -1)) {
			if (props.indexOf('attackable') !== -1) {
				elt.style.opacity = '0.4'
			} else {
				elt.style.opacity = '1'
			}
		}
	});    
});

// works continuously in the browser; no need to rerun the code at the start of every game
var gameObserver = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		if (mutation.addedNodes.length > 0 && mutation.addedNodes[0].id === 'game-page') {
			tileObserver.disconnect();

			// keeps track of leaderboard
			setTimeout(function() {
				var leaderboard = document.getElementById('game-leaderboard').children[0].children
				var citiesNode = document.createElement('td');
				citiesNode.textContent = 'Cities';
				leaderboard[0].appendChild(citiesNode);
				players = {};
				// initializing number of cities column of leaderboard
				for (var i = 1; i < leaderboard.length; i++) {
					var citiesNode = document.createElement('td');
					citiesNode.textContent = '1';
					leaderboard[i].appendChild(citiesNode);
					var c = leaderboard[i].children
					players[c[1].classList[1]] = [c[2].textContent, c[3].textContent, c[4].textContent, 0]
				}

				var turnCounter = document.getElementById('turn-counter')
				var leaderTurn = function() {
					setTimeout(function() {
						leaderTurn();
						for (var i = 1; i < leaderboard.length; i++) {
							var c = leaderboard[i].children;
							turn = parseInt(turnCounter.textContent.substring(5))
							if (turn % 25 !== 0 && c[2].textContent - players[c[1].classList[1]][0] > players[c[1].classList[1]][2]) {
								if (c[2].textContent - players[c[1].classList[1]][0] === players[c[1].classList[1]][3]) {
									players[c[1].classList[1]][2] = c[2].textContent - players[c[1].classList[1]][0];
									c[4].textContent = c[2].textContent - players[c[1].classList[1]][0]
								} else {
									players[c[1].classList[1]][3] = c[2].textContent - players[c[1].classList[1]][0];
								}
							}
							players[c[1].classList[1]][0] = c[2].textContent
							players[c[1].classList[1]][1] = c[3].textContent
						}
					},1000)
				}
				// timed so that timesteps correspond with actual timesteps
				leaderTurn();
			}, 400)
			

			setTimeout(function() {
				console.log('loading map')
				var map = document.getElementById('map')
				var tiles = map.getElementsByTagName('td')

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
					var target = tiles[i]
					var config = { attributes: true, childList: false, characterData: true };
					tileObserver.observe(target, config);
				}
			}, 100)
			// arbitrary 100 milliseconds as map loads
		}
	})
})

var gameConfig = { attributes: true, childList: true, characterData: true }
var gameTarget = document.getElementById('react-container').children[0]

gameObserver.observe(gameTarget, gameConfig)
