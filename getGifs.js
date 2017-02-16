/*
 * author:kebo
 * data:20170117
 * description:crawler
 * 异步访问url数组(page=1..3..4..99),筛选出该page下评论数大于stars的帖子,爬取并持久化该页面的<img>.
 * 爬取zol图片-美女
 */

var Crawler = require("crawler");
var superagent = require('superagent');
var request = require('request');
var fs = require('fs');
var jsdom = require('jsdom');
var cheerio = require('cheerio');
var async = require('async');

var mkdir = require('./utils').mkdir;


const stars = 500;
const indexFolder = 'zol壁纸/';

var indexUri = [];
for (var i = 1; i < 30; i++) {
    indexUri.push('http://desk.zol.com.cn/meinv/' + i + '.html');
}


// var download = function(url, dir, filename) {
//     console.log('$$$$$$$$$$$$$$' + url + '$$$$$$$$$$$$$$$$$$$$');
//     if (!(typeof(url) == 'undefined' || url == '')) {
//         request.head(url, function(err, res, body) {
//             console.log("downloading...");
//             request(url).pipe(fs.createWriteStream("/home/Kebolcz/crawler/dist/" + dir + "/" + filename));
//             console.log('下载完成');
//         });
//     }
// };


// var chaptersUri = [];
var fetchContent = function(url, folder, callback) {
    superagent.get(url)
        .end(function(err, res) {
            if (err) {
                return console.error(err);
            }
            // var chapterUrls = [];
            var chapters = [];
            var $ = cheerio.load(res.text);
            var chapterUrls = $('.photo-list-box').find('img');
            for (var i = 0; i < chapterUrls.length; i++) {
                // var url = chapterUrls[i];

                var _url = String($(chapterUrls[i]).attr('src')).replace('t_s144x90', 't_s960x600');
                var name = Math.floor(Math.random() * 100000);

                chapters.push({
                    url: _url,
                    name: name
                });
            }
            console.log(chapters);
            // console.log("图片图片图片图片图片图片图片" + chapters);
            async.mapLimit(chapters, 5, function(obj, callback) {
                console.log(obj);
                console.log('``````````````````typeof(obj.url)````````````````````````````````````' + !(typeof(obj.url) == 'undefined'));
                if (!(typeof(obj.url) == 'undefined' || obj.url == '')) {
                    console.log('正在下载' + obj.url);
                    // download(obj.url, folder, obj.name);
                    // request.head(obj.url, function(err, res, body) {
                    console.log("downloading...");
                    // console.log(res);
                    request(obj.url).pipe(fs.createWriteStream("/home/Kebolcz/crawler/dist/" + folder + "/" + obj.name));
                    console.log('下载完成');
                    // });
                }

            }, function(err, result) {
                console.log('*********************************************************');
            });

            // chapters.forEach(function(obj) {
            //     console.log(obj);
            //     console.log('``````````````````typeof(obj.url)````````````````````````````````````' + (typeof(obj.url) == 'undefined'));
            //     if (!(typeof(obj.url) == 'undefined')) {
            //         console.log('正在下载' + obj.url);
            //         download(obj.url, folder, obj.name);
            //     }
            // });
        })

};


var reqContent = function(cnodeUrl, folder) {
    superagent.get(cnodeUrl)
        .end(function(err, res) {
            if (err) {
                return console.error(err);
            }
            var chapters = [];
            var $ = cheerio.load(res.text);
            var chapterUrls = $('.photo-list-box').find('img');
            for (var i = 0; i < chapterUrls.length; i++) {
                var _url = String($(chapterUrls[i]).attr('src')).replace('t_s144x90', 't_s960x600');
                var name = Math.floor(Math.random() * 100000);
                chapters.push({
                    url: _url,
                    name: name
                });
            }
            console.log(chapters);

            var download = function(url, dir, filename) {
                request.head(url, function(err, res, body) {
                    request(url).pipe(fs.createWriteStream("/home/Kebolcz/crawler/dist/" + dir + "/" + filename));
                });
            };

            chapters.forEach(function(element) {
                console.log('正在下载' + element.url);
                download(element.url, folder, Math.floor(Math.random() * 100000) + element.name);
                console.log('下载完成');
            });
        });
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
            var pageNum = $(".pagecon").find('.active').text().trim();
            var tbodys = $(".photo-list-padding");
            console.log('fetch page' + pageNum + ' success!');

            async.mapLimit(tbodys, 100, function(element, callback) {
                var chapterHref = 'http://desk.zol.com.cn' + $(element).find('a').attr('href');
                var folder = indexFolder + $(element).find('span').attr('title');
                console.log("选出来的site地址是------------->" + chapterHref);
                mkdir(folder);
                reqContent(chapterHref, folder);
            }, function(err, result) {});
        }
        done();
    }
});

c.queue(indexUri);