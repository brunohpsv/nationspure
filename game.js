// Dados do jogo
const gameData = {
    player: {
        name: "Viajante",
        level: 1,
        location: null,
        visitedLocations: []
    },
    states: {
        // Coordenadas simplificadas para o mapa SVG
        "AC": { name: "Acre", x: 150, y: 300, neighbors: ["AM"], description: "Floresta Amazônica" },
        "AM": { name: "Amazonas", x: 250, y: 200, neighbors: ["AC", "RO", "MT", "PA", "RR"], description: "Maior estado brasileiro" },
        "RR": { name: "Roraima", x: 350, y: 50, neighbors: ["AM"], description: "Ponto mais ao norte do Brasil" },
        // Adicione todos os estados aqui...
        "SP": { name: "São Paulo", x: 600, y: 500, neighbors: ["RJ", "MG", "PR"], description: "Maior cidade da América do Sul" },
        "RJ": { name: "Rio de Janeiro", x: 650, y: 450, neighbors: ["SP", "MG", "ES"], description: "Cidade maravilhosa" }
    },
    highways: [
        // Rodovias conectando estados (simplificado)
        { from: "SP", to: "RJ", name: "Via Dutra" },
        { from: "SP", to: "MG", name: "Rodovia Fernão Dias" },
        // Adicione mais rodovias...
    ],
    railways: [
        // Ferrovias conectando estados (simplificado)
        { from: "SP", to: "PR", name: "Ferrovia Sul-Americana" },
        // Adicione mais ferrovias...
    ]
};

// Inicialização do jogo
document.addEventListener('DOMContentLoaded', function() {
    const brazilMap = document.getElementById('brazil-map');
    const locationInfo = document.getElementById('location-info');
    const currentLocation = document.getElementById('current-location');
    const locationDescription = document.getElementById('location-description');
    const travelOptions = document.getElementById('travel-options');
    
    // Desenha os estados no mapa SVG
    for (const [id, state] of Object.entries(gameData.states)) {
        const stateElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        stateElement.classList.add('state');
        stateElement.setAttribute('id', `state-${id}`);
        stateElement.setAttribute('cx', state.x);
        stateElement.setAttribute('cy', state.y);
        stateElement.setAttribute('r', 20);
        stateElement.setAttribute('data-state', id);
        
        // Adiciona tooltip com o nome do estado
        const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        title.textContent = state.name;
        stateElement.appendChild(title);
        
        brazilMap.appendChild(stateElement);
        
        // Adiciona texto com a sigla do estado
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute('x', state.x);
        text.setAttribute('y', state.y + 5);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', 'white');
        text.setAttribute('font-size', '10px');
        text.textContent = id;
        brazilMap.appendChild(text);
    }
    
    // Desenha as rodovias
    for (const highway of gameData.highways) {
        const from = gameData.states[highway.from];
        const to = gameData.states[highway.to];
        
        const path = document.createElementNS("http://www.w3.org/2000/svg", "line");
        path.classList.add('highway');
        path.setAttribute('x1', from.x);
        path.setAttribute('y1', from.y);
        path.setAttribute('x2', to.x);
        path.setAttribute('y2', to.y);
        path.setAttribute('data-highway', highway.name);
        
        // Adiciona tooltip com o nome da rodovia
        const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        title.textContent = highway.name;
        path.appendChild(title);
        
        brazilMap.appendChild(path);
    }
    
    // Desenha as ferrovias
    for (const railway of gameData.railways) {
        const from = gameData.states[railway.from];
        const to = gameData.states[railway.to];
        
        const path = document.createElementNS("http://www.w3.org/2000/svg", "line");
        path.classList.add('railway');
        path.setAttribute('x1', from.x);
        path.setAttribute('y1', from.y);
        path.setAttribute('x2', to.x);
        path.setAttribute('y2', to.y);
        path.setAttribute('data-railway', railway.name);
        
        // Adiciona tooltip com o nome da ferrovia
        const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        title.textContent = railway.name;
        path.appendChild(title);
        
        brazilMap.appendChild(path);
    }
    
    // Event listeners para os estados
    document.querySelectorAll('.state').forEach(state => {
        state.addEventListener('click', function() {
            const stateId = this.getAttribute('data-state');
            const stateData = gameData.states[stateId];
            
            // Atualiza a localização do jogador
            gameData.player.location = stateId;
            if (!gameData.player.visitedLocations.includes(stateId)) {
                gameData.player.visitedLocations.push(stateId);
            }
            
            // Atualiza a UI
            document.getElementById('player-location').textContent = `Localização: ${stateData.name}`;
            currentLocation.textContent = stateData.name;
            locationDescription.textContent = stateData.description;
            
            // Limpa seleção anterior
            document.querySelectorAll('.state').forEach(s => s.classList.remove('selected'));
            // Adiciona seleção ao estado clicado
            this.classList.add('selected');
            
            // Mostra opções de viagem
            showTravelOptions(stateId);
        });
    });
    
    // Função para mostrar opções de viagem
    function showTravelOptions(currentStateId) {
        travelOptions.innerHTML = '';
        const currentState = gameData.states[currentStateId];
        
        // Opções por rodovia
        const highways = gameData.highways.filter(h => h.from === currentStateId || h.to === currentStateId);
        if (highways.length > 0) {
            const highwayHeader = document.createElement('h3');
            highwayHeader.textContent = 'Rodovias';
            travelOptions.appendChild(highwayHeader);
            
            highways.forEach(highway => {
                const targetStateId = highway.from === currentStateId ? highway.to : highway.from;
                const targetState = gameData.states[targetStateId];
                
                const option = document.createElement('a');
                option.classList.add('travel-option');
                option.href = '#';
                option.textContent = `${highway.name} para ${targetState.name}`;
                option.addEventListener('click', () => {
                    // Simula viagem
                    document.getElementById(`state-${targetStateId}`).click();
                });
                travelOptions.appendChild(option);
            });
        }
        
        // Opções por ferrovia
        const railways = gameData.railways.filter(r => r.from === currentStateId || r.to === currentStateId);
        if (railways.length > 0) {
            const railwayHeader = document.createElement('h3');
            railwayHeader.textContent = 'Ferrovias';
            travelOptions.appendChild(railwayHeader);
            
            railways.forEach(railway => {
                const targetStateId = railway.from === currentStateId ? railway.to : railway.from;
                const targetState = gameData.states[targetStateId];
                
                const option = document.createElement('a');
                option.classList.add('travel-option');
                option.href = '#';
                option.textContent = `${railway.name} para ${targetState.name}`;
                option.addEventListener('click', () => {
                    // Simula viagem
                    document.getElementById(`state-${targetStateId}`).click();
                });
                travelOptions.appendChild(option);
            });
        }
    }
    
    // Botões do jogo
    document.getElementById('new-game').addEventListener('click', () => {
        gameData.player = {
            name: prompt("Digite seu nome:", "Viajante") || "Viajante",
            level: 1,
            location: null,
            visitedLocations: []
        };
        document.getElementById('player-name').textContent = gameData.player.name;
        document.getElementById('player-level').textContent = `Nível: ${gameData.player.level}`;
        document.getElementById('player-location').textContent = `Localização: -`;
        currentLocation.textContent = 'Selecione um estado';
        locationDescription.textContent = 'Clique em um estado para ver detalhes e opções de viagem';
        travelOptions.innerHTML = '';
        document.querySelectorAll('.state').forEach(s => s.classList.remove('selected'));
    });
    
    document.getElementById('save-game').addEventListener('click', () => {
        localStorage.setItem('rpgBrasilSave', JSON.stringify(gameData.player));
        alert('Jogo salvo com sucesso!');
    });
    
    document.getElementById('load-game').addEventListener('click', () => {
        const savedGame = localStorage.getItem('rpgBrasilSave');
        if (savedGame) {
            gameData.player = JSON.parse(savedGame);
            document.getElementById('player-name').textContent = gameData.player.name;
            document.getElementById('player-level').textContent = `Nível: ${gameData.player.level}`;
            
            if (gameData.player.location) {
                document.getElementById(`state-${gameData.player.location}`).click();
            } else {
                document.getElementById('player-location').textContent = `Localização: -`;
            }
            alert('Jogo carregado com sucesso!');
        } else {
            alert('Nenhum jogo salvo encontrado!');
        }
    });
    
    // Inicia um novo jogo por padrão
    document.getElementById('new-game').click();
});
