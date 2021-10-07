const data = require('./data.json');
const fs = require('fs');

//create
exports.post = function(req, res){
    const keys = Object.keys(req.body);

    for (const key of keys) {
        if(req.body[key] == "") return res.send("Please, fill all fields");


    }

    let { avatar_url, name, birth, education_level, type_of_class, services } = req.body;

    const id = Number(data.teachers.length + 1);
    birth = Date.parse(birth);


    data.teachers.push({
        id,
        avatar_url,
        name,
        birth,
        education_level,
        type_of_class,
        services
    })

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write file error!");

        return res.redirect("/teachers");
    })

}