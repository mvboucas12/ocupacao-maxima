document.getElementById("calcForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const secao = Number(document.getElementById("secao").value);
    const quantidade = Number(document.getElementById("quantidade").value);
    const diametro = Number(document.getElementById("eletroduto").value);

    if (!secao || !quantidade || !diametro) {
        document.getElementById("resultado").innerHTML =
            "<span style='color:red'>Preencha todos os campos.</span>";
        return;
    }

    // Área aproximada do condutor (mm² → diâmetro equivalente)
    const areaCondutor = secao;
    const areaTotalCondutores = areaCondutor * quantidade;

    // Área interna do eletroduto (A = πr²)
    const raio = diametro / 2;
    const areaEletroduto = Math.PI * Math.pow(raio, 2);

    // Percentual máximo permitido pela NEC
    let percentualMax;
    if (quantidade === 1) percentualMax = 53;
    else if (quantidade === 2) percentualMax = 31;
    else percentualMax = 40;

    const areaPermitida = areaEletroduto * (percentualMax / 100);
    const percentualUtilizado = (areaTotalCondutores / areaEletroduto) * 100;

    const conforme = areaTotalCondutores <= areaPermitida;

    document.getElementById("resultado").innerHTML = `
        <p><strong>Área total dos condutores:</strong> ${areaTotalCondutores.toFixed(2)} mm²</p>
        <p><strong>Área interna do eletroduto:</strong> ${areaEletroduto.toFixed(2)} mm²</p>
        <p><strong>Ocupação máxima permitida (NEC):</strong> ${percentualMax}%</p>
        <p><strong>Ocupação calculada:</strong> ${percentualUtilizado.toFixed(2)}%</p>
        <p>
            <strong>Status:</strong>
            <span style="color:${conforme ? "green" : "red"}">
                ${conforme ? "CONFORME" : "NÃO CONFORME"}
            </span>
        </p>
    `;
});
