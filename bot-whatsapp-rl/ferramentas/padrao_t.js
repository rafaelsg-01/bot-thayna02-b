
const Mdb = require('../../mysql-db/index/Mdb.js')
const dicU = require('../dicusuarios.js')
const Fom = require('./fomIdNum.js')
const limpaDic = require('./limpaDic.js')

async function addEstadoDB(idNumCoLocP, mudarLocP, paraLocP) {
    var dicAddEstadoDB = {
        quandoForDB: idNumCoLocP,
        trocaDB: mudarLocP, 
        paraDB: paraLocP}
    await Mdb.updateUsa(dicAddEstadoDB)
}

function deleteEstadoDBlocal(idNumCoLocP) {
    dicU.delEstado(idNumCoLocP)
} 




module.exports = {
    addEstadoDB,
    deleteEstadoDBlocal
}
