/*
 * author:kebo
 * data:20170115
 * description:使用async.mapLimit()限制并发访问数量.
 * 异步访问url数组(page=1..3..4..99),筛选出该page下评论数大于stars的帖子,爬取并持久化该页面的<img>.
 * 爬取草榴图片-美女
 */

//
var superagent = require('superagent');
var superagentCharset = require('superagent-charset');
var cheerio = require('cheerio');
var async = require('async');
var fs = require('fs');
//帖子评论数
const stars = 500;
//可以用request的pipe方法很方便的获取图片的文件流
/*demo: request('https://www.google.com.hk/images/srpr/logo3w.png').pipe(fs.createWriteStream('doodle.png'));*/
var request = require('request');

var mkdir = require('./utils').mkdir;


var uri = [];
for (var i = 30; i < 100; i++) {
    uri.push('http://www.t66y.com/thread0806.php?fid=7&search=&page=' + i);
}

var download = function(url, dir, filename) {
    request.head(url, function(err, res, body) {
        request(url).pipe(fs.createWriteStream("/home/Kebolcz/crawler/dist/" + dir + "/" + filename));
    });
};

// var chaptersUri = [];
var fetchContent = function(url, folder, callback) {
    superagent.get(url)
        .end(function(err, res) {
            if (err) {
                return console.error(err);
            }
            var chapterUrls = [];
            var chapters = [];
            var $ = cheerio.load(res.text);
            chapterUrls = $('img');
            for (var i = 0; i < chapterUrls.length; i++) {
                // var url = chapterUrls[i];

                var _url = $(chapterUrls[i]).attr('src') + "";

                chapters.push(_url);
            }
            console.log("图片图片图片图片图片图片图片" + chapters);
            chapters.forEach(function(element) {
                console.log('正在下载' + url);
                download(element, folder, Math.floor(Math.random() * 100000) + element.substring(-4, 4));
                console.log('下载完成');
            });
        })

};

async.mapLimit(uri, 20, function(obj, callback) {
    superagentCharset(superagent);
    superagent.get(obj)
        .charset('gbk')
        .end(function(err, res) {
            if (err) {
                return console.error(err);
            }
            console.log('fetch ' + obj + ' successful');
            var $ = cheerio.load(res.text);
            console.log('stars ' + $('.tr3 td').eq(3).text() + ' *******');
            if ($('.tr3 td').eq(3).text() >= stars) {
                console.log('this is the a good site************************');
                var chapterUrl = "http://www.t66y.com/" + $('.tr3 td').eq(1).find('a').attr('href');
                var folder = $('.tr3 td').eq(1).find('a').text().trim();
                console.log("选出来的site地址是------------->" + chapterUrl);
                mkdir(folder);
                // chaptersUri.push($('.tr3 td').eq(2).find('a').attr('href')+'');
                fetchContent(chapterUrl, folder, callback);
            }
        });
}, function(err, result) {
    console.log('*********************************************************');
    console.log('END');
    // console.log(result);
    console.log(result);
});
