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
    connection.query('create table '+uuid+' (id int auto_increment primary key,title varchar(50),content longtext,url varchar(128)');
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
    var str=[title,content,url];
    connection.query('insert into '+uuid+' (title,content,url) values(?,?,?)',str);
    connection.query('insert into common (title,content,url) values(?,?,?)',str);
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
            jsonlist+='{\"title\":\"'+result[i].title+'\",\"contenturl\":\"'+result[i].url+'\"}';
        }
        jsonlist+=']}';
        console.log(jsonlist);
        callback(jsonlist);

    })
};
var getPassageByUUIDandTitle=function (uuid, title,callback) {
    connection.query('select * from '+uuid+' where url=\''+title+'\'',function (err, result, field) {
        if (err) throw err;
        if (result.length>0){
            callback(result[0].content);
        }else {
            callback(false);
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