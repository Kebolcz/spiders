/*
 * author:kebo
 * data:20170113
 * description:使用async.mapLimit()限制并发访问数量.
 * 但是总是遇到某些页面(由于网络原因?)爬取不到,返回错误err,直接执行Callback中断的后续的爬取.
 */
var superagent = require('superagent');
var superagentCharset = require('superagent-charset');
var cheerio = require('cheerio');
var url = require('url');
var async = require('async');

var mkdir = require('./utils').mkdir;
var writeBook = require('./utils').writeBook;
var writeContent = require('./utils').writeContent;

var current_book = {};

var cnodeUrl = 'http://www.37zw.com/0/330/';

superagentCharset(superagent);

superagent.get(cnodeUrl)
	.charset('gbk')
    .end(function (err, res) {
        if (err) {
            return console.error(err);
        }
        var chapterUrls = [];
        var $ = cheerio.load(res.text);
        chapterUrls = $('#list a');

        current_book.title = $('#maininfo h1').text()
        current_book.author = $('#info p').eq(0).text()
        current_book.update_time = $('#info p').eq(2).text()
        current_book.latest_chapter = $('#info p').eq(3).html()
        current_book.intro = $('#intro').html()
        current_book.chapters = [];

        mkdir(current_book.title);

        for(var i = 0; i< chapterUrls.length; i++){
	        var url = chapterUrls[i]
	        
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

        writeBook(current_book);

        var fetchContent = function (current_book, obj, text, callback) {
            var $ = cheerio.load(text);
            writeContent(current_book, obj.title,$('#content').html());
            callback(null, {
                num: obj.num,
                chapterTitle: obj.title,
                chapterContent: $('#content').text()
            });

        };

        async.mapLimit(current_book.chapters, 5, function (obj, callback) {
            superagent.get(cnodeUrl + obj.url)
            	.charset('gbk')
                .end(function (err, res) {
                    console.log('fetch ' + obj.title + ' successful');
                    fetchContent(current_book, obj, res.text, callback);
                });
        }, function (err, result) {
                console.log('*********************************************************');
                console.log('final:');
                console.log(result);
            });
    });