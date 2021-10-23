const { date, grade } = require('../../lib/utils');
const Student = require('../models/student');

module.exports = {
    index(req, res){

        Student.all(function(students){
            return res.render("students/index", { students });
        })
    },
    show(req, res){
        Student.find(req.params.id, function(student){
            if(!student) return res.send("Student not found!");

            student.birth = date(student.birth).birthDay;
            student.school_year = grade(student.school_year);


            return res.render("students/show", { student });
        })
    },
    create(req, res){
        return res.render("students/create");
    },
    post(req, res){
        const keys = Object.keys(req.body);

        for (const key of keys) {
            if(req.body[key] == "") return res.send("Please, fill all fields!");
        }

        Student.create(req.body, function(student){
            return res.redirect(`/students/${student.id}`);
        })
    },
    edit(req, res){
        Student.find(req.params.id, function(student){
            if(!student) return res.send("Student not found!");

            student.birth = date(student.birth).iso;

            return res.render("students/edit", { student });
        })
    },
    put(req, res){
        const keys = Object.keys(req.body);

        for (const key of keys) {
            if(req.body[key] == "") return res.send("Please, fill all fields");
        }

        Student.update(req.body, function(){
            return res.redirect(`/students/${req.body.id}`);
        })
    },
    delete(req, res){
        Student.delete(req.body.id, function(){
            return res.redirect("/students");
        })
    },
}