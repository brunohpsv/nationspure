// Variáveis do jogo
const player = {
    name: "Aventureiro",
    level: 1,
    experience: 0,
    location: null,
    inventory: []
};

// Atualiza a interface com informações do jogador
function updatePlayerInfo() {
    document.getElementById("player-name").textContent = player.name;
    document.getElementById("player-level").textContent = `Nível ${player.level}`;
}

// Função para viajar entre locais
document.getElementById("travel-btn").addEventListener("click", function() {
    // Lógica de viagem entre cidades/estados
    console.log("Viajando...");
});

// Função para explorar o local atual
document.getElementById("explore-btn").addEventListener("click", function() {
    // Lógica de exploração
    console.log("Explorando...");
    // Gerar eventos aleatórios, encontros, itens, etc.
});

// Inicializa o jogo
updatePlayerInfo();
