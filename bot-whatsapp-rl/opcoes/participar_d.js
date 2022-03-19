

const DicT = require('../dicusuarios.js')
const Lim = require('../ferramentas/limpaDic.js')
const MsgP = require('./msg_padrao.js')
const MsgA = require('./deseja_a.js')



async function participar_dI(dicInf) {
    var client = dicInf['idCli']
    var message = dicInf['idMsg']
    var primeira = dicInf['idPri']
    var idNum = message.from
    var estado = await DicT.getEstado(idNum)

    if (message.body.toLowerCase() === 'instagram do sorteio!') {
        await client.sendLinkPreview(
            idNum,
            'https://instagram.com/techtudo_itabirito',
            'Boa sorte!  😁🍀🍀'
        )

        client.startTyping(idNum)
        await MsgA.deseja_a(idNum, client)

        DicT.postEstado(idNum, '1.00')
        Lim.defiTemp(idNum, 60, 'estadodb', '1.00')
    }

    else if (primeira) {
        await client.sendButtons(
            idNum,
            'Para participar de nossos sorteios é muito simples! 😁\n\n*1°*  Segue a gente no Instagram #⃣\n\n*2°*  Escolha qual sorteio você quer participar 😄\n\n*3°*  Curta a postagem do sorteio escolhido ♥️\n\n*4°*  Marque 2 amigos e pronto! 👥\n\nVocê já vai está participando! 🎉\n\nData de divulgação do vencedor vai está na descrição da postagem! *Boa sorte!* 😁', [{"buttonText": {"displayText": "Instagram do sorteio!"}}], 'Receber o link:'
        )
        
        client.startTyping(idNum)
        await MsgA.deseja_a(idNum, client)

        DicT.postEstado(idNum, '1.00')
        Lim.defiTemp(idNum, 300, 'estadodb', '1.00')
    }

    else {
        await MsgP.msg_padrao(idNum, client)
        Lim.defiTemp(idNum, 60, 'estadodb', '1.00')
    }
}


module.exports = {
    participar_dI
}