module.exports = {
    age: function(timestamp){

        const today = new Date();
        const birthDate = new Date(timestamp);

        let age = today.getFullYear() - birthDate.getFullYear();

        const month = today.getMonth() - birthDate.getMonth();

        const day = today.getDate() - birthDate.getDate();

        if(month < 0 || month == 0 && day < 0){
            age--;
        }
        return age;
    },
    date: function(timestamp){
        const birth = new Date(timestamp);

        const year = birth.getUTCFullYear();
        const month = `0${birth.getUTCMonth() + 1}`.slice(-2);
        const day = `0${birth.getUTCDate()}`.slice(-2);

        return {
            day,
            month,
            year,
            iso: `${year}-${month}-${day}`,
            birthDay: `${day}/${month}`

        }
    },
    graduation: function(education_level){
        switch (education_level) {
            case '1':
                return 'Ensino Médio Completo';
            case '2':
                return 'Ensino Superior Completo';
            case '3':
                return 'Mestrado';
            case '4':
                return 'Doutorado';
            default:
                return 'Indefinido';
        }
    },
    grade: function(school_year){
        switch (school_year) {
            case '5ef':
                return '5º Ano do Ensino Fundamental';
            case '6ef':
                return '6º Ano do Ensino Fundamental';
            case '7ef':
                return '7º Ano do Ensino Fundamental';
            case '8ef':
                return '8º Ano do Ensino Fundamental';
            case '9ef':
                return '9º Ano do Ensino Fundamental';
            case '1em':
                return '1º Ano do Ensino Médio';
            case '2em':
                return '2º Ano do Ensino Médio';
            case '3em':
                return '3º Ano do Ensino Médio';  
            default:
                return 'Indefinido';
        }
    }
}