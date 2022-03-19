
const DicT = require('../dicusuarios.js')
const Lim = require('../ferramentas/limpaDic.js')
const MsgA = require('./deseja_a.js')

async function quem_sI(dicInf) {
    var client = dicInf['idCli']
    var message = dicInf['idMsg']
    var primeira = dicInf['idPri']
    var idNum = message.from
    
    if (primeira) {
        await client.sendText(
            idNum,
            `⠀⠀⠀Nós somos a,
⠀ _*Tech Tudo Store*_ ❕
            
A *principal idéia de nossa loja* é dar a oportunidade de nossos clientes terem os *gadgets* mais *únicos* e *úteis* que existem no mercado, com o intuito de *facilitar a vida* de quem os usa. 🦾 🏆
            
Diariamente *nossa equipe insisti* em *encontrar* produtos que de alguma forma possa *ajudar* ou que seja *interessante* o suficiente de se ter, focando sempre em *qualidade* e *usabilidade*. 📊 📐
            
Todas as transações feitas em nossa loja são *100% seguras*, utilizando de tecnologias muito *bem consolidadas* no mercado, fazendo assim que não exista *nenhum risco* durante o pagamento dos itens. Visamos sempre a *segurança* e *integridade* de qualquer dado dos nossos clientes 🔒✅
            
Todo *código de rastreio* é enviado para o comprador assim que sua *encomenda* é *postada nos correios*, caso você tenha qualquer dúvida sobre a _*Tech Tudo Store*_ entre em contato conosco para que possamos te *ajudar* da melhor forma possível. 🚛📦
            
Pode ficar tranquilo ou tranquila. Caso ocorra *qualquer imprevisto* durante a compra ou entrega, damos *reembolso total* para nossos clientes. 🔖💰
            
Muitos de nossos principais *fornecedores* são do *exterior*, por esse motivo o transporte das encomendas *podem levar algum tempo*, mas *não se preocupe* , você *receberá tudo que foi comprado* com a máxima qualidade. 🕑 🌎
            
Sempre estamos *felizes em receber elogios e criticas* sobre nossa loja, para que assim possamos *focar naquilo que importa*, e descartar aquilo que de alguma forma não satisfaz nossos clientes. 😁😁😄`
        )
        client.startTyping(idNum)
        await MsgA.deseja_a(idNum, client)
    
        DicT.postEstado(idNum, '1.00')
        Lim.defiTemp(idNum, 60, 'estadodb', '1.00')
    }
}

module.exports = {
    quem_sI
}