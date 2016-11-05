function Utils() {

}

Utils.randomRange = function(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

export default Utils;