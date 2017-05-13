var express = require('express');
var router = express.Router();
var contentHelper=require('../dao/ContentHelper');
var fileSystem=require('fs');

/* GET content listing. */
router.post('/', function(req, res, next) {
    var method=req.header('method');
    console.log('method: '+method);
    if (method=='insertpassage'){
        var uuid=req.body.uuid;
        var title=req.body.title;
        var content=req.body.content;
        console.log('uuid:'+uuid);
        console.log('title:'+title);
        console.log('content:'+content);
        contentHelper.insertPassage(uuid,title,content);
        res.send('test');
    }else if (method=='getMyArticleList'){
        //var uuid=req.body.uuid;
        var uuid='common';
        contentHelper.getArticle(uuid,function (callback) {
            res.send(callback);
        });
    }
});
//   解析域名   /uuid/title   查看具体文章  查寻到数据库中的文章
router.get(/^\/[a-z0-9]+\/[a-z0-9]+\/?$/,function (req, res, next) {
    var tmp=req.path.split(/\//);
    var user=tmp[1];
    var title=tmp[2];
    console.log(user+':'+title);
    contentHelper.getContentByUUIDandTitle(user,title,function (callback) {
       if (!callback){
           console.log('没找到该文章');
           res.send('NOT FOUND');
       }else {
           res.send(callback);
       }
    });
});

module.exports = router;
