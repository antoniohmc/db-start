import { valores } from './valores.js'
import { cardapio } from './cardapio.js'
import { mensagemErro } from './mensagem-erro.js'
import { extras } from './cardapio-extra.js'
import { metodoPagemento } from './metodo-pagamento.js'
import { adicional } from './cardapio-adicional.js'

class ProcessamentoPedido {

    static processar(metodoDePagamento, itens) {

        if (itens.length === 0) {
            return  mensagemErro.VAZIO
        }

        if (itens.every(item => !item.includes(','))) {
            return mensagemErro.ITEM_INVALIDO
        }

        switch(metodoDePagamento) {

            case metodoPagemento.DINHEIRO: return this.dinheiro(itens)

            case metodoPagemento.CREDITO: return this.credito(itens)

            case metodoPagemento.DEBITO: return this.debito(itens)

            default: return mensagemErro.PAGAMENTO_INVALIDO
        }
    }

    static dinheiro(itens) {

        const resultado = this.calculaValorDosItens(itens)

        if (typeof resultado === 'string') {
            return resultado
        } else {
            const descontoAVista = Number((resultado * 5 / 100).toFixed(2))
            const valorFinal = resultado - descontoAVista

            return valorFinal.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
        }
    }

    static credito(itens) {
        const resultado = this.calculaValorDosItens(itens)

        if (typeof resultado === 'string') {

            return resultado
            
        } else {
            const descontoAVista = Number((resultado * 3 / 100))
            const valorFinal = resultado + descontoAVista

            Number(valorFinal).toFixed(2)

            return valorFinal.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
        }
    }

    static debito(itens) {
        const resultado = this.calculaValorDosItens(itens)

        if (typeof resultado === 'string') {
            return resultado
        } else {
            return resultado.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
        }
    }

    static calculaValorDosItens(itens) {

        const todosValores = itens.map(item => {

            const itemSeparado = item.split(',')
            const valor = itemSeparado[0].trim()
            const quantidade = Number(itemSeparado[1].trim())
            const existeNoMenu = cardapio.some(menu => menu.includes(valor))
            const extra = extras.some(extra => extras.includes(valor))

            if (!existeNoMenu) {
              return mensagemErro.ITEM_INVALIDO
            }
        
            if (quantidade <= 0) {                
              return mensagemErro.QUANTIDADE_INVALIDA
            }
        
            if (extra) {
                const listaNomesMenu = itens.map(element => element.split(',')[0])
                const temPrincpal = listaNomesMenu.includes(adicional[valor])
            
                if (!temPrincpal) {
                    return mensagemErro.ITEM_EXTRA_SEM_PRINCIPAL
                }
            }

            return valores[valor] * quantidade
          })

          const semErro = todosValores.every(element => typeof element === 'number')
          
          if (semErro) {  

            const soma = todosValores.reduce((anterior, atual) => anterior + atual, 0)
            return soma
            
        } else {
            return todosValores.filter(valor => typeof valor === 'string')[0]
        }
    }
    
}

export { ProcessamentoPedido };
