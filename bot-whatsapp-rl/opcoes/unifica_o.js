


const Ralterar_n = require('./alterar_n.js')
const Rativar_n = require('./ativar_n.js')
const Rcancelar_e = require('./cancelar_e.js')
const Rconversar_c = require('./conversar_c.js')
const Rdesativar_n = require('./desativar_n.js')
const Rintroducao = require('./introducao.js')
const Rdevolucao_r = require('./devolucao_r.js')
const Rentrega_i = require('./entrega_i.js')
const Renviar_m = require('./enviar_m.js')
const Rfazer_c = require('./fazer_c.js')
const Rjogar_u = require('./jogar_u.js')
const Rnossas_r = require('./nossas_r.js')
const Rparticipar_d = require('./participar_d.js')
const Rqual_o = require('./qual_o.js')
const Rquem_s = require('./quem_s.js')
const Rrastrear_e = require('./rastrear_e.js')
const Rsegunda_v = require('./segunda_v.js')

async function alterar_n(dicInf) {Ralterar_n.alterar_nI(dicInf)}
async function ativar_n(dicInf) {Rativar_n.ativar_nI(dicInf)}
async function cancelar_e(dicInf) {Rcancelar_e.cancelar_eI(dicInf)}
async function conversar_c(dicInf) {Rconversar_c.conversar_cI(dicInf)}
async function desativar_n(dicInf) {Rdesativar_n.desativar_nI(dicInf)}
async function introducao(dicInf) {Rintroducao.introducaoI(dicInf)}
async function devolucao_r(dicInf) {Rdevolucao_r.devolucao_rI(dicInf)}
async function entrega_i(dicInf) {Rentrega_i.entrega_iI(dicInf)}
async function enviar_m(dicInf) {Renviar_m.enviar_mI(dicInf)}
async function fazer_c(dicInf) {Rfazer_c.fazer_cI(dicInf)}
async function jogar_u(dicInf) {Rjogar_u.jogar_uI(dicInf)}
async function nossas_r(dicInf) {Rnossas_r.nossas_rI(dicInf)}
async function participar_d(dicInf) {Rparticipar_d.participar_dI(dicInf)}
async function qual_o(dicInf) {Rqual_o.qual_oI(dicInf)}
async function quem_s(dicInf) {Rquem_s.quem_sI(dicInf)}
async function rastrear_e(dicInf) {Rrastrear_e.rastrear_eI(dicInf)}
async function segunda_v(dicInf) {Rsegunda_v.segunda_vI(dicInf)}

module.exports = {
    alterar_n,
    ativar_n,
    cancelar_e,
    conversar_c,
    desativar_n,
    introducao,
    devolucao_r,
    entrega_i,
    enviar_m,
    fazer_c,
    jogar_u,
    nossas_r,
    participar_d,
    qual_o,
    quem_s,
    rastrear_e,
    segunda_v
}