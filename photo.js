/*
 * author:kebo
 * data:20170115
 * description:使用async.mapLimit()限制并发访问数量.
 * 爬取百度图片-美女
 */
var superagent = require('superagent');
var superagentCharset = require('superagent-charset');
var cheerio = require('cheerio');
// var url = require('url');
var async = require('async');
var fs = require('fs');

var request = require('request');

var mkdir = require('./utils').mkdir;

var chapters = [];

var cnodeUrl = "http://www.t66y.com/htm_data/7/1612/2178873.html";
superagentCharset(superagent);

superagent.get(cnodeUrl)
    .charset('gbk')
    .end(function(err, res) {
        if (err) {
            return console.error(err);
        }
        var chapterUrls = [];
        var $ = cheerio.load(res.text);
        chapterUrls = $('img');

        console.log('chapterUrls Length : ' + chapterUrls.length);

        for (var i = 0; i < chapterUrls.length; i++) {
            var url = chapterUrls[i]
            var _url = $(url).attr('src') + "";
            chapters.push(_url);
        }

        console.log(chapters);

        var download = function(url, dir, filename) {
            request.head(url, function(err, res, body) {
                request(url).pipe(fs.createWriteStream("/home/Kebolcz/crawler/dist/" + dir + "/" + filename));
            });
        };

        var dir = 'tyy_nine';

        mkdir(dir);

        chapters.forEach(function(element) {
            console.log('正在下载' + element);
            download(element, dir, Math.floor(Math.random() * 100000) + element.substring(-4, 4));
            console.log('下载完成');
        });
    });
