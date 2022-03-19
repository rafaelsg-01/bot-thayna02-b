
const DicT = require('../dicusuarios.js')
const Lim = require('../ferramentas/limpaDic.js')
const Mdb = require('../../mysql-db/index/Mdb.js')
const Fom = require('../ferramentas/fomIdNum.js')
const Lis = require('./lista.js')
const Cap = require('../ferramentas/capitalize.js')
const MsgA = require('./deseja_a.js')
const Aten = require('../ferramentas/atendentes.js')
const Fgrp = require('../ferramentas/procuragrup.js')


async function conversar_cI(dicInf) {
    var client = dicInf['idCli']
    var message = dicInf['idMsg']
    var primeira = dicInf['idPri']
    var idNum = message.from
    var estado = await DicT.getChato(idNum, 'estado')
    var nomeEsc = await DicT.getEstado(idNum, 'nome')
    var novidades = await DicT.getEstado(idNum, 'novidades')

    
    if (primeira) {
        
        await client.sendText(
            idNum,
            `° ᴰᶦᵍᶦᵗᵉ "ˢᵃᶦʳ" ᵖᵃʳᵃ ˢᵃᶦʳ
Em alguns minutos um de nossos atendentes irá entrar em contato 😁
            
Aguarde...`
        )
		
		try {
			var nomeDef = (await client.getNumberProfile(idNum)).pushname
        }catch {var nomeDef = "/none/"}
		
        var criaGrup = await client.createGroup(`12 - ${nomeEsc}`, Aten.atendLista)

        var idGrup = criaGrup.gid._serialized

        DicT.postEstado(idNum, idGrup, 'grupo')

        console.log(idGrup)
            
        setTimeout(async function(client, idGrup, nomeDef, nomeEsc, novidades){
            try {
                var dataAtual = new Date() ; dataAtual.setMinutes(dataAtual.getMinutes() + (-3*60) + 15)
                var dataFormatada = dataAtual.toISOString().substr(11, 5)

                await client.setGroupDescription(idGrup, `Nome definido: *${nomeDef}*\nNome escolhido: *${nomeEsc}*\nNovidades: *${novidades}*`)
                await client.sendText(idGrup, `_Mensagem do sistema:_\n\nNome definido: *${nomeDef}*\nNome escolhido: *${nomeEsc}*\nNovidades: *${novidades}*\nChat será fechado às *${dataFormatada}*`)
            } 
            catch {}
        }, 7000, client, idGrup, nomeDef, nomeEsc, novidades)

        DicT.postEstado(idNum, '5.00')
        Lim.defiTemp(idNum, 60, 'estadodb', '1.00')
    }

    else if (estado === '5.00' || (Aten.atendLista.includes(message.author) && message.isGroupMsg === true)) {

        if (message.isGroupMsg === true) {
            var idNumP = Fgrp.procuraIdnum(message.from)

            if (message.body.toLowerCase() === '/finaliza-chat') {
                await client.sendText(idNumP, `_Conversa com atendente finalizada_`)

                client.startTyping(idNumP)
                await MsgA.deseja_a(idNumP, client)
            
                DicT.postEstado(idNumP, '1.00')
                Lim.defiTemp(idNumP, 60, 'estadodb', '1.00')
            }
            else {
                await client.sendText(idNumP, `*[leticia]*\n${message.body}`)

                Lim.defiTemp(idNumP, 15, 'estadodb', '1.00', 
                {idNumP: idNumP , client: client , MsgA: MsgA , idGrup: message.from ,
                    funFuCon: async function() {
                        this.client.startTyping(this.idNumP) ;
                        await this.client.sendText(this.idNumP, `_Conversa finalizada automaticamente_`) ; 
                        this.client.startTyping(this.idNumP) ;
                        await this.MsgA.deseja_a(this.idNumP, this.client) ; 
                        await this.client.sendText(this.idGrup, `_Conversa finalizada automaticamente_`)}})
            }
        }

        else if (message.isGroupMsg === false) {
            var idGrup = DicT.getChato(idNum, 'grupo')
            await client.sendText(idGrup, `${message.body}`)

            Lim.defiTemp(idNum, 15, 'estadodb', '1.00', 
            {idNum: idNum , client: client , MsgA: MsgA , idGrup: idGrup,
                funFuCon: async function() {
                    this.client.startTyping(this.idNum) ;
                    await this.client.sendText(this.idNum, `_Conversa finalizada automaticamente_`) ; 
                    this.client.startTyping(this.idNum) ;
                    await this.MsgA.deseja_a(this.idNum, this.client) ; 
                    await this.client.sendText(this.idGrup, `_Conversa finalizada automaticamente_`)}})
        }
    }
}

module.exports = {
    conversar_cI
}