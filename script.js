document.getElementById("calcForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const secao = Number(document.getElementById("secao").value);
    const quantidade = Number(document.getElementById("quantidade").value);
    const tipo = document.getElementById("tipo").value;
    const resultado = document.getElementById("resultado");

    if (!secao || !quantidade || !tipo) {
        resultado.innerHTML = "<p style='color:red'><strong>Preencha todos os campos.</strong></p>";
        return;
    }

    /* =========================================================
       DIÂMETROS EXTERNOS TÍPICOS (mm)
       NEC → valores mais enxutos (catálogos UL)
       NBR → valores mais conservadores (ABNT)
       ========================================================= */

    const diametros = {
        PVC:   { NEC: 1.00, NBR: 1.10 },
        XLPE:  { NEC: 1.05, NBR: 1.15 },
        EPR:   { NEC: 1.10, NBR: 1.20 }
    };

    const baseDiametro = {
        1.5: 3.6,  2.5: 4.1,  4: 4.8,  6: 5.5,
        10: 6.8,  16: 7.8,  25: 9.2,  35: 10.4,
        50: 12.0, 70: 13.7, 95: 15.5,
        120: 17.2, 150: 19.0
    };

    const eletrodutos = [
        { nome: "1/2\"", area: 184 },
        { nome: "3/4\"", area: 304 },
        { nome: "1\"", area: 490 },
        { nome: "1 1/4\"", area: 804 },
        { nome: "1 1/2\"", area: 1105 },
        { nome: "2\"", area: 1600 },
        { nome: "2 1/2\"", area: 2900 },
        { nome: "3\"", area: 3800 }
    ];

    function calcular(norm) {
        const fator = quantidade === 1 ? 0.53 : quantidade === 2 ? 0.31 : 0.40;

        const d = baseDiametro[secao] * diametros[tipo][norm];
        const areaCabos = Math.PI * Math.pow(d / 2, 2) * quantidade;

        let escolhido = null;
        let ocupacao = 0;

        for (let e of eletrodutos) {
            if (areaCabos <= e.area * fator) {
                escolhido = e;
                ocupacao = (areaCabos / e.area) * 100;
                break;
            }
        }

        return {
            ocupacaoMax: fator * 100,
            ocupacao,
            livre: 100 - ocupacao,
            eletroduto: escolhido ? escolhido.nome : "—"
        };
    }

    const nec = calcular("NEC");
    const nbr = calcular("NBR");

    resultado.innerHTML = `
        <table>
            <tr>
                <th>Norma</th>
                <th>Ocupação Máx.</th>
                <th>Ocupação Calculada</th>
                <th>Espaço Livre</th>
                <th>Eletroduto Recomendado</th>
            </tr>
            <tr>
                <td class="norma">NEC – Chapter 9, Table 1</td>
                <td>${nec.ocupacaoMax}%</td>
                <td>${nec.ocupacao.toFixed(1)}%</td>
                <td>${nec.livre.toFixed(1)}%</td>
                <td>${nec.eletroduto}</td>
            </tr>
            <tr>
                <td class="norma">NBR 5410</td>
                <td>${nbr.ocupacaoMax}%</td>
                <td>${nbr.ocupacao.toFixed(1)}%</td>
                <td>${nbr.livre.toFixed(1)}%</td>
                <td>${nbr.eletroduto}</td>
            </tr>
        </table>

        <div class="nota">
            <strong>Nota técnica:</strong> embora os percentuais máximos de ocupação
            sejam equivalentes na NEC e na NBR 5410, os resultados podem diferir
            devido aos diâmetros externos adotados para os cabos, que variam conforme
            o tipo de isolação e critérios normativos.
        </div>
    `;
});
