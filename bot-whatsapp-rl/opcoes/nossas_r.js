
const DicT = require('../dicusuarios.js')
const Lim = require('../ferramentas/limpaDic.js')
const MsgA = require('./deseja_a.js')

async function nossas_rI(dicInf) {
    var client = dicInf['idCli']
    var message = dicInf['idMsg']
    var primeira = dicInf['idPri']
    var idNum = message.from
    
    if (primeira) {
        await client.sendText(
            idNum,
            `Temos varias!  ⌲
😁
            
Instagram, 📸
instagram.com/techtudo
            
Tik Tok, 💃
tiktok.com/techtudo
            
Twitter, 🐦
twitter.com/techtudo
            
YouTube, ⏯️
youtube.com/techtudo
            
Facebook, 📣
facebook.com/techtudo
            
Pinterest, 🏞️
pinterest.com/techtudo

Segue lá!  😁`
        )
        client.startTyping(idNum)
        await MsgA.deseja_a(idNum, client)
    
        DicT.postEstado(idNum, '1.00')
        Lim.defiTemp(idNum, 60, 'estadodb', '1.00')
    }
}

module.exports = {
    nossas_rI
}