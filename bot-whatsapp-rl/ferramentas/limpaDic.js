

const Fom = require('./fomIdNum.js')
const DicT = require('../dicusuarios.js')
const Mdb = require('../../mysql-db/index/Mdb.js')
const Pad = require('../ferramentas/padrao_t.js')



/* const dicChLoc = {
    Ch559923456781: setTimeout(dicFuLoc['Fu559923456781']['funFu'].bind(dicFuLoc['Fu559923456781']), 20000),
    Ch559923456782: setTimeout(dicFuLoc['Fu559923456782']['funFu'].bind(dicFuLoc['Fu559923456782']), 20000),
    Ch559923456783: setTimeout(dicFuLoc['Fu559923456783']['funFu'].bind(dicFuLoc['Fu559923456783']), 20000)
}

const dicFuLoc = {
    Fu559923456781: {idNumCoLoc: '559923456784@c.us' , mudarLoc: 'estadodb' , paraLoc: '1.00' , 
    funcaoLoc: {idNum: '559923456783@c.us' , funFuCon: function() {console.log(this.idNum)}} ,
    funFu: async function() {await this.funcaoLoc['funFuCon']() ; await padraoTemp(this.idNumCoLoc, this.mudarLoc, this.paraLoc)}},


    Fu559923456782: {idNumCoLoc: '559923456782@c.us' , mudarLoc: 'nomedb' , paraLoc: 'Rodrigo' ,
    funFu: async function() {await padraoTemp(this.idNumCoLoc, this.mudarLoc, this.paraLoc)}},


    Fu559923456783: {idNumCoLoc: '559923456783@c.us' , mudarLoc: 'estadodb' , paraLoc: '0.00' ,
    funFu: async function() {await padraoTemp(this.idNumCoLoc, this.mudarLoc, this.paraLoc)}}
} */

/* var dicLimpa_EXEMPLO = {
    idNumCoTD = '559923456784@c.us', // OBRIGARIO
    tempMinTD = 15, // OPCIONAL
    mudarTD = 'estadodb', // OPCIONAL
    paraTD = '1.00', // OPCIONAL
    funcaoTD = {idNum: '559923456784@c.us' , funFuCon: function() {console.log(this.idNum)}} // OPCIONAL

} ; defiTemp(dicLimpa_EXEMPLO)

defiTemp('559923456784@c.us')

defiTemp('559923456784@c.us', 15)

defiTemp('559923456784@c.us', 15, 'nomedb', 'Angela')

defiTemp('559923456784@c.us', 15, 'nomedb', 'Angela', {idNum: '559923456784@c.us' , funFuCon: function() {console.log(this.idNum)}}) */



// CHAMADA COMPLETA
/* {client: client , messageBody: message.body , messageID: message.id , idNum: idNum , 
    buttons: [{"buttonText": {"displayText": "Sim, esta correto"}}, {"buttonText": {"displayText": "Não, não esta correto"}}] ,
    funFuCon: async function() {
        await this.client.sendButtons(this.idNum, `Oi, você esta bem?`, this.buttons, `_Escolha uma opção:_`) ;
    }}) */


// CHAMADA SIMPLES
/* Lim.defiTemp(idNum, 60, 'estadodb', '0.00', 
                {idNum: idNum , funFuCon: function() {DicT.postEstado(this.idNum, '', 'nome')}}) */


// CHAMADA SUPER SIMPLES
/* Lim.defiTemp(idNum, 60, 'estadodb', '0.00') */



const dicChLoc = {}
const dicFuLoc = {}

var strOUdic_PADRAO = 'semId'
var tempMin_PADRAO = 30
var mudar_PADRAO = 'estadodb'
var para_PADRAO = '1.00'
var funcao_PADRAO = 'semFuncao'

function defiTemp(strOUdic=strOUdic_PADRAO, tempMinTF=tempMin_PADRAO, mudarTF=mudar_PADRAO, paraTF=para_PADRAO, funcaoTF=funcao_PADRAO) {

    if (typeof(strOUdic) === 'string') {
        var idNumCoLoc = strOUdic
        var tempMinLoc = tempMinTF
        var mudarLoc = mudarTF
        var paraLoc = paraTF
        var funcaoLoc = funcaoTF
    }

    else if (typeof(strOUdic) === 'object') {
        var idNumCoLoc = typeof(strOUdic.idNumCoTD) === 'undefined' ? (strOUdic_PADRAO) : (strOUdic.idNumCoTD)
        var tempMinLoc = typeof(strOUdic.tempMinTD) === 'undefined' ? (tempMin_PADRAO) : (strOUdic.tempMinTD)
        var mudarLoc = typeof(strOUdic.mudarTD) === 'undefined' ? (mudar_PADRAO) : (strOUdic.mudarTD)
        var paraLoc = typeof(strOUdic.paraTD) === 'undefined' ? (para_PADRAO) : (strOUdic.paraTD)
        var funcaoLoc = typeof(strOUdic.funcaoTD) === 'undefined' ? (funcao_PADRAO) : (strOUdic.funcaoTD)
    } ; if (idNumCoLoc === 'semId') {throw "defiTemp() Não recebeu strOUdic"}


    var idNumFo = Fom.fomIdNum(idNumCoLoc)
    var idTempCh = 'Ch' + idNumFo
    var idTempFu = 'Fu' + idNumFo


    if (funcaoLoc === 'semFuncao') {
        dicFuLoc[idTempFu] = {idNumCoLoc: idNumCoLoc , mudarLoc: mudarLoc , paraLoc: paraLoc ,
        funFu: async function() {await padraoTemp(this.idNumCoLoc, this.mudarLoc, this.paraLoc)}}
    } 
    
    else {
        dicFuLoc[idTempFu] = {idNumCoLoc: idNumCoLoc , mudarLoc: mudarLoc , paraLoc: paraLoc , funcaoLoc: funcaoLoc ,
        funFu: async function() {await this.funcaoLoc['funFuCon']() ; await padraoTemp(this.idNumCoLoc, this.mudarLoc, this.paraLoc)}}
    }

    clearInterval(dicChLoc[idTempCh])
    dicChLoc[idTempCh] = setTimeout(dicFuLoc[idTempFu]['funFu'].bind(dicFuLoc[idTempFu]), tempMinLoc * 60000)
}

async function padraoTemp(idNumCoLoc, mudarLoc, paraLoc) {
    await Pad.addEstadoDB(idNumCoLoc, mudarLoc, paraLoc)
    Pad.deleteEstadoDBlocal(idNumCoLoc)
    autoDestr(idNumCoLoc)
}

function autoDestr(idNumCoLocP) {
    var idNumFoP = Fom.fomIdNum(idNumCoLocP)

    var idTempChP = 'Ch' + idNumFoP
    var idTempFuP = 'Fu' + idNumFoP

    delete dicChLoc[idTempChP]
    delete dicFuLoc[idTempFuP]
}

// Não usar pois a função padraoTemp() precisa executar a função de excluir em dicusuarios
/* function limpTemp(idNumF) {
    var idNumFoP = Fom.fomIdNum(idNumF)

    var idTempChP = 'Ch' + idNumFoP
    var idTempFuP = 'Fu' + idNumFoP

    clearInterval(dicChLoc[idTempChP])
    delete dicChLoc[idTempChP]
    delete dicFuLoc[idTempFuP]
} */

module.exports = {
    defiTemp
}
