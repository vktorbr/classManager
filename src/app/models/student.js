const db = require('../../config/db');
const { date } = require('../../lib/utils');

module.exports = {
    all(callback){
        const query = `
            SELECT * FROM students ORDER BY name ASC
        `;

        db.query(query, function(err, results){
            if(err) throw `Database Error! ${err}`;

            callback(results.rows);
        })
    },
    create(data, callback){
        const query = `
            INSERT INTO students(
                avatar_url,
                name,
                email,
                birth,
                school_year,
                workload,
                teacher_id
            ) VALUES($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `;

        const values = [
            data.avatar_url,
            data.name,
            data.email,
            date(data.birth).iso,
            data.school_year,
            data.workload,
            data.teacher
        ];

        db.query(query, values, function(err, results){
            if(err) throw `Database Error! ${err}`;

            callback(results.rows[0]);
        })
    },
    find(id, callback){
        const query = `
            SELECT students.*, teachers.name AS teacher 
            FROM students
            LEFT JOIN teachers ON (students.teacher_id = teachers.id)
            WHERE students.id = $1
        `;

        db.query(query, [id], function(err, results){
            if(err) throw `Database Error! ${err}`;

            callback(results.rows[0]);
        })
    },
    update(data, callback){
        const query = `
            UPDATE students SET
                avatar_url=$1,
                name=$2,
                email=$3,
                birth=$4,
                school_year=$5,
                workload=$6,
                teacher_id=$7
            WHERE id = $8
        `;

        const values = [
            data.avatar_url,
            data.name,
            data.email,
            date(data.birth).iso,
            data.school_year,
            data.workload,
            data.teacher,
            data.id
        ];

        db.query(query, values, function(err){
            if(err) throw `Database Error! ${err}`;

            callback();
        })
    },
    delete(id, callback){
        const query = `
            DELETE FROM students WHERE id = $1
        `;

        db.query(query, [id], function(err){
            if(err) throw `Database Error! ${err}`;

            callback();
        })
    },
    teachersSelectOptions(callback){
        const query = `
            SELECT name, id
            FROM teachers
        `;

        db.query(query, function(err, results){
            if(err) throw `Database Error! ${err}`;

            callback(results.rows);
        })
    },
    paginate(params){
        let { filter, limit, offset, callback } = params;

        let query = "",
            filterQuery = "",
            totalQuery = `
                (
                    SELECT COUNT(*) FROM students
                ) AS total
            `;

            if(filter){
                filterQuery = `
                    WHERE students.name ILIKE '%${filter}%'
                    OR students.email ILIKE '%${filter}%'
                `;

                totalQuery = `
                    (
                        SELECT COUNT(*) FROM students
                        ${filterQuery}
                    ) AS total
                `;
            }

            query = `
                SELECT *, ${totalQuery}
                FROM students
                ${filterQuery}
                LIMIT $1 OFFSET $2
            `;

            db.query(query, [ limit, offset ], function(err, results){
                if(err) throw `Database Error! ${err}`;

                callback(results.rows);
            })
    }

}