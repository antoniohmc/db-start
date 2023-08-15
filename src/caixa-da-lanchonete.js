import { ProcessamentoPedido } from "./processamento-pedido.js";

class CaixaDaLanchonete {

    calcularValorDaCompra(metodoDePagamento, itens) {

        return ProcessamentoPedido.processar(metodoDePagamento, itens)
    }

}

export { CaixaDaLanchonete };
