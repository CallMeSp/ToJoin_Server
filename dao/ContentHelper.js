/**
 * Created by Administrator on 2017/4/16.
 */
var mysql= require('mysql');
var fs=require('fs');
var UUID = require('node-uuid');
var connection=mysql.createConnection({
    host: "127.0.0.1",
    user: 'root',
    password: 'sp123456',
    database: 'passages'
});
connection.connect(function (err) {
    if (err){
        console.error(err);
        return;
    }
    console.log("passages connect id is "+connection.threadId);
});
var craeteTableForUser=function (uuid) {
    connection.query('create table '+uuid+' (id int auto_increment primary key,title varchar(50),content longtext,url varchar(128)，comments longtext)');
};
var insertPassage=function (uuid,title,content) {
    /*fs.writeFile("C:/Sp/WorkPlace/Passages/"+uuid+"/"+title+'.txt',content,function (err) {
       if (err){
           throw err;
       }
       console.log("成功创建文件")
    });*/
    //为每篇文章生成随机的url存进对应的title行;
    var url='u'+UUID.v1().replace(/-/g,'');
    var realurl=uuid+'/'+url;
    var str=[title,content,realurl];
    var str2=[title,realurl,uuid]
    connection.query('insert into '+uuid+' (title,content,url) values(?,?,?)',str);
    connection.query('insert into common (title,url,writter) values(?,?,?)',str2);
};
var getActicleList=function (uuid,callback) {
    connection.query('select * from '+uuid,function (err, result, field) {
        var size=result.length;
        var jsonlist='{\"list\":[';
        for(var i=0;i<size;i++){
            if (i!=0){
                jsonlist+=',';
            }
            //'\"content\":\"'+result[i].content+'\"'
            jsonlist+='{\"title\":\"'+result[i].title+'\",\"contenturl\":\"'+result[i].url+'\",\"id\":'+result[i].id+',\"writter\":\"'+result[i].writter+'\"}';
        }
        jsonlist+=']}';
        console.log(jsonlist);
        callback(jsonlist);

    })
};
var getPassageByUUIDandTitle=function (uuid, title,callback) {
    connection.query('select * from '+uuid+' where url=\''+title+'\'',function (err, result, field) {
        if (err) throw err;
        console.log(result);
        if (result.length>0){
            callback(result[0].content);
        }else {
            callback(false);
        }
    })
};
var makeReview=function (myuuid, content, time,writter,id) {
    connection.query('select * from '+writter+' where id='+id,function (err, result, field) {
        var currentcomments=result[0].comments;
        if (currentcomments==null){
            console.log('it is null');//new出一个新的json
        }else {
            //如果不为空则将旧的与新post的拼接起来。
            console.log('currentcomments:'+currentcomments);
            var newstrt=currentcomments.match(/\[.*\]/).toString();
            console.log('newstrt:'+newstrt);
            var finalstr=newstrt.match(/{.*}/);
            console.log('finalstr:'+finalstr);
            var toaddstr='{\"content\":\"'+content+'\",\"fromwho\":\"'+myuuid+'\",\"time\":\"'+time+'\"}';
            var finaljson='{"reviewlist":['+finalstr+','+toaddstr+']}';
            console.log('json:'+finaljson);
            connection.query('update '+writter+' set comments=? where id ='+id,finaljson);
        }
    });
    /*var jsonlist='{\"reviewlist\":[';
    jsonlist+='{\"content\":\"'+content+'\",\"fromwho\":\"'+myuuid+'\",\"time\":\"'+time+'\"}';
    jsonlist+=']}';
    var str=[jsonlist,id];
    connection.query('update '+writter+' SET comments= ? WHERE id = ?',str);*/
};
var getReviewList=function (writter, id,callback) {
    connection.query('select * from '+writter+' where id = '+id,function (err, result, field) {
        var comment=result[0].comments;
        if (comment!=null){
            callback(comment);
        }
    })
};
exports.createTable=function (uuid) {
    craeteTableForUser(uuid);
};
exports.insertPassage=function (uuid,title,content) {
    insertPassage(uuid,title,content);
};
exports.getArticle=function (uuid,callback) {
    getActicleList(uuid,callback);
};
exports.getContentByUUIDandTitle=function (uuid, title, callback) {
    getPassageByUUIDandTitle(uuid,title,callback);
};
exports.makeReviewByUUID=function (myuuid, content, time,writter,id) {
    makeReview(myuuid, content, time,writter,id)
};
exports.getReviewListByWritterAndId=function (writter, id,callback) {
    getReviewList(writter,id,callback);
};