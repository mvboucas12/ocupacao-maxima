document.addEventListener("DOMContentLoaded", () => {

    const circuitosDiv = document.getElementById("circuitos");
    const addBtn = document.getElementById("addCircuito");
    const form = document.getElementById("calcForm");

    let contador = 0;

    addBtn.addEventListener("click", adicionarCircuito);
    form.addEventListener("submit", calcularTudo);

    // adiciona o primeiro circuito automaticamente
    adicionarCircuito();

    function adicionarCircuito() {
        contador++;

        const div = document.createElement("div");
        div.className = "circuito";

        div.innerHTML = `
            <h3>Circuito ${contador}</h3>

            <label>Seção do cabo (mm²)</label>
            <select class="secao">
                <option value="">Selecione</option>
                <option value="1.5">1,5</option>
                <option value="2.5">2,5</option>
                <option value="4">4</option>
                <option value="6">6</option>
                <option value="10">10</option>
                <option value="16">16</option>
                <option value="25">25</option>
                <option value="35">35</option>
                <option value="50">50</option>
                <option value="70">70</option>
                <option value="95">95</option>
                <option value="120">120</option>
                <option value="150">150</option>
            </select>

            <label>Tipo de cabo</label>
            <select class="tipo">
                <option value="">Selecione</option>
                <option value="PVC">PVC 70 °C</option>
                <option value="XLPE">XLPE 90 °C</option>
                <option value="EPR">EPR 90 °C</option>
            </select>

            <label>Quantidade de cabos</label>
            <select class="qtd">
                <option value="">Selecione</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="8">8</option>
                <option value="10">10</option>
            </select>
        `;

        circuitosDiv.appendChild(div);
    }

    function calcularTudo(event) {
        event.preventDefault();

        const secoes = document.querySelectorAll(".secao");
        const tipos = document.querySelectorAll(".tipo");
        const qtds = document.querySelectorAll(".qtd");
        const resultado = document.getElementById("resultado");

        let areaNEC = 0;
        let areaNBR = 0;
        let totalCabos = 0;

        const baseDiametro = {
            1.5: 3.6, 2.5: 4.1, 4: 4.8, 6: 5.5,
            10: 6.8, 16: 7.8, 25: 9.2, 35: 10.4,
            50: 12.0, 70: 13.7, 95: 15.5,
            120: 17.2, 150: 19.0
        };

        const fatorTipo = {
            PVC: { NEC: 1.00, NBR: 1.10 },
            XLPE: { NEC: 1.05, NBR: 1.15 },
            EPR: { NEC: 1.10, NBR: 1.20 }
        };

        for (let i = 0; i < secoes.length; i++) {
            const s = secoes[i].value;
            const t = tipos[i].value;
            const q = Number(qtds[i].value);

            if (!s || !t || !q) {
                resultado.innerHTML = "<p style='color:red'><strong>Preencha todos os circuitos.</strong></p>";
                return;
            }

            totalCabos += q;

            const dNEC = baseDiametro[s] * fatorTipo[t].NEC;
            const dNBR = baseDiametro[s] * fatorTipo[t].NBR;

            areaNEC += Math.PI * Math.pow(dNEC / 2, 2) * q;
            areaNBR += Math.PI * Math.pow(dNBR / 2, 2) * q;
        }

        const fator = totalCabos === 1 ? 0.53 : totalCabos === 2 ? 0.31 : 0.40;

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

        function selecionar(area) {
            for (let e of eletrodutos) {
                if (area <= e.area * fator) {
                    return {
                        nome: e.nome,
                        ocupacao: (area / e.area) * 100
                    };
                }
            }
            return { nome: "—", ocupacao: 0 };
        }

        const nec = selecionar(areaNEC);
        const nbr = selecionar(areaNBR);

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
                    <td><strong>NEC</strong></td>
                    <td>${(fator*100).toFixed(0)}%</td>
                    <td>${nec.ocupacao.toFixed(1)}%</td>
                    <td>${(100 - nec.ocupacao).toFixed(1)}%</td>
                    <td>${nec.nome}</td>
                </tr>
                <tr>
                    <td><strong>NBR 5410</strong></td>
                    <td>${(fator*100).toFixed(0)}%</td>
                    <td>${nbr.ocupacao.toFixed(1)}%</td>
                    <td>${(100 - nbr.ocupacao).toFixed(1)}%</td>
                    <td>${nbr.nome}</td>
                </tr>
            </table>

            <div class="nota">
                <strong>Nota técnica:</strong> o cálculo considera múltiplos circuitos
                compartilhando o mesmo eletroduto, com somatório das áreas dos cabos,
                conforme NEC (Chapter 9) e NBR 5410.
            </div>
        `;
    }
});
