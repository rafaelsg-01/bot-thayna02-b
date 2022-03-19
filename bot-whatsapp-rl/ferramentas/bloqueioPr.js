const schedule = require('node-schedule')
const Fom = require('./fomIdNum.js')
const Mdb = require('../../mysql-db/index/Mdb.js')

var dicArmzDesBlock = {}

async function setDesBlockInDB(idNumF, tempoF){
    try {
      var dicDesBlock = {
        numerocDB: idNumF, 
        numerofDB: Fom.fomIdNum(idNumF), 
        nomeDB: 'SemNome',
        estadoDB: '0.00', 
        novidadesDB: '2',
        desblockDB: tempoF
    } ; const insertNovoUsuario = await Mdb.insertUsa(dicDesBlock)
  }
  catch {
    var dicDesBlock = {
      quandoForDB: idNumF,
      trocaDB: 'desblockdb', 
      paraDB: tempoF
    } ; Mdb.updateUsa(dicDesBlock)
  }
}


async function setDesBlock(client, dic){

  var idNumU = typeof(dic.idNum) === 'undefined' ? ('SemId') : (dic.idNum)
  var minU = typeof(dic.min) === 'undefined' ? (0) : (dic.min)
  var horU = typeof(dic.hor) === 'undefined' ? (0) : (dic.hor)
  var diaU = typeof(dic.dia) === 'undefined' ? (0) : (dic.dia)
  var stringTimeU = typeof(dic.stringTime) === 'undefined' ? ('n') : (dic.stringTime)
  if (idNumU === 'SemId') {throw "setDesBlock() Não recebeu IdNum"}




  if (stringTimeU === 'n') {
    var dateDesBlock = new Date()
  }
  else {
    var dateDesBlock = new Date(stringTimeU)
  }


  dateDesBlock.setMinutes(dateDesBlock.getMinutes() + minU)
  dateDesBlock.setHours(dateDesBlock.getHours() + horU)
  dateDesBlock.setDate(dateDesBlock.getDate() + diaU)

  var dataAtual = new Date() ; dataAtual.setMinutes(dataAtual.getMinutes() + 0)

  


  var varIdDesBlock = 'ub' + Fom.fomIdNum(idNumU)

  if (dataAtual >= dateDesBlock) {

    cancelarDesBlock(idNumU)

    client.unblockContact(idNumU)
    setDesBlockInDB(idNumU, '0')
    delete dicArmzDesBlock[varIdDesBlock]
    
  }
  
  else {
    cancelarDesBlock(idNumU)
    
    setDesBlockInDB(idNumU, dateDesBlock.toISOString())

    dicArmzDesBlock[varIdDesBlock] = schedule.scheduleJob(dateDesBlock, function(idNum, ubID, clientS){

      clientS.unblockContact(idNum)
      setDesBlockInDB(idNum, '0')
      delete dicArmzDesBlock[ubID]

    }.bind(null, idNumU, varIdDesBlock, client))
  }
}


async function desBlockProgramado(client){
  var dicDesBlock = {
    quandoDB: 'NOT desblockdb',
    forDB: '0',
    mostraDB: 'numerocdb, desblockdb',
    variosDB: true}

    const dicReceDesBlock = await Mdb.getUsa(dicDesBlock) 

    for (let i = 0 ; i < dicReceDesBlock.length ; i++) {
      let varToDic = {idNum:dicReceDesBlock[i].numerocdb, stringTime:dicReceDesBlock[i].desblockdb}
      await setDesBlock(client, varToDic)
    }
}


function cancelarDesBlock(idNumF) {
  var varIdDesBlock = 'ub' + Fom.fomIdNum(idNumF)

  if (varIdDesBlock in dicArmzDesBlock) {
    dicArmzDesBlock[varIdDesBlock].cancel()
  }
  
}


//desBlockProgramado(client)


//setDesBlock(client, {idNum: '553187134999@c.us', min: 1})




module.exports = {
  desBlockProgramado,
  setDesBlock
}