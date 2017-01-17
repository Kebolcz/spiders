/*
 * author:kebo
 * data:20170116
 * description:crawler
 * 异步访问url数组(page=1..3..4..99),筛选出该page下评论数大于stars的帖子,爬取并持久化该页面的<img>.
 * 爬取草榴图片-美女
 */

var Crawler = require("crawler");
var superagent = require('superagent');
var request = require('request');
var fs = require('fs');
var jsdom = require('jsdom');
var cheerio = require('cheerio');

var mkdir = require('./utils').mkdir;


const stars = 500;
const indexFolder = '360壁纸/';

var indexUri = [];
for (var i = 1; i < 30; i++) {
    indexUri.push('http://bbs.360.cn/forum.php?mod=forumdisplay&fid=1406&page=' + i);
}


var download = function(url, dir, filename) {
    request.head(url, function(err, res, body) {
        request(url).pipe(fs.createWriteStream("/home/Kebolcz/crawler/dist/" + dir + "/" + filename));
    });
};


// var chaptersUri = [];
var fetchContent = function(url, folder) {
    superagent.get(url)
        .end(function(err, res) {
            if (err) {
                return console.error(err);
            }
            var chapterUrls = [];
            var chapters = [];
            var $ = cheerio.load(res.text);
            chapterUrls = $('#postlist div').eq(0).find('img');
            for (var i = 0; i < chapterUrls.length; i++) {
                // var url = chapterUrls[i];

                var _url = $(chapterUrls[i]).attr('src') + "";
                var name = $(chapterUrls[i]).attr('aid') + "";

                chapters.push({
                    url: _url,
                    name: name
                });
            }
            console.log("图片图片图片图片图片图片图片" + chapters);
            chapters.forEach(function(obj) {
                console.log(obj);
                if(typeof(obj.url) != 'undefined' && typeof(obj.name) != 'undefined'){
                    console.log('正在下载' + obj.url);
                    download(obj.url, folder, Math.floor(Math.random() * 100000) + obj.name.substring(-4, 4));
                    console.log('下载完成');
                }
            });
        })

};

var c = new Crawler({
    jQuery: jsdom,
    maxConnections: 2,
    forceUTF8: true,
    // This will be called for each crawled page 
    callback: function(error, res, done) {
        if (error) {
            console.log(error);
        } else {
            var $ = res.$;
            // $ is Cheerio by default 
            //a lean implementation of core jQuery designed specifically for the server 
            var pageNum = $(".pg strong").text().trim();
            var tbodys = $("#threadlisttableid tbody[id^='normalthread']");
            console.log('fetch page' + pageNum + ' success!');
            tbodys.map(function(index, element) {
                if ($(element).find('.viewnum').text().trim() >= stars) {
                    console.log('this is the a good site************************');
                    var chapterHref = $(element).find('.xst').attr('href');
                    var folder = indexFolder + $(element).find('.xst').text().trim();
                    console.log("选出来的site地址是------------->" + chapterHref);
                    mkdir(folder);
                    fetchContent(chapterHref, folder);
                }
            });

        }
        done();
    }
});

c.queue(indexUri);
