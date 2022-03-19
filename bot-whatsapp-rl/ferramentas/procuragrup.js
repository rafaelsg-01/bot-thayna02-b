
const dicU = require('../dicusuarios.js')

function procuraIdnum(idGrup) {
    for (var i = 0; i < Object.keys(dicU.usuarios).length; i++) {
        var existi = Object.values(Object.values(dicU.usuarios)[i]).includes(idGrup)
        if (existi) {
            var idNumE =  Object.keys(dicU.usuarios)[i]
            return idNumE.substr(2) + '@c.us'
        }
    }
    return 0
}

module.exports = {
    procuraIdnum
}

