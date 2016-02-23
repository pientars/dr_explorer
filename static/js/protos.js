String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.cut_name_to_length = function(n) {
 	if (this.length <= n) return this;
 	if (n <= 3) return '';
 	return this.substr(0, (n-3))+'...'
}