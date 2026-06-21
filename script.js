document.getElementById("calcForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const secao = Number(document.getElementById("secao").value);
    const quantidade = Number(document.getElementById("quantidade").value);
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
            <h3>Circuit ${contador}</h3>

            <label>Cable Size (mm²)</label>
            <select class="secao">
                <option value="">Select</option>
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

            <label>Cable Type</label>
            <select class="tipo">
                <option value="">Select</option>
                <option value="PVC">PVC 70 °C</option>
                <option value="XLPE">XLPE 90 °C</option>
                <option value="EPR">EPR 90 °C</option>
            </select>

            <label>Number of Cables</label>
            <select class="qtd">
                <option value="">Select</option>
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

    /* =========================================================
       TABELA SIMPLIFICADA – DIÂMETRO EXTERNO DO CABO (mm)
       Baseada em valores típicos NEC / fabricantes
       ========================================================= */
    const diametroCabo = {
        1.5: 3.6,
        2.5: 4.1,
        4: 4.8,
        6: 5.5,
        10: 6.8,
        16: 7.8,
        25: 9.2,
        35: 10.4,
        50: 12.0,
        70: 13.7,
        95: 15.5,
        120: 17.2,
        150: 19.0
    };

    const dCabo = diametroCabo[secao];
    const areaCabo = Math.PI * Math.pow(dCabo / 2, 2);
    const areaTotalCabos = areaCabo * quantidade;

    /* =========================================================
       LIMITES NEC – CHAPTER 9, TABLE 1
       ========================================================= */
    let ocupacaoMax;
    if (quantidade === 1) ocupacaoMax = 0.53;
    else if (quantidade === 2) ocupacaoMax = 0.31;
    else ocupacaoMax = 0.40;

    /* =========================================================
       ELETRODUTOS PADRONIZADOS (polegadas)
       Área interna aproximada (mm²)
       ========================================================= */
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

    let eletrodutoSelecionado = null;
    let percentualOcupacao = 0;

            if (!s || !t || !q) {
                resultado.innerHTML = "<div class='erro'>All fields in all circuits must be completed.</div>";
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
                    The combined cable sizes and quantities exceed the maximum conduit fill
                    permitted by the applicable code criteria. A larger conduit size or
                    redistribution of circuits is recommended.
                </div>`;
            return;
        }

        resultado.innerHTML = `
            <table>
                <tr>
                    <th>Standard</th>
                    <th>Maximum Fill</th>
                    <th>Calculated Fill</th>
                    <th>Free Space</th>
                    <th>Recommended Conduit</th>
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
                <strong>Technical Notes:</strong><br><br>
                • Maximum conduit fill is based on NEC Chapter 9, Table 1, and NBR 5410,
                Clause 6.2.11.1, which establish maximum fill percentages according to
                the number of conductors.<br><br>

                • Differences between NEC and NBR results arise mainly from the adopted
                cable outside diameters, which vary according to insulation type and
                construction criteria (NEC Article 310; NBR 5410 Clauses 6.2.5 and 6.2.11).<br><br>

                • XLPE and EPR insulated cables generally have larger outside diameters,
                resulting in higher conduit fill percentages when compared with equivalent
                PVC insulated cables.<br><br>

                • Verification of actual cable diameters using manufacturer catalogs is
                always recommended for detailed engineering design.
            </div>
        `;

