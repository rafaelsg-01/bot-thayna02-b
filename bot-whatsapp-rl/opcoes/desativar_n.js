
const DicT = require('../dicusuarios.js')
const Lim = require('../ferramentas/limpaDic.js')
const MsgA = require('./deseja_a.js')
const Mdb = require('../../mysql-db/index/Mdb.js')

async function desativar_nI(dicInf) {
    var client = dicInf['idCli']
    var message = dicInf['idMsg']
    var primeira = dicInf['idPri']
    var idNum = message.from
    
    if (primeira) {
        await client.sendText(
            idNum,
            `Suas Novidades Semanais foram *desativadas* 😕 🔇

Lembre-se que você poderá reativar elas a qualquer momento 😄`
        )
        
        var dicUpdate = {
            quandoForDB: idNum,
            trocaDB: 'novidadesdb', 
            paraDB: "0"} ; let ativaNovidades = await Mdb.updateUsa(dicUpdate)

        client.startTyping(idNum)
        await MsgA.deseja_a(idNum, client)
    
        DicT.postEstado(idNum, '1.00')
        Lim.defiTemp(idNum, 60, 'estadodb', '1.00')
    }
}

module.exports = {
    desativar_nI
}