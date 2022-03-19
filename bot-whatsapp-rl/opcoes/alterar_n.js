
const DicT = require('../dicusuarios.js')
const Lim = require('../ferramentas/limpaDic.js')
const Mdb = require('../../mysql-db/index/Mdb.js')
const Cap = require('../ferramentas/capitalize.js')
const MsgP = require('./msg_padrao.js')


// mensagem-padrao em arquivo separado ###
// criar chato ###
// escrevendo ###
// timeout 


async function alterar_nI(dicInf) {
    var client = dicInf['idCli']
    var message = dicInf['idMsg']
    var primeira = dicInf['idPri']
    var idNum = message.from
    var estado = await DicT.getEstado(idNum)
    

    if (primeira) {
        await client.sendText(idNum, `Claro! Farei isso agora, me diga,\n\n*Como gostaria de ser chamado?* 😁`)

        DicT.postEstado(idNum, '2.00')
        Lim.defiTemp(idNum, 60, 'estadodb', '1.00')
    }

    else if (estado === '2.00') {
        let valorDigitado = Cap.capitalize(message.body)

        if (valorDigitado.length <= 15) {
            var buttons = [{"buttonText": {"displayText": "Sim"}}, {"buttonText": {"displayText": "Não"}}]
            await client.sendButtons(idNum, `O nome abaixo está correto?\n🤔     *${valorDigitado}*\n`, buttons, `_Escolha uma opção:_`)
            DicT.postEstado(idNum, valorDigitado, 'nomeA')
            DicT.postEstado(idNum, '2.01')
            Lim.defiTemp(idNum, 60, 'estadodb', '1.00', 
                {idNum: idNum, funFuCon: function() {DicT.delElemento(this.idNum, 'nomeA')}})
        }

        else if (valorDigitado.length >= 15) {
            await client.sendText(idNum, `Foi mal, é permitido apenas um máximo de 15 caracteres 😕\n\n*Por favor, digite novamente:*`)
            DicT.postEstado(idNum, '2.00')
            Lim.defiTemp(idNum, 60, 'estadodb', '1.00')
        }
    }

    else if (estado === '2.01') {
        let valorDigitado = message.body.toLowerCase()

        var simLista = ['sim', 'ssss', 'sss', 'ss', 's', 'yes', 'y', 'positivo', 'exatamente', 'isso', 'esta', 'está', 'estar']
        var naoLista = ['não', 'nao', 'n', 'nn', 'nnn', 'ñ', 'errado', 'não esta', 'nao esta', 'incorreto', 'não está', 'nao está', 'not']
        if (simLista.indexOf(valorDigitado) >= 0) {
            await client.sendText(idNum, `Então está OK! 😄`)
            client.startTyping(idNum)

            const getNome = await DicT.getEstado(idNum, valor='nomeA')

            var dicUpdate = {
                quandoForDB: idNum,
                trocaDB: 'nomeDB', 
                paraDB: getNome} ; let atualizaNomeUsuario = await Mdb.updateUsa(dicUpdate)


            await client.sendText(idNum, `Olá *${getNome}*! Acabei de alterar seu nome, novamente é um prazer te conhecer! 😊`)
                
            DicT.postEstado(idNum, '1.00')
            DicT.postEstado(idNum, getNome, 'nome')
            DicT.delElemento(idNum, 'nomeA')
            
            client.startTyping(idNum)
            await MsgP.msg_padrao(idNum, client)

            Lim.defiTemp(idNum, 60, 'estadodb', '1.00')
        }

        else if (naoLista.indexOf(valorDigitado) >= 0) {
            await client.sendText(idNum, `Tudo bem! Pode repetir,\n\n*Como gostaria de ser chamado?* 😁`)
            
            DicT.delElemento(idNum, 'nomeA')
            DicT.postEstado(idNum, '2.00', 'estado')
            Lim.defiTemp(idNum, 60, 'estadodb', '1.00')
        }

        else {
            let nomeDigitadoAnterior = await DicT.getEstado(idNum, valor='nomeA')
            var buttons = [{"buttonText": {"displayText": "Sim"}}, {"buttonText": {"displayText": "Não"}}]
            await client.sendButtons(idNum, `O nome abaixo está correto?\n🤔     *${nomeDigitadoAnterior}*\n`, buttons, `_Escolha uma opção:_`)
            Lim.defiTemp(idNum, 60, 'estadodb', '1.00')
        }
    }
}

module.exports = {
    alterar_nI
}


