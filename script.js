document.getElementById("calcForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const secao = Number(document.getElementById("secao").value);
    const quantidade = Number(document.getElementById("quantidade").value);
    const resultado = document.getElementById("resultado");

    if (!secao || !quantidade) {
        resultado.innerHTML =
            "<p style='color:red'><strong>Preencha todos os campos.</strong></p>";
        return;
    }

    /* =========================================================
       DIÂMETRO EXTERNO TÍPICO DOS CABOS (mm)
       Valores aproximados – referência NEC / fabricantes
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

    const d = diametroCabo[secao];
    const areaCabo = Math.PI * Math.pow(d / 2, 2);
    const areaTotalCabos = areaCabo * quantidade;

    /* =========================================================
       LIMITES DE OCUPAÇÃO – NEC CHAPTER 9, TABLE 1
       ========================================================= */
    let fatorOcupacao;
    if (quantidade === 1) fatorOcupacao = 0.53;
    else if (quantidade === 2) fatorOcupacao = 0.31;
    else fatorOcupacao = 0.40;

    /* =========================================================
       ELETRODUTOS PADRÃO (polegadas)
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

    let escolhido = null;
    let ocupacaoPercentual = 0;

    for (let e of eletrodutos) {
        const areaMaxPermitida = e.area * fatorOcupacao;
        if (areaTotalCabos <= areaMaxPermitida) {
            escolhido = e;
            ocupacaoPercentual = (areaTotalCabos / e.area) * 100;
            break;
        }
    }

    if (!escolhido) {
        resultado.innerHTML =
            "<p style='color:red'><strong>Nenhum eletroduto padrão atende a esta configuração.</strong></p>";
        return;
    }

    const espacoLivre = 100 - ocupacaoPercentual;

    resultado.innerHTML = `
        <p><strong>Área total dos cabos:</strong> ${areaTotalCabos.toFixed(1)} mm²</p>
        <p><strong>Ocupação máxima permitida (NEC):</strong> ${(fatorOcupacao * 100).toFixed(0)}%</p>
        <p><strong>Ocupação calculada:</strong> ${ocupacaoPercentual.toFixed(1)}%</p>
        <p><strong>Espaço livre:</strong> ${espacoLivre.toFixed(1)}%</p>
        <p><strong>Eletroduto mínimo recomendado:</strong>
            <span style="color:green">${escolhido.nome}</span>
        </p>
    `;
});
