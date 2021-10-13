const data = require('../data.json');
const fs = require('fs');
const { age, graduation, date } = require('../utils');

//index
exports.index = function(req, res){    
    return res.render("teachers/index", { teachers: data.teachers });
}

//show
exports.show = function(req, res){

    const { id } = req.params;

    const foundTeacher = data.teachers.find(function(teacher){
        return teacher.id == id;
    })

    if(!foundTeacher) return res.send("Teacher not found!");

    const teacher = {
        ...foundTeacher,
        age: age(foundTeacher.birth),
        education_level: graduation(foundTeacher.education_level),
        created_at: new Intl.DateTimeFormat('pt-BR').format(foundTeacher.created_at)
    }

    return res.render('teachers/show', { teacher });
}

//create
exports.create = function(req, res){
    return res.render("teachers/create");
}

//post
exports.post = function(req, res){
    const keys = Object.keys(req.body);

    for (const key of keys) {
        if(req.body[key] == "") return res.send("Please, fill all fields");


    }

    let { avatar_url, name, birth, education_level, type_of_class, services } = req.body;

    let id = 1;
    const lastTeacher = data.teachers[data.teachers.length - 1];

    if(lastTeacher){
        id = lastTeacher.id + 1;
    }

    birth = Date.parse(birth);
    const created_at = Date.now();
    services = services.split(',').map(item => item.trim());

    data.teachers.push({
        id,
        avatar_url,
        name,
        birth,
        education_level,
        type_of_class,
        services,
        created_at
    })

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write file error!");

        return res.redirect("/teachers");
    })

}

//edit
exports.edit = function(req, res){
    const { id } = req.params;

    const foundTeacher = data.teachers.find(function(teacher){
        return teacher.id == id;
    })

    if(!foundTeacher) return res.send("Teacher not found!");

    const teacher = {
        ...foundTeacher,
        birth: date(foundTeacher.birth).iso
    }

    return res.render('teachers/edit', { teacher });
}

//put
exports.put = function(req, res){
    const { id } = req.body;
    let index = 0;

    const foundTeacher = data.teachers.find(function(teacher, foundIndex){
        if(id == teacher.id){
            index = foundIndex;
            return true;
        }
    })

    if(!foundTeacher) return res.send('Teacher not found!');

    const teacher = {
        ...foundTeacher,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id),
        services: req.body.services.split(',').map(item => item.trim())
    }

    data.teachers[index] = teacher;

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err){
        if(err) return res.send('Write file error!');
    })

    return res.redirect(`/teachers/${id}`);



}

//delete
exports.delete = function(req, res){
    const { id } = req.body;

    const filteredTeachers = data.teachers.filter(function(teacher){
        return id != teacher.id;
    })

    data.teachers = filteredTeachers;

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err){
        if(err) return res.send('Write File error!');

        return res.redirect('/teachers');
    })
}