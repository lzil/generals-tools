// GENERALS.IO TOOLS

// current list of colors
var COLORS = {
	'red': 'red', 'green': 'green',
	'lightblue': '#4363d8', 'purple': 'purple',
	'teal': 'teal', 'blue': 'blue',
	'orange': '#f58231', 'maroon': '#800000',
	'yellow': '#b09f30', 'pink': '#f032e6',
	'brown': '#9a6324', 'lightgreen': '7ab78c',
	'purple-blue': '#483d8b'
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
			elt.style.opacity = 1
		}

		// once something is a mountain it is permanently a mountain
		// if server changes it back to foggy, make it not foggy
		if (props.indexOf('fog') !== -1 && elt.type === 'mountain') {
			elt.className = elt.className.replace(/\bfog\b/,'mountain')
			elt.className = elt.className.replace(/\bobstacle\b/,'')
		}

		// draw a white border around seen generals
		if (props.indexOf('general') !== -1 && elt.type !== 'general') {
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
			if (elt.type == 'unexplored' || elt.type == 'general') {
				// this was a past general!
				elt.style.border = '1px solid white'
				elt.type = 'general'
			} else if (props[0].length == 0) {
				// city owned by nobody
				elt.style.border = '1px dashed white'
				elt.type = 'city'
			} else {
				// city owned by somebody
				elt.style.border = '1px dashed ' + COLORS[props[0]]
				elt.type = 'city'
			}
		}

		// denote area that's been seen
		if (props.indexOf('fog') === -1) {
			if (elt.type == 'unexplored') {
				elt.type = 'explored'
			}
			elt.style.opacity = 1
		} else if (elt.type !== 'mountain') {
			elt.style.opacity = 0.5
		}

	});    
});

// works continuously in the browser; no need to rerun the code at the start of every game
var gameObserver = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		if (mutation.addedNodes.length > 0 && mutation.addedNodes[0].id === 'game-page') {
			tileObserver.disconnect();

			// keeps track of leaderboard
			// setTimeout(function() {
			// 	var leaderboard = document.getElementById('game-leaderboard').children[0].children
			// 	var citiesNode = document.createElement('td');
			// 	citiesNode.textContent = 'Cities';
			// 	leaderboard[0].appendChild(citiesNode);
			// 	players = {};
			// 	// initializing number of cities column of leaderboard
			// 	for (var i = 1; i < leaderboard.length; i++) {
			// 		var citiesNode = document.createElement('td');
			// 		citiesNode.textContent = '1';
			// 		leaderboard[i].appendChild(citiesNode);
			// 		var c = leaderboard[i].children
			// 		players[c[1].classList[1]] = [c[2].textContent, c[3].textContent, c[4].textContent, 0]
			// 	}

			// 	var turnCounter = document.getElementById('turn-counter')
			// 	var leaderTurn = function() {
			// 		console.log('leaderTurn called')
			// 		setTimeout(function() {
			// 			leaderTurn();
			// 			// cities calculator
			// 			for (var i = 1; i < leaderboard.length; i++) {
			// 				var c = leaderboard[i].children;
			// 				turn = parseInt(turnCounter.textContent.substring(5))
			// 				if (turn % 25 !== 0 && c[2].textContent - players[c[1].classList[1]][0] > players[c[1].classList[1]][2]) {
			// 					if (c[2].textContent - players[c[1].classList[1]][0] === players[c[1].classList[1]][3]) {
			// 						players[c[1].classList[1]][2] = c[2].textContent - players[c[1].classList[1]][0];
			// 						c[4].textContent = c[2].textContent - players[c[1].classList[1]][0]
			// 					} else {
			// 						players[c[1].classList[1]][3] = c[2].textContent - players[c[1].classList[1]][0];
			// 					}
			// 				}
			// 				players[c[1].classList[1]][0] = c[2].textContent
			// 				players[c[1].classList[1]][1] = c[3].textContent
			// 			}
			// 		},1000)
			// 	}
			// 	// timed so that timesteps correspond with actual timesteps
			// 	leaderTurn();
			// }, 400)
			

			setTimeout(function() {
				console.log('loading map')
				var map = document.getElementById('gameMap')
				var tiles = map.getElementsByTagName('td')

				for (var i = 0; i < tiles.length; i++) {
					var props = tiles[i].className.split(' ')
					if (props.indexOf('obstacle') !== -1) {
						// it's foggy, and either a mountain or a city
						tiles[i].type = 'obstacle'
					} else {
						if (props.indexOf('fog') !== -1) {
							// it's foggy but not a mountain, so due to explore
							tiles[i].type = 'unexplored'
							tiles[i].style.opacity = 0.2
						} else {
							// it's not foggy
							tiles[i].style.opacity = 1
							if (props.indexOf('city') !== -1) {
								// is a city
								tiles[i].type = 'city'
							} else if (props.indexOf('mountain') !== -1) {
								// is a mountain 
								tiles[i].type = 'mountain'
								tiles[i].style.opacity = 1
							} else {
								// is a city
								tiles[i].type = 'city'
							}
						}
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
