map = document.getElementById('map')
tiles = map.getElementsByTagName('td')

for (var i = 0; i < tiles.length; i++) {
	classes = tiles[i].className.split(' ')
	if (classes.indexOf('obstacle') === -1) {
		tiles[i].type = 'none'
	} else {
		tiles[i].type = 'hill'
	}
}

COLORS = {'blue': '#00f', 'red': '#f00', 'yellow': '#ffa500', 'darkgreen': '#004600', 'teal': '#008080', 'purple': '#800080', 'green': '#008000', 'maroon': '#800000'}

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

			if (props.indexOf('mountain') !== -1) {
				elt.type = 'mountain'
			}

			if (props.indexOf('fog') !== -1 && elt.type === 'mountain') {
				elt.className = elt.className.replace(/\bfog\b/,'')
			}

			if (props.indexOf('general') !== -1) {
				elt.type = 'general'
				elt.style.border = '1px solid white'
				// elt.style.outline = '2px solid ' + COLORS[props[0]]
			}

			if (props.indexOf('obstacle') !== -1 && elt.type === 'none') {
				elt.type = 'general'
				elt.style.border = '1px solid white'
			}

			if (props.indexOf('city') !== -1 && elt.type !== 'general') {
				elt.type = 'city'
				if (props.indexOf('') === -1) {
					elt.style.border = '1px dashed ' + COLORS[props[0]]
				} else {
					elt.style.border = '1px dashed white'
				}
			}

			if (props.indexOf('neutral') !== -1 || (props.indexOf('fog') === -1 && elt.type === 'none')) {
				elt.type = 'nothing'
			}
			if (elt.type === 'nothing') {
				if (props.indexOf('fog') !== -1) {
					elt.style.border = '1px dotted #999'
				} else {
					elt.style.border = '1px black solid'
				}
			}
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

