var Crawler = require("crawler");
var url = require('url');
var jsdom = require('jsdom');

var current_book = {};

var mkdir = require('./utils').mkdir;
var writeConfig = require('./utils').writeConfig;
var writeChapter = require('./utils').writeChapter;

var c = new Crawler({
    jQuery : jsdom,
    maxConnections : 2000,
    forceUTF8:true,
    //incomingEncoding: 'GBK',
    // This will be called for each crawled page 
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{

        }
        done();
    }
});
 
// Queue just one URL, with default callback 
//c.queue('http://www.37zw.com/0/330/');
c.queue([{
    uri: 'http://www.37zw.com/0/330/',
    jQuery: jsdom,
    forceUTF8:true,
    //incomingEncoding: 'GBK',
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            var urls = $('#list a');

            current_book.title = $('#maininfo h1').text()
            current_book.author = $('#info p').eq(0).text()
            current_book.update_time = $('#info p').eq(2).text()
            current_book.latest_chapter = $('#info p').eq(3).html()
            current_book.intro = $('#intro').html()
            current_book.chapters = [];

            mkdir('bigHero');

            for(var i = 0; i< urls.length; i++){
                var url = urls[i]
                
                var _url = $(url).attr('href')+"";
                var num = _url.replace('.html','');
                var title = $(url).text();

                current_book.chapters.push({
                  num: num,
                  title: title,
                  url: _url
                })
              }

            console.log(current_book);   

            writeConfig(current_book);

            current_book.chapters.map(dealEachChapter);
        }
        //done();
    }
}]);


//对每一章做处理的func
function dealEachChapter(chapter){
  //console.log(chapter);
  c.queue([{
    uri: 'http://www.37zw.com/0/330/' + chapter.num + '.html',
    jQuery: jsdom,
    forceUTF8:true,
    //incomingEncoding: 'GBK',
    // The global callback won't be called
    callback: function (error, res, done) {
        var $ = res.$;
        writeChapter(chapter.title, $('#content').html());
    }
  }]);
}