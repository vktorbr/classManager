const db = require('../../config/db');
const { date, grade } = require('../../lib/utils');

module.exports = {
    all(callback){
        const query = `
            SELECT teachers.*, COUNT(students) AS total_students
            FROM teachers
            LEFT JOIN students ON (teachers.id = students.teacher_id)
            GROUP BY teachers.id
            ORDER BY name DESC
        `;

        db.query(query, function(err, results){
            if(err) throw `Database Error! ${err}`;

            callback(results.rows);
        })
    },
    create(data, callback){
        const query = `
            INSERT INTO teachers(
                avatar_url,
                name,
                birth_date,
                education_level,
                class_type,
                subjects_taught,
                created_at
            )VALUES($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `;

        const values = [
            data.avatar_url,
            data.name,
            date(data.birth).iso,
            data.education_level,
            data.type_of_class,
            data.services,
            date(Date.now()).iso
        ];

        db.query(query, values, function(err, results){
            if(err) throw `Database Error! ${err}`;

            callback(results.rows[0]);
        })
    },
    find(id, callback){
        const query = `
            SELECT * FROM teachers WHERE id = $1
        `;

        db.query(query, [id], function(err, results){
            if(err) throw `Database Error! ${err}`;

            callback(results.rows[0]);
        })
    },
    update(data, callback){
        const query = `
            UPDATE teachers SET
                avatar_url=$1,
                name=$2,
                birth_date=$3,
                education_level=$4,
                class_type=$5,
                subjects_taught=$6
            WHERE id = $7
        `;

        const values = [
            data.avatar_url,
            data.name,
            date(data.birth).iso,
            data.education_level,
            data.type_of_class,
            data.services,
            data.id
        ];

        db.query(query, values, function(err){
            if(err) throw `Database Error! ${err}`;

            callback();
        })
    },
    delete(id, callback){
        const query = `
            DELETE FROM teachers WHERE id = $1
        `;

        db.query(query, [id], function(err){
            if(err) throw `Database Error! ${err}`;

            callback();
        })
    },
    findBy(filter, callback){
        const query = `
            SELECT teachers.*, COUNT(students) AS total_students
            FROM teachers
            LEFT JOIN students ON(teachers.id = students.teacher_id)
            WHERE teachers.name ILIKE '%${filter}%'
            OR teachers.subjects_taught ILIKE '%${filter}%'
            GROUP BY teachers.id
            ORDER BY total_students DESC
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
                    SELECT COUNT(*) FROM teachers
                ) AS total
            `;

            if(filter){
                filterQuery = `
                    WHERE teachers.name ILIKE '%${filter}%'
                    OR teachers.subjects_taught ILIKE '%${filter}%'
                `;

                totalQuery = `
                    (
                        SELECT COUNT(*) FROM teachers
                        ${filterQuery}
                    ) AS total
                `;
            }

            query = `
                SELECT teachers.*, ${totalQuery}, COUNT(students) AS total_students
                FROM teachers
                LEFT JOIN students ON(teachers.id = students.teacher_id)
                ${filterQuery}
                GROUP BY teachers.id
                LIMIT $1 OFFSET $2
            `;

            db.query(query, [ limit, offset ], function(err, results){
                if(err) throw `Database Error! ${err}`;

                callback(results.rows);
            })
    }
}