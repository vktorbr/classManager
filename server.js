const express = require('express');
const nunjucks = require('nunjucks');
const routes = require('./routes');

const server = express();

server.use(express.urlencoded({ extended:true }))
server.use(express.static('public'));
server.use(routes);

//configuracao da view engine
server.set('view engine', 'njk');

//configuracao do nunjucks
nunjucks.configure('views', {
    express:server,
    autoescape: false,
    noCache: true 
})

server.get('/', function(req, res){
    const about = {
        avatar_url: 'https://avatars.githubusercontent.com/u/33494087?v=4',
        name: 'Vktor Martins',
        role: 'Desenvolvedor - Front-end',
        description: 'Estudante de programação full-stack',
        links: [
            { name: 'Github', url: 'https://github.com/vktorbr' }, 
            { name: 'Instagram', url: 'https://www.instagram.com/cabravitu/' },
            { name: 'Linkedin', url: 'https://www.linkedin.com/in/vktorbr/' },
        ]
    }

    return res.render('about', { about });
})

server.get('/portfolio', function(req, res){
    return res.render('portfolio', { items: videos });
})

server.get("/video", function(req, res){
    const id = req.query.id;

    const video = videos.find(function(video){
        return video.id == id
    }) 

    if(!video)
        return res.send("video not found");

    res.render("video", {item: video});
})

server.listen(5001, function(){
    console.log('server is running');
})
