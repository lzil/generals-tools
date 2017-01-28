map = document.getElementById('map')
tiles = map.getElementsByTagName('td')

for (var i = 0; i < tiles.length; i++) {
	props = tiles[i].className.split(' ')
	if (props.indexOf('obstacle') === -1) {
		tiles[i].type = 'none'
		if (props.indexOf('fog') !== -1) {
			//tiles[i].style.border = '1px dotted #999'
			tiles[i].style.opacity = '0.5'
		}
	} else {
		tiles[i].type = 'hill'
	}
}

COLORS = {'blue': '#00f', 'red': '#f00', 'yellow': '#ffa500', 'darkgreen': '#004600', 'teal': '#008080', 'purple': '#800080', 'green': '#008000', 'maroon': '#800000'}

yourColor = null;

targets = []
observers = []
configs = []

for (var i = 0; i < tiles.length; i++) {
	target = tiles[i]
 
	// create an observer instance
	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			elt = mutation.target
			props = elt.className.split(' ')

			// give 'mountain' type once a mountain is seen
			if (props.indexOf('mountain') !== -1) {
				elt.type = 'mountain'
			}

			// once something is a mountain it is permanently a mountain
			if (props.indexOf('fog') !== -1 && elt.type === 'mountain') {
				elt.className = elt.className.replace(/\bfog\b/,'')
			}

			// draw a white border around seen generals
			if (props.indexOf('general') !== -1) {
				elt.type = 'general'
				if (!yourColor) {
					yourColor = props[0]
				}
				elt.style.border = '1px solid white'
				elt.clr = props[0]
				elt.pastGen = true;
			}

			// keep generals visible with what color they are!
			// if (elt.type === 'general') {
			// 	if (elt.className.indexOf('general') === -1) {
			// 		elt.type = 'city'
			// 	}
			// 	elt.className = elt.className.replace(/\bfog\b/,elt.clr)
			// }

			// someone's general got taken or died
			if (props.indexOf('obstacle') !== -1 && elt.type === 'none') {
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
					elt.className = elt.className.replace(/\bfog\b/,'')
					elt.className = elt.className.replace(/\bobstacle\b/,'city')
					elt.style.border = elt.nextBorder;
				}
				
				if (elt.hasOwnProperty('pastGen')) {
					elt.className = elt.className.replace(/\bcity\b/,'general')
				}
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
	
	// configuration of the observer:
	var config = { attributes: true, childList: false, characterData: true };
	 
	// pass in the target node, as well as the observer options
	observer.observe(target, config);

	targets.push(target)
	configs.push(config)
	observers.push(observer)
}

