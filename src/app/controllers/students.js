const { date, grade } = require('../../lib/utils');
const Student = require('../models/student');

module.exports = {
    index(req, res){

        let { filter, page, limit } = req.query;

        page = page || 1;
        limit = limit || 2;
        let offset = limit * (page - 1);

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(students){
                const pagination = {
                    total: Math.ceil(students[0].total / limit),
                    page
                };

                let newStudents = students.map(student => {
                    let newStudent = {
                        ...student
                    };
                    newStudent["school_year"] = grade(student.school_year);
                    return newStudent;
                })

                return res.render("students/index", { students: newStudents, pagination, filter });
            }
        }

        Student.paginate(params);
      
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

        Student.teachersSelectOptions(function(teachers){
            return res.render("students/create", { teachers });

        })

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

            Student.teachersSelectOptions(function(teachers){

                return res.render("students/edit", { student, teachers });

            })
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