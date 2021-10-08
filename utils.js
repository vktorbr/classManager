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
        const month = `0${birth.getUTCMonth() + 1}`.split(-2);
        const day = `0${birth.getUTCDate()}`.split(-2);

        return `${year}-${month}-${day}`;
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
    }
}