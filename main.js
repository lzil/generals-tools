obstacles = document.getElementsByClassName('obstacle')

for (var i = 0; i < obstacles.length; i++) {
	if (i.className.split(' ')[0] === 'fog') {
		i.style.border = '1px solid white'
	}
}