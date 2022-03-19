
const venom = require('venom-bot')
//const schedule = require('node-schedule')
const Shell = require('shelljs')
const opc = require('./opcoes/unifica_o.js')
const DBz = require("../mysql-db/index/DBz.js")
const DicT = require('./dicusuarios.js')
const liCo = require('./lista_conte.js')
const Fom = require('./ferramentas/fomIdNum.js')
const Blo = require('./ferramentas/bloqueioPr.js')
const Pen = require('./ferramentas/penalidade.js')
const MsgP = require('./opcoes/msg_padrao.js')
const Lim = require('./ferramentas/limpaDic.js')
const Ctt = require('./ferramentas/ctt.js')
const Aten = require('./ferramentas/atendentes.js')

//atualiza-bot-quando-da-erro
//log-contabiliza-escolhas
//pensar-em-um-jogo-legal
//pessoa-pode-mudar-o-estado-apenas-selecioando-lista-em-qualquer-momento
//separar-lista-em-seções

venom
  .create({
    session: 'wpp0', 
    multidevice: true,
    mkdirFolderToken: './bot-thayna03/bot-whatsapp-rl/'
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

// ---------------------- //
DBz.conectaDB(true)

var dicChatoTemp = {}

function naoChato(idNum, varCt) {
  DicT.postEstado(idNum, 0, 'chato')
  delete dicChatoTemp[varCt]
  delete dicTempDelet[varCt]
}

var dicTempDelet = {}

function contabilizaChato(varDlF) {
  if (varDlF in dicTempDelet) {    
    dicTempDelet[varDlF] = dicTempDelet[varDlF] + 1
    return true
  }
  else {   
    dicTempDelet[varDlF] = 0
    return true
  }
}

async function deletaMsg(idNumF, MsgF, clientF) {
  await clientF.deleteMessageAll(idNumF, MsgF)
  .then((res) => {
    console.log(res + ' Delete: ' + MsgF);
  })
  .catch((erro) => {
    console.log(erro + ' Delete: ' + MsgF);
  });
}
// ---------------------- //

async function start(client) {
	
  await client.sendText(Ctt.admin, `_Mensagem do sistema:_\n_Bot Thayna foi *iniciado!*_`)
  
  Blo.desBlockProgramado(client)

  await client.onAck( async (ack) => {

    if (ack.ack !== 1 || ack.ack !== 0) {
      var varCt = 'Ct' + Fom.fomIdNum(ack.to)

      clearInterval(dicChatoTemp[varCt])
      dicChatoTemp[varCt] = setTimeout(naoChato, 680, ack.to, varCt)
    }
  })

  await client.onMessage( async (message) => {
    var numIsGrup = message.isGroupMsg === false
    //var numIsGrup = message.isGroupMsg === false && (message.from === '553187134336@c.us' || message.from === '553189530880@c.us' || message.from === '553189651565@c.us')
    var spam = true
    var spamEspecial = false
    var idNum = message.from
	  var msgAdmin = false
    
    var ramoAtendente = DicT.getChato(idNum, valor='estado') === '5.00' || (Aten.atendLista.includes(message.author) && message.isGroupMsg === true)


    if (numIsGrup !== true && DicT.getChato(message.from) !== 1) {
	  var dataAtual = new Date() ; dataAtual.setHours(-3) ; var dataAtualF = dataAtual.toUTCString()
	  console.log()
	  console.log(`Mensagem fora do escopo:`)
	  console.log(`Tipo:      ${message.type}`)
	  console.log(`Numero:    ${message.from}`)
	  console.log(`Conteudo:  ${message.body}`)
	  console.log(`Data/Hora: ${dataAtualF}`)
	  console.log()
    }

    if (idNum === "status@broadcast") {
      idNum = "0000000000@g.us"
      console.log("status@broadcast")
    }

    else if (ramoAtendente) {
      var estadoC = await DicT.getEstado(idNum, valor='estado')
      var estadoF = estadoC.substr(0, estadoC.indexOf('.'))
      var mensagem
      typeof(message.body) === 'undefined' ? (mensagem = '' , message.body = '') : (mensagem = message.body.toLowerCase())
      var mensagemF = mensagem

      if ((mensagemF === '#sair' && (estadoF !== '0' && estadoC !== 'SemNome')) || (mensagemF === 'sair' && (estadoF !== '0' && estadoC !== 'SemNome'))) {
        await MsgP.msg_padrao(idNum, client)
        Lim.defiTemp(idNum, 60, 'estadodb', '1.00')
        //console.log(returnMsg)
      }
      else {
        var dicInf = {idCli: client, idMsg: message, idPri: false}
        const returnMsg = await opc.conversar_c(dicInf)
      }
    }

    else if (numIsGrup) {
      var estadoC = await DicT.getEstado(idNum, valor='estado')
      if (estadoC === '9.00') {DicT.postEstado(idNum, 2, 'chato')}


      if (DicT.getChato(idNum) !== 1) {
        client.sendSeen(idNum)
        if (DicT.getChato(idNum) !== 2) {
          client.startTyping(idNum)
        }
      }
	  
	  // ----------------- 
      if (message.from === Ctt.admin && (typeof(message.body) === 'undefined' ? (false) : (true))) {
        if (message.body.substr(0, 1) === '/') {
          if (message.body.toLowerCase() === '/help' || message.body.toLowerCase() === '/h') {
            var buttons = [{"buttonText": {"displayText": "/reinicia-bot"}}, {"buttonText": {"displayText": "/atualiza-bot"}}, {"buttonText": {"displayText": "/log"}}]

            await client.sendButtons(Ctt.admin, `_Mensagem do sistema:_`, buttons, `_Opções de admin:_`)
            await client.sendText(Ctt.admin, `/comando-node=`)
            await client.sendText(Ctt.admin, `/comando-cmd=`)
            msgAdmin = true
            //envia-comandos-admin
          }
          else if (message.body.toLowerCase() === '/reinicia-bot') {
            await client.sendText(Ctt.admin, `_Mensagem do sistema:_\n_Bot Thayna está sendo *reiniciado...*_`)
            msgAdmin = true
            Shell.exec('/root/Desktop/reinicia-apenas-o-bot.sh').code
            //reinicia bot
          }
          else if (message.body.toLowerCase() === '/atualiza-bot') {
            await client.sendText(Ctt.admin, `_Mensagem do sistema:_\n_Bot Thayna está sendo *atualizado...*_`)
            msgAdmin = true
            Shell.exec('/root/Desktop/atualiza-apenas-o-bot.sh').code
            //atualiza-bot
          }
          else if (message.body.toLowerCase() === '/log') {
            var dataAtual = new Date() ; dataAtual.setHours(dataAtual.getHours() + -3)
            var dataFormatada = dataAtual.toISOString().replace(':', '.').replace(':', '.').replace('T', '_')
            var nomeLogData = "BT_" + dataFormatada.substr(0, 19)
            
            await client.sendFile(Ctt.admin, '/root/Desktop/thaynaProducao.log', `${nomeLogData}.txt`, nomeLogData)
            msgAdmin = true
            //envia-log
          }
          else if (message.body.substr(0, 14).toLowerCase() === '/comando-node=') {
            var comandoEnviado = message.body.substr(14).trim()
            await client.sendText(Ctt.admin, `_Mensagem do sistema:_\n_Comando *solicitado:*_\n\n${comandoEnviado}`)
            msgAdmin = true

            var respostaEval = await eval(comandoEnviado)

            await client.sendText(Ctt.admin, `_Mensagem do sistema:_\n_*Return do comando:*_\n\n${respostaEval}`)
            //envia-comando-node
          }
          else if (message.body.substr(0, 13).toLowerCase() === '/comando-cmd=') {
            var comandoEnviado = message.body.substr(13).trim()
            await client.sendText(Ctt.admin, `_Mensagem do sistema:_\n_Comando *solicitado:*_\n\n${comandoEnviado}`)
            msgAdmin = true
          
            var resComando = Shell.exec(comandoEnviado)
            var codeC = resComando.code
            var outC = resComando.stdout
            var errC = resComando.stderr
            
            if (codeC === 0) {
              await client.sendText(Ctt.admin, `_Mensagem do sistema:_\n_*Saida do comando:*_\n\n${outC}`)
              await client.sendText(Ctt.admin, `_Mensagem do sistema:_\n_Status do comando:_\n*Concluido com sucesso!*`)
            }
            else {
              await client.sendText(Ctt.admin, `_Mensagem do sistema:_\n_*Saida do comando:*_\n\n${errC}`)
              await client.sendText(Ctt.admin, `_Mensagem do sistema:_\n_Status do comando:_\n*Erro na execução!*`)
            }
            //envia-comando-cmd
          }
          else {
            await client.sendText(Ctt.admin, `_Mensagem do sistema:_\n_Comando *inválido!*_`)
          }
        }
      }
	   // ----------------- 


     // ----------------- 
      if (((message.type !== 'chat' && message.type !== 'buttons_response' && message.type !== 'list_response') || 
      (estadoC !== '9.00' && message.type === 'chat' && (typeof(message.body) === 'undefined' ? (0) : (message.body.length)) >= 1150) ||
      (estadoC === '9.00' && message.type === 'chat' && (typeof(message.body) === 'undefined' ? (0) : (message.body.length)) >= 2750)) && msgAdmin === false){

        var chatoSpam = DicT.getChato(idNum)
        DicT.postEstado(idNum, 1, 'chato')
        if (estadoC === '9.00') {DicT.postEstado(idNum, 2, 'chato')}
        
        if (chatoSpam === 1 || chatoSpam === 2) {
          var varDl = 'Ct' + Fom.fomIdNum(idNum)
          if (contabilizaChato(varDl)){
            setTimeout(deletaMsg, 4000 + (2000 * dicTempDelet[varDl]), idNum, message.id, client)
          }
        }

        else {
          setTimeout(deletaMsg, 2000, idNum, message.id, client)
        }
        
        if (estadoC === '9.00' && message.type === 'chat' && (typeof(message.body) === 'undefined' ? (0) : (message.body.length)) >= 2750) {
          if (chatoSpam !== 1) {
            await client.sendText(idNum, `Por favor, não mande mensagens tão grandes 🙂\nDivida ela em partes.`)
            spamEspecial = true
          }
            console.log('Ganhou penalidade: ' + idNum + ' ; Ganho: ' + 1.5)
          await Pen.penaliza(idNum, 1.5, client)
        }

        else if (estadoC !== '9.00' && message.type === 'chat' && (typeof(message.body) === 'undefined' ? (0) : (message.body.length)) >= 1150) {
          if (chatoSpam !== 1) {
            await client.sendText(idNum, `Por favor, não mande mensagens tão grandes 🙂`)
            spamEspecial = true
          }
            console.log('Ganhou penalidade: ' + idNum + ' ; Ganho: ' + 1.5)
          await Pen.penaliza(idNum, 1.5, client)
        }

        else if (message.type === 'multi_vcard' && (typeof(message.vcardList) === 'undefined' ? (0) : (message.vcardList.length)) >= 9) {
          if (chatoSpam !== 1) {
            await client.sendText(idNum, `Por favor, não mande contatos 🙂`)
          }
            console.log('Ganhou penalidade: ' + idNum + ' ; Ganho: ' + 1)
          await Pen.penaliza(idNum, 1, client)
        }

        else if (message.type === 'audio' || message.type === 'ptt') {
          if (chatoSpam !== 1) {
            await client.sendText(idNum, `Desculpe-me, mas não sou capaz de ouvir audio 😕`)
            spamEspecial = true
          }
            console.log('Ganhou penalidade: ' + idNum + ' ; Ganho: ' + 1)
          await Pen.penaliza(idNum, 1, client)
        }

        else if (message.type === 'location') {
          if (chatoSpam !== 1) {
            await client.sendText(idNum, `Por favor, não mande localizações 🙂`)
          }
            console.log('Ganhou penalidade: ' + idNum + ' ; Ganho: ' + 2)
          await Pen.penaliza(idNum, 2, client)
        }

        else if (message.type === 'document') {
          if (chatoSpam !== 1) {
            await client.sendText(idNum, `Por favor, não mande arquivo 🙂`)
          }
            console.log('Ganhou penalidade: ' + idNum + ' ; Ganho: ' + 1)
          await Pen.penaliza(idNum, 1, client)
        }

        else if (message.type === 'image') {
          if (chatoSpam !== 1) {
            await client.sendText(idNum, `Por favor, não mande imagem 🙂`)
            spamEspecial = true
              console.log('Ganhou penalidade: ' + idNum + ' ; Ganho: ' + 0.7)
            await Pen.penaliza(idNum, 0.7, client)
          }
        }

        else if (message.type === 'vcard' || message.type === 'multi_vcard') {
          if (chatoSpam !== 1) {
            await client.sendText(idNum, `Por favor, não mande contato 🙂`)
          }
            console.log('Ganhou penalidade: ' + idNum + ' ; Ganho: ' + 1)
          await Pen.penaliza(idNum, 2, client)
        }

        else if (message.type === 'video') {
          if (chatoSpam !== 1) {
            await client.sendText(idNum, `Por favor, não mande video 🙂`)
            spamEspecial = true
              console.log('Ganhou penalidade: ' + idNum + ' ; Ganho: ' + 0.5)
            await Pen.penaliza(idNum, 1, client)
          }
        }

        else if (message.type === 'sticker') {
          if (chatoSpam !== 1) {
            
              await client.sendText(idNum, `Por favor, não mande figurinhas 🙂`)
              spamEspecial = true
            
          }
            console.log('Ganhou penalidade: ' + idNum + ' ; Ganho: ' + 0.5)
          await Pen.penaliza(idNum, 1, client)
        }

        else {
          if (chatoSpam !== 1) {
            client.sendText(idNum, `Conteúdo inválido 😕`)
          }
            console.log('Ganhou penalidade: ' + idNum + ' ; Ganho: ' + 1)
          await Pen.penaliza(idNum, 1, client)
        }
        
        var varCt = 'Ct' + Fom.fomIdNum(idNum)
        clearInterval(dicChatoTemp[varCt])
        dicChatoTemp[varCt] = setTimeout(DicT.postEstado, 60000, idNum, 0, 'chato')
      }
      
      else {
        spam = false
      }
     // -----------------
    
      if (((DicT.getChato(message.from) !== 1 && spam === false) || spamEspecial === true) && msgAdmin === false) {
        
        DicT.postEstado(idNum, 1, 'chato')
        if (estadoC === '9.00') {DicT.postEstado(idNum, 2, 'chato')}


        var estadoC = await DicT.getEstado(idNum, valor='estado')
        var estadoF = estadoC.substr(0, estadoC.indexOf('.'))
        var mensagem
        typeof(message.body) === 'undefined' ? (mensagem = '' , message.body = '') : (mensagem = message.body.toLowerCase())
        var mensagemF = mensagem.substr(mensagem.indexOf('\n')+1)

		  var dataAtual = new Date() ; dataAtual.setHours(-3) ; var dataAtualF = dataAtual.toUTCString()
		  console.log()
		  console.log(`Mensagem dentro do escopo:`)
		  console.log(`Tipo:      ${message.type}`)
		  console.log(`Numero:    ${message.from}`)
		  console.log(`Conteudo:  ${message.body}`)
		  console.log(`Data/Hora: ${dataAtualF}`)
		  console.log()


        var varCt = 'Ct' + Fom.fomIdNum(idNum)
        clearInterval(dicChatoTemp[varCt])
        dicChatoTemp[varCt] = setTimeout(DicT.postEstado, 60000, idNum, 0, 'chato')


// Estado no Banco de Dados deve sempre ter o numero '1.' no começo. O unico que muda o estado no Banco de Dados é a função opc.introducao(dicInf).
// Requisito para mudar o estado no Banco de Dados é NENHUM, alem de '0.' e '1.'   Para mudar estado de DB precisa criar uma função parecida com Block, 
// que mesmo apos ser desligado, ainda consegue executar comando ao iniciar. Comando esse que seria a mudança de estado em função do time setado
        
        var dicInf = {idCli: client, idMsg: message, idPri: false}
        if (estadoF === '1') {dicInf.idPri = true}

        console.log(estadoF)
        console.log(estadoC)

        if ((mensagemF === '#sair' && (estadoF !== '0' && estadoC !== 'SemNome')) || (mensagemF === 'sair' && (estadoF !== '0' && estadoC !== 'SemNome'))) {
          await MsgP.msg_padrao(idNum, client)
          Lim.defiTemp(idNum, 60, 'estadodb', '1.00')
          //console.log(returnMsg)
        }

        else if ((liCo.lista_alterar_n.indexOf(mensagemF) >= 0 && estadoF === '1') || estadoF === '2') {
          const returnMsg = await opc.alterar_n(dicInf)
          //console.log(returnMsg)
        }

        else if ((liCo.lista_ativar_n.indexOf(mensagemF) >= 0 && estadoF === '1') || estadoF === '3') {
          const returnMsg = await opc.ativar_n(dicInf)
          //console.log(returnMsg)
        }

        else if ((liCo.lista_cancelar_e.indexOf(mensagemF) >= 0 && estadoF === '1') || estadoF === '4') {
          const returnMsg = await opc.cancelar_e(dicInf)
          //console.log(returnMsg)
        }

        else if ((liCo.lista_conversar_c.indexOf(mensagemF) >= 0 && estadoF === '1') || estadoF === '5') {
          const returnMsg = await opc.conversar_c(dicInf)
          //console.log(returnMsg)
        }

        else if ((liCo.lista_desativar_n.indexOf(mensagemF) >= 0 && estadoF === '1') || estadoF === '6') {
          const returnMsg = await opc.desativar_n(dicInf)
          //console.log(returnMsg)
        }

        else if ((liCo.lista_devolucao_r.indexOf(mensagemF) >= 0 && estadoF === '1') || estadoF === '7') {
          const returnMsg = await opc.devolucao_r(dicInf)
          //console.log(returnMsg)
        }

        else if ((liCo.lista_entrega_i.indexOf(mensagemF) >= 0 && estadoF === '1') || estadoF === '8') {
          const returnMsg = await opc.entrega_i(dicInf)
          //console.log(returnMsg)
        }

        else if ((liCo.lista_fazer_c.indexOf(mensagemF) >= 0 && estadoF === '1') || estadoF === '9') {
          const returnMsg = await opc.fazer_c(dicInf)
          //console.log(returnMsg)
        }

        else if ((liCo.lista_jogar_u.indexOf(mensagemF) >= 0 && estadoF === '1') || estadoF === '10') {
          const returnMsg = await opc.jogar_u(dicInf)
          //console.log(returnMsg)
        }

        else if ((liCo.lista_nossas_r.indexOf(mensagemF) >= 0 && estadoF === '1') || estadoF === '11') {
          const returnMsg = await opc.nossas_r(dicInf)
          //console.log(returnMsg)
        }

        else if (((liCo.lista_participar_d.indexOf(mensagemF) >= 0 && estadoF === '1') || estadoF === '12') || message.body.toLowerCase() === 'instagram do sorteio!') {
          const returnMsg = await opc.participar_d(dicInf)
          //console.log(returnMsg)
        }

        else if ((liCo.lista_qual_o.indexOf(mensagemF) >= 0 && estadoF === '1') || estadoF === '13') {
          const returnMsg = await opc.qual_o(dicInf)
          //console.log(returnMsg)
        }

        else if ((liCo.lista_quem_s.indexOf(mensagemF) >= 0 && estadoF === '1') || estadoF === '14') {
          const returnMsg = await opc.quem_s(dicInf)
          //console.log(returnMsg)
        }

        else if ((liCo.lista_rastrear_e.indexOf(mensagemF) >= 0 && estadoF === '1') || estadoF === '15') {
          const returnMsg = await opc.rastrear_e(dicInf)
          //console.log(returnMsg)
        }

        else if ((liCo.lista_segunda_v.indexOf(mensagemF) >= 0 && estadoF === '1') || estadoF === '16') {
          const returnMsg = await opc.segunda_v(dicInf)
          //console.log(returnMsg)
        }

        else {
          const returnMsg = await opc.introducao(dicInf)
          //console.log(returnMsg)
        }

  

      }
    }
  })
}
