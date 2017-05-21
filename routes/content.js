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
        var uuid=req.body.uuid;
        //var uuid='common';
        console.log('uuid:'+uuid);
        contentHelper.getArticle(uuid,function (callback) {
            res.send(callback);
        });
    }else if (method=='makeReview'){
        //首先获取uuid，进入对应数据库，再获取对应文章的id，修改其comments字段.用json表示每位用户的评论
        var uuid=req.body.fromwho;
        var content=req.body.content;
        var time=req.body.time;
        var writter=req.body.writter;
        var id=req.body.id;
        contentHelper.makeReviewByUUID(uuid,content,time,writter,id);

    }else if (method=='getReviewList'){
        var writter=req.body.writter;
        var id=req.body.id;
        contentHelper.getReviewListByWritterAndId(writter,id,function (callback) {
            console.log(callback);
            res.send(callback);
        })
    }
});
//   解析域名   /uuid/title   查看具体文章  查寻到数据库中的文章
//   该user对应的数据库中会有对应的url-不直接是文章名而是用一个uuid来表示一篇文章的名字
router.get(/^\/[a-z0-9]+\/[a-z0-9]+\/?$/,function (req, res, next) {
    var tmp=req.path.split(/\//);
    var user=tmp[1];
    var title=tmp[2];
    console.log('uuid:'+user+'  contenturl:'+title);
    contentHelper.getContentByUUIDandTitle(user,user+'/'+title,function (callback) {
       if (!callback){
           console.log('没找到该文章');
           res.send('NOT FOUND');
       }else {
           res.send(callback);
       }
    });
});

module.exports = router;
