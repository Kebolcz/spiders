var fs = require('fs');
var mkdirp = require('mkdirp');
var iconv = require('iconv-lite');
//创建路径的基本路径
const basicUri = '/home/Kebolcz/crawler/dist/';

//下网目标文件夹写入书籍目录,JSON
module.exports.writeContent = function(current_book, chapter, content){
	fs.writeFile(basicUri + current_book.title + '/'+ chapter + '.html', content, function(err){
		if (err) throw err;
    	console.log('It\'s saved!');
	});
};
//向目标文件夹写每章节内容
module.exports.writeBook = function (book){
  var content =  JSON.stringify(book, null, 4); // Indented 4 spaces
  
  fs.writeFile(basicUri + book.title + '/' + book.title + '.json', content, function (err) {
    if (err) throw err;
    console.log('JSON is saved!');
  });
}

//自动创建目录文件夹
module.exports.mkdir = function(folder){
  	if(!fs.existsSync(basicUri + folder)){
	  mkdirp(basicUri + folder, function (err) {
	      if (err) console.error(err)
	      else console.log('create path folder successful!')
	  });
	}else{
		console.log('This path is already exist.');
	}
};
//向目标文件夹写每章节内容
module.exports.writeChapter = function(chapter, content){
	//var str = iconv.encode(content, 'utf-8');
    var str = iconv.encode(content, 'gbk');

	fs.writeFile('/home/Kebolcz/crawler/dist/bigHero/'+ chapter + '.html', str, function(err){
		if (err) throw err;
    	console.log( chapter + ' is saved!');
	});
};
//下网目标文件夹写入书籍目录,JSON
module.exports.writeConfig = function (book){
  var content =  JSON.stringify(book, null, 4); // Indented 4 spaces
  
  fs.writeFile('/home/Kebolcz/crawler/dist/bigHero/' + book.title + '.json', content, function (err) {
    if (err) throw err;
    console.log('JSON is saved!');
  });
}