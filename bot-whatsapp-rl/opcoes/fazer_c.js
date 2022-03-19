
const DicT = require('../dicusuarios.js')
const Lim = require('../ferramentas/limpaDic.js')
const MsgP = require('./msg_padrao.js')
const Ctt = require('../ferramentas/ctt.js')


async function fazer_cI(dicInf) {
    var client = dicInf['idCli']
    var message = dicInf['idMsg']
    var primeira = dicInf['idPri']
    var idNum = message.from
    var estado = await DicT.getEstado(idNum)

    if (primeira) {
        var buttons = [{"buttonText": {"displayText": "#Enviar comentário"}}]
        await client.sendButtons(idNum, `Sua opinião é muito importante para nós! 🙂\n\n*Por favor, escreva seu comentário abaixo:*`, buttons, `_Assim que terminar clique no botão 👇🏼_`)

        DicT.postEstado(idNum, '9.00')
        Lim.defiTemp(idNum, 300, 'estadodb', '1.00')
    }

    else if (message.body === '#Enviar comentário') {
        client.startTyping(idNum)
        await client.sendText(Ctt.admin, `Comentário - ${idNum}:\n_Comentário Finalizado_`)
        await client.sendText(idNum, `Comentário enviado! ✅\n\nMuito obrigado pela sua opinião, faremos o possível para sempre melhorar 😁`)

        client.startTyping(idNum)
        await MsgP.msg_padrao(idNum, client)
        Lim.defiTemp(idNum, 60, 'estadodb', '1.00')
    }

    else if (estado === '9.00') {
        if (message.type === 'chat' && message.body.length <= 2750) {
            await client.sendText(Ctt.admin, `Comentário - ${idNum}:\n\n${message.body}`)
        }
        else if (message.type !== 'chat') {
            await client.sendText(Ctt.admin, `Comentário - ${idNum}:\nTipo: ${message.type}\n_Mensagem Inválida_`)
        }
        else {
            await client.sendText(Ctt.admin, `Comentário - ${idNum}:\n_Excesso de caractere_`)
        }

        Lim.defiTemp(idNum, 240, 'estadodb', '1.00')
    }
}


module.exports = {
    fazer_cI
}