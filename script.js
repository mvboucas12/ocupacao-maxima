document.getElementById("calcForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const secao = Number(document.getElementById("secao").value);
    const quantidade = Number(document.getElementById("quantidade").value);
    const resultado = document.getElementById("resultado");

    if (!secao || !quantidade) {
        resultado.innerHTML = "<span style='color:red'>Preencha todos os campos.</span>";
        return;
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

    for (let e of eletrodutos) {
        cons
