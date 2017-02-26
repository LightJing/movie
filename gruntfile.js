module.exports = function (grunt) {

    grunt.initConfig({
        watch:{
            jade:{
                files:['views/**'],
                options:{
                    livereload:true
                }
            },
            js:{
                files:['public/script/**','models/**/*.js','schemas/**/*.js'],
                //tasks:['jshint'],
                options:{
                    livereload:true    //文件改动的时候回重新启动
                }
            }
        },
        nodemon:{
            dev:{
                script:'app.js',
                options:{
                    args:['dev'],
                    nodeArgs:['--debug'],
                    callback:function (nodemon) {
                        nodemon.on('log',function (event) {
                            console.log(event.colour);
                        });
                    },
                    env:{
                        PORT:'3000'
                    },
                    cwd:__dirname,
                    ignore:['README.md','node_modules/**','.DS_Store'],
                    ext:'js,cpffee',
                    watch:['./'],
                    delay:1000,
                    legacyWatch:true
                }
            },
            exec:{
                options:{
                    exec:'less'
                }
            }
        },
        concurrent:{
            tasks:['nodemon','watch'],
            options:{
                logConcurrentOutput:true
            }
        }
    })

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');   //监控
    grunt.loadNpmTasks('grunt-concurrent');

    grunt.option('force',true);
    grunt.registerTask('default',['concurrent']);
};
