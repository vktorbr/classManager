const data = require('../data.json');
const fs = require('fs');
const { date, grade } = require('../utils');

//index
exports.index = function(req, res){
    const students = data.students.map(student => {
        let new_student = {
            ...student
        };
        new_student['school_year'] = grade(student.school_year);
        return new_student;
    })
    return res.render("students/index", { students });
}

//show
exports.show = function(req, res){

    const { id } = req.params;

    const foundStudent = data.students.find(function(student){
        return student.id == id;
    })

    if(!foundStudent) return res.send("Student not found!");

    const student = {
        ...foundStudent,
        birth: date(foundStudent.birth).birthDay,
        school_year: grade(foundStudent.school_year)
    }

    return res.render('students/show', { student });
}

//create
exports.create = function(req, res){
    return res.render("students/create");
}

//post
exports.post = function(req, res){
    const keys = Object.keys(req.body);

    for (const key of keys) {
        if(req.body[key] == "") return res.send("Please, fill all fields");
    }

    let id = 1;
    const lastStudent = data.students[data.students.length - 1];

    if(lastStudent){
        id = lastStudent.id + 1;
    }

    const birth = Date.parse(req.body.birth);

    data.students.push({
        ...req.body,
        id,
        birth,
    })

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write file error!");

        return res.redirect("/students");
    })

}

//edit
exports.edit = function(req, res){
    const { id } = req.params;

    const foundStudent = data.students.find(function(student){
        return student.id == id;
    })

    if(!foundStudent) return res.send("Student not found!");

    const student = {
        ...foundStudent,
        birth: date(foundStudent.birth).iso
    }

    return res.render('students/edit', { student });
}

//é claro que um dia eu não vou conseguir
//mas esse dia não é hoje
//put
exports.put = function(req, res){
    const { id } = req.body;
    let index = 0;

    const foundStudent = data.students.find(function(student, foundIndex){
        if(id == student.id){
            index = foundIndex;
            return true;
        }
    })

    if(!foundStudent) return res.send('Student not found!');

    const student = {
        ...foundStudent,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id),
        services: req.body.services.split(',').map(item => item.trim())
    }

    data.students[index] = student;

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err){
        if(err) return res.send('Write file error!');
    })

    return res.redirect(`/students/${id}`);



}

//delete
exports.delete = function(req, res){
    const { id } = req.body;

    const filteredStudents = data.students.filter(function(student){
        return id != student.id;
    })

    data.students = filteredStudents;

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err){
        if(err) return res.send('Write File error!');

        return res.redirect('/students');
    })
}