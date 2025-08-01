async function loadBrazilMap() {
    const svg = d3.select("#brazil-map");
    
    // Carrega o TopoJSON do Brasil (você precisará ter este arquivo)
    const brazil = await d3.json("assets/data/brazil-states.json");
    
    // Projeção para o mapa
    const projection = d3.geoMercator()
        .fitSize([800, 800], topojson.feature(brazil, brazil.objects.states));
    
    const path = d3.geoPath().projection(projection);
    
    // Desenha os estados
    svg.append("g")
        .selectAll("path")
        .data(topojson.feature(brazil, brazil.objects.states).features)
        .enter()
        .append("path")
        .attr("class", "state")
        .attr("d", path)
        .attr("id", d => `state-${d.properties.sigla}`)
        .on("click", function(event, d) {
            selectState(d.properties);
        });
    
    // Carrega e desenha as rodovias (exemplo)
    const highways = await d3.json("assets/data/highways.json");
    svg.append("g")
        .selectAll("path")
        .data(topojson.feature(highways, highways.objects.highways).features)
        .enter()
        .append("path")
        .attr("class", "highway")
        .attr("d", path);
    
    // Carrega e desenha as ferrovias (exemplo)
    const railways = await d3.json("assets/data/railways.json");
    svg.append("g")
        .selectAll("path")
        .data(topojson.feature(railways, railways.objects.railways).features)
        .enter()
        .append("path")
        .attr("class", "railway")
        .attr("d", path);
}

function selectState(state) {
    document.getElementById("current-state").textContent = state.nome;
    document.getElementById("current-city").textContent = "Selecione um município";
    document.getElementById("travel-btn").disabled = true;
    
    // Aqui você carregaria os municípios do estado selecionado
    // e as rotas disponíveis
    updateRoutesList(state.sigla);
}

function updateRoutesList(stateCode) {
    const routesList = document.getElementById("routes-list");
    routesList.innerHTML = "";
    
    // Exemplo de rotas - você precisará carregar dados reais
    const sampleRoutes = [
        { type: "highway", name: "BR-101", connects: ["RJ", "ES", "BA"] },
        { type: "railway", name: "Ferrovia Centro-Atlântica", connects: ["MG", "RJ", "SP"] }
    ];
    
    sampleRoutes.forEach(route => {
        if (route.connects.includes(stateCode)) {
            const li = document.createElement("li");
            li.textContent = `${route.name} (${route.type === "highway" ? "Rodovia" : "Ferrovia"})`;
            routesList.appendChild(li);
        }
    });
}

// Inicializa o mapa quando a página carregar
document.addEventListener("DOMContentLoaded", loadBrazilMap);
