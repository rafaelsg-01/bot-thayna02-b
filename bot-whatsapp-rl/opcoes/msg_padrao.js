
const DicT = require('../dicusuarios.js')
const Lis = require('./lista.js')
const Lim = require('../ferramentas/limpaDic.js')



async function msg_padrao(idNum, client) {
    DicT.postEstado(idNum, '1.00')
    const getNome = await DicT.getEstado(idNum, valor='nome')
    DicT.postEstado(idNum, valor=getNome, key='nome')
    Lim.defiTemp(idNum, 120, 'estadodb', '1.00')

    await client.sendListMenu(idNum, `Olá *${getNome}*!\nComo posso ajudar?\n`, 
        '', '_Escolha uma opção 👇🏼_', 'O que deseja? 🤔', Lis.lista)
} 


module.exports = {
    msg_padrao
}