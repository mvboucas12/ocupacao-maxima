document.getElementById("calcForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const corrente = Number(document.getElementById("corrente").value);
    const secao = Number(document.getElementById("secao").value);

    if (corrente <= 0 || secao <= 0) {
        document.getElementById("resultado").innerText =
            "Preencha valores válidos.";
        return;
    }

    // ⚠️ Cálculo provisório (vamos ajustar depois para bater com o site)
    const ocupacao = (corrente / secao).toFixed(2);

    document.getElementById("resultado").innerText =
        `Ocupação calculada: ${ocupacao}`;
});
