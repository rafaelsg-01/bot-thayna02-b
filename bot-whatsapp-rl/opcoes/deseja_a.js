
const DicT = require('../dicusuarios.js')
const Lis = require('./lista.js')
const Lim = require('../ferramentas/limpaDic.js')



async function deseja_a(idNum, client) {
    DicT.postEstado(idNum, '1.00')
    const getNome = await DicT.getEstado(idNum, valor='nome')
    DicT.postEstado(idNum, valor=getNome, key='nome')
    Lim.defiTemp(idNum, 120, 'estadodb', '1.00')

    await client.sendListMenu(idNum, `Olá *${getNome}*!`, 
        '', `Precisa de mais alguma\najuda? 🙂`, 'O que deseja? 🤔', Lis.lista)
} 


module.exports = {
    deseja_a
}