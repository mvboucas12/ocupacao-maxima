document.addEventListener("DOMContentLoaded", () => {

    const circuitosDiv = document.getElementById("circuitos");
    const addBtn = document.getElementById("addCircuito");
    const form = document.getElementById("calcForm");
    const resultado = document.getElementById("resultado");

    let contador = 0;

    addBtn.addEventListener("click", adicionarCircuito);
    form.addEventListener("submit", calcularTudo);

    adicionarCircuito();

    function adicionarCircuito() {
        contador++;

        const div = document.createElement("div");
        div.className = "circuito";

        div.innerHTML = `
            <button type="button" class="remover">✖</button>
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

        div.querySelector(".remover").onclick = () => {
            div.remove();
        };

        circuitosDiv.appendChild(div);
    }

    function calcularTudo(event) {
        event.preventDefault();
        resultado.innerHTML = "";

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

        let areaNEC = 0;
        let areaNBR = 0;
        let totalCabos = 0;

        document.querySelectorAll(".circuito").forEach(c => {
            const s = c.querySelector(".secao").value;
            const t = c.querySelector(".tipo").value;
            const q = Number(c.querySelector(".qtd").value);

            if (!s || !t || !q) {
                resultado.innerHTML = "<div class='erro'>Todos os campos de todos os circuitos devem ser preenchidos.</div>";
                throw "Erro";
            }

            totalCabos += q;
            areaNEC += Math.PI * Math.pow(baseDiametro[s] * fatorTipo[t].NEC / 2, 2) * q;
            areaNBR += Math.PI * Math.pow(baseDiametro[s] * fatorTipo[t].NBR / 2, 2) * q;
        });

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
                    return { nome: e.nome, ocupacao: (area / e.area) * 100 };
                }
            }
            return null;
        }

        const nec = selecionar(areaNEC);
        const nbr = selecionar(areaNBR);

        if (!nec || !nbr) {
            resultado.innerHTML = `
                <div class="erro">
                    O somatório das seções e quantidades de cabos ultrapassa a ocupação máxima permitida
                    pelos critérios normativos considerados. Recomenda-se a adoção de eletroduto de maior
                    diâmetro ou a redistribuição dos circuitos.
                </div>`;
            return;
        }

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
                    <td>${(100-nec.ocupacao).toFixed(1)}%</td>
                    <td>${nec.nome}</td>
                </tr>
                <tr>
                    <td><strong>NBR 5410</strong></td>
                    <td>${(fator*100).toFixed(0)}%</td>
                    <td>${nbr.ocupacao.toFixed(1)}%</td>
                    <td>${(100-nbr.ocupacao).toFixed(1)}%</td>
                    <td>${nbr.nome}</td>
                </tr>
            </table>

            <div class="nota">
                <strong>Notas técnicas:</strong><br><br>
                • A ocupação máxima do eletroduto segue a NEC – Chapter 9, Table 1, e a NBR 5410,
                item 6.2.11.1, que estabelecem percentuais máximos conforme o número de condutores.<br><br>
                • As diferenças entre os resultados NEC e NBR decorrem principalmente dos diâmetros
                externos adotados para os cabos, variáveis conforme o tipo de isolação e critérios
                construtivos (NEC Article 310; NBR 5410, itens 6.2.5 e 6.2.11).<br><br>
                • Cabos com isolação XLPE ou EPR tendem a apresentar maiores diâmetros externos,
                resultando em ocupações superiores quando comparados a cabos PVC equivalentes.<br><br>
                • Recomenda-se sempre a verificação dos diâmetros reais junto aos catálogos dos
                fabricantes para projetos executivos.
            </div>
        `;
    }
});
