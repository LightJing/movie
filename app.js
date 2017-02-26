//入口文件
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var _ = require('underscore');
var moment = require('moment');
var Movie = require('./models/movie');
var port  = process.env.PORT ||3000 ;
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var app = express();

mongoose.connect('mongodb://localhost/imooc');

app.set('views','./views/pages');
app.set('view engine','pug');
app.use(bodyParser.urlencoded({extended:true}));  //bodyParser已经不再与express捆绑，需要独立安装 npm install body-parser
app.use(bodyParser.json());
app.use(serveStatic('public'));//获取静态资源的路径
app.locals.moment = require('moment');
app.listen(port);

console.log('imooc started on port'+ port);

//路由的编写
//index page
app.get('/index',function(req,res) {
    Movie.fetch(function (err,movies) {
        if(err){
            console.log(err);
        }
        res.render('index',{
            title:'imooc 首页',
            movies:movies
        });//get接受请求
    });
});
//detail page
app.get('/movie/:id',function (req,res) {          //get接受请求
    var id = req.params.id;
    Movie.findById(id,function (err,movie) {
        res.render('detail',{                   //返回
            title:'imooc'+movie.title,
            movie:movie
        })
    });
});
//admin page
app.get('/admin/movie',function (req,res) {          //get接受请求
    res.render('admin',{                   //返回
        title:'imooc录入页',
        movie:{
            title:'',
            doctor:'',
            country:'',
            year:'',
            poster:'',
            language:'',
            flash:'',
            summary:''
        }
    })
});
//admin updata movie
app.get('/admin/update/:id',function (req,res) {
    var id = req.params.id;
    if(id){
        Movie.findById(id,function (err,movie) {
            res.render('admin',{
                title:'imooc录入页',
                movie:movie
            });
        })
    }
});
//admin post movie
app.post('/admin/movie/new',function (req,res){
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var  _movie;
    if(id !== ""){   //已经定义过
        Movie.findById(id,function (err,movie) {
            if(err){
                console.log(err);
            }
            _movie = _.extend(movie,movieObj);
            _movie.save(function (err,movie) {
                if(err){
                    console.log(err);
                }
                res.redirect('/movie/'+movie._id);
            })
        })
    }else{
        _movie = new Movie({
            doctor:movieObj.doctor,
            title:movieObj.title,
            country:movieObj.country,
            language:movieObj.language,
            year:movieObj.year,
            poster:movieObj.poster,
            summary:movieObj.summary,
            flash:movieObj.flash
        })
        _movie.save(function (err,movie) {
            if(err){
                console.log(err);
            }
            res.redirect('/movie/'+movie._id);
        })
    }
});

//list page
app.get('/admin/list',function (req,res) {          //get接受请求
    Movie.fetch(function (err,movies) {
        if(err){
            console.log(err);
        }
        res.render('list',{                   //返回
            title:'imooc列表页',
            movies:movies
        })
    });
});
//list delete movie
app.delete('/admin/list',function (req,res) {
    var id = req.query.id;
    if(id){
        Movie.remove({_id:id},function (err,movie) {
            if(err){
                console.log(err);
            }else{
                res.json({success:1})
            }
        })
    }
});