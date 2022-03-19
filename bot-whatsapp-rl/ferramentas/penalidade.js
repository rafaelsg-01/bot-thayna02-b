

const Fom = require('./fomIdNum.js')
const Blo = require('./bloqueioPr.js')
const DicT = require('../dicusuarios.js')

var dicPen = {}
var listPenTemp = []
var listErrTemp = []

var resetPen = 190000

async function penaliza(idNumF, pontosF, clientF) {
    var varPe = 'Pe' + Fom.fomIdNum(idNumF)
    if (varPe in dicPen) {
        if ('pen' in dicPen[varPe]) {
            var pontosAtual = dicPen[varPe]['pen'] += pontosF
            if (listPenTemp.indexOf(varPe) <= -1) {setTimeout(setaPont0, resetPen, varPe) ; listPenTemp.push(varPe)}
            if (listErrTemp.indexOf(varPe) <= -1) {setTimeout(setaErro0, 86400000, varPe) ; listErrTemp.push(varPe)}

            if (pontosAtual >= 10) {
                switch (dicPen[varPe]['erro']) {
                    case 0:
                        await clientF.sendText(idNumF, `Notamos uma quantidade excessiva de mensagens, estaremos bloqueando este contato por 5 minutos visando a segurança de nosso sistema.`)
                        DicT.delEstado(idNumF)
                        await clientF.blockContact(idNumF)
                        Blo.setDesBlock(clientF, {idNum: idNumF, min: 5}) ; break

                    case 1:
                        await clientF.sendText(idNumF, `Notamos uma quantidade excessiva de mensagens, estaremos bloqueando este contato por 15 minutos visando a segurança de nosso sistema.`)
                        DicT.delEstado(idNumF)
                        await clientF.blockContact(idNumF)
                        Blo.setDesBlock(clientF, {idNum: idNumF, min: 15}) ; break

                    case 2:
                        await clientF.sendText(idNumF, `Notamos uma quantidade excessiva de mensagens, estaremos bloqueando este contato por 30 minutos visando a segurança de nosso sistema.`)
                        DicT.delEstado(idNumF)
                        await clientF.blockContact(idNumF)
                        Blo.setDesBlock(clientF, {idNum: idNumF, min: 30}) ; break

                    case 3:
                        await clientF.sendText(idNumF, `Notamos uma quantidade excessiva de mensagens, estaremos bloqueando este contato por 1 hora visando a segurança de nosso sistema.`)
                        DicT.delEstado(idNumF)
                        await clientF.blockContact(idNumF)
                        Blo.setDesBlock(clientF, {idNum: idNumF, hor: 1}) ; break
                    case 4:
                        await clientF.sendText(idNumF, `Notamos uma quantidade excessiva de mensagens, estaremos bloqueando este contato por 2 horas visando a segurança de nosso sistema.`)
                        DicT.delEstado(idNumF)
                        await clientF.blockContact(idNumF)
                        Blo.setDesBlock(clientF, {idNum: idNumF, hor: 2}) ; break
                    case 5:
                        await clientF.sendText(idNumF, `Notamos uma quantidade excessiva de mensagens, estaremos bloqueando este contato por 4 horas visando a segurança de nosso sistema.`)
                        DicT.delEstado(idNumF)
                        await clientF.blockContact(idNumF)
                        Blo.setDesBlock(clientF, {idNum: idNumF, hor: 4}) ; break
                    case 6:
                        await clientF.sendText(idNumF, `Notamos uma quantidade excessiva de mensagens, estaremos bloqueando este contato por 8 horas visando a segurança de nosso sistema.`)
                        DicT.delEstado(idNumF)
                        await clientF.blockContact(idNumF)
                        Blo.setDesBlock(clientF, {idNum: idNumF, hor: 8}) ; break
                    default:
                        await clientF.sendText(idNumF, `Notamos uma quantidade excessiva de mensagens, estaremos bloqueando este contato por 12 horas visando a segurança de nosso sistema.`)
                        DicT.delEstado(idNumF)
                        await clientF.blockContact(idNumF)
                        Blo.setDesBlock(clientF, {idNum: idNumF, hor: 12}) ; break
                  }
                dicPen[varPe]['erro'] += 1
                dicPen[varPe]['pen'] = 0
            }
        }
    } else {
        dicPen[varPe] = {pen: pontosF , erro: 0}
        if (listPenTemp.indexOf(varPe) <= -1) {setTimeout(setaPont0, resetPen, varPe) ; listPenTemp.push(varPe)}
        if (listErrTemp.indexOf(varPe) <= -1) {setTimeout(setaErro0, 86400000, varPe)} ; listErrTemp.push(varPe)}
    console.log()
    console.log(dicPen)
    console.log()
}




function setaPont0(varPeF){
    dicPen[varPeF]['pen'] = 0

    if (listPenTemp.indexOf(varPeF) >= 0) {
        listPenTemp.splice(listPenTemp.indexOf(varPeF), 1)
    }
}

function setaErro0(varPeF){
    delete dicPen[varPeF]

    if (listErrTemp.indexOf(varPeF) >= 0) {
        listErrTemp.splice(listErrTemp.indexOf(varPeF), 1)
    }
    if (listPenTemp.indexOf(varPeF) >= 0) {
        listPenTemp.splice(listPenTemp.indexOf(varPeF), 1)
    }
}

//Pen.penaliza(idNumF, pontosF, clientF)

module.exports = {
    penaliza
}