const { date, grade } = require('../../lib/utils');

module.exports = {
    index(req, res){
        return res.render("teachers/index", { teachers });
    },
    show(req, res){
        return;
    },
    create(req, res){
        return res.render("teachers/create");
    },
    post(req, res){
        return;
    },
    edit(req, res){
        return;
    },
    post(req, res){
        const keys = Object.keys(req.body);

        for (const key of keys) {
            if(req.body[key] == "") return res.send("Please, fill all fields");
        }

        let { avatar_url, name, birth, education_level, type_of_class, services } = req.body;

        return;
    },
    put(req, res){
        const keys = Object.keys(req.body);

        for (const key of keys) {
            if(req.body[key] == "") return res.send("Please, fill all fields");
        }

        let { avatar_url, name, birth, education_level, type_of_class, services } = req.body;

        return;
    },
    delete(req, res){
        return;
    },
}