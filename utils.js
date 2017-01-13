var fs = require('fs');
var mkdirp = require('mkdirp');

module.exports.writeContent = function(current_book, chapter, content){
	fs.writeFile('/home/Kebolcz/crawler/dist/' + current_book.title + '/'+ chapter + '.html', content, function(err){
		if (err) throw err;
    	console.log('It\'s saved!');
	});
};

module.exports.writeBook = function (book){
  var content =  JSON.stringify(book, null, 4); // Indented 4 spaces
  
  fs.writeFile('/home/Kebolcz/crawler/dist/' + book.title + '/' + book.title + '.json', content, function (err) {
    if (err) throw err;
    console.log('JSON is saved!');
  });
}


module.exports.mkdir = function(folder){
  	if(!fs.existsSync('/home/Kebolcz/crawler/dist/' + folder)){
	  mkdirp('/home/Kebolcz/crawler/dist/' + folder, function (err) {
	      if (err) console.error(err)
	      else console.log('create path folder successful!')
	  });
	}else{
		console.log('This path is already exist.');
	}
};