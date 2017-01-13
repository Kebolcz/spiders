var Crawler = require("crawler");
var url = require('url');
var jsdom = require('jsdom');
 
var current_book = {};

var c = new Crawler({
    jQuery : jsdom,
    maxConnections : 10,
    // This will be called for each crawled page 
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

            //存储每一章内容的数组
            var current_Chapter = [];

            //对每一章做处理的func
            function one(chapter){
              //console.log(chapter);
              c.queue([{
                uri: 'http://www.37zw.com/0/330/' + chapter.num + '.html',
                jQuery: jsdom,
                // The global callback won't be called
                callback: function (error, res, done) {
                    var $ = res.$;
                    var content = $('#content').html();
                    current_Chapter.push({
                        Num : chapter.num,
                        C_title : chapter.title,
                        content : content
                    });

                    console.log(current_Chapter);
                }
              }]);
            }

            current_book.chapters.map(one);
        }
        done();
    }
});
 
// Queue just one URL, with default callback 
c.queue('http://www.37zw.com/0/330/');