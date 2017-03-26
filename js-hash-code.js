//credits to Wes Widner wes@manwe.io as seen at http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
module.exports = function(){

	String.prototype.hashCode = function(){
		var hash = 0;
		if (this.length == 0) return hash;
		for (var i = 0; i < this.length; i++) {
			var char = this.charCodeAt(i);
			hash = ((hash<<5)-hash)+char;
			hash = hash & hash; // Convert to 32bit integer
		}
		return hash;
	}

}
