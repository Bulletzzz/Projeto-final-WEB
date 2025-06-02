document.addEventListener('DOMContentLoaded', function() {
    // Carrega dados do LocalStorage
    const produtosData = JSON.parse(localStorage.getItem('produtos')) || [];
    const categoriasData = JSON.parse(localStorage.getItem('categorias')) || [];
    const inventariosData = JSON.parse(localStorage.getItem('inventarios')) || {};
    
    // Filtra dados
    const produtosAtivos = produtosData.filter(p => !p.excluido);
    const categoriasAtivas = categoriasData.filter(cat => !cat.includes("(Excluido)"));
    
    // Cria os 4 gráficos
    criarGraficoFabricantes(produtosAtivos);
    criarGraficoStatus(produtosData);
    criarGraficoCategorias(produtosAtivos, categoriasAtivas);
    criarGraficoInventario(inventariosData);
});

// 1. Gráfico de Rosca - Distribuição por Fabricante
function criarGraficoFabricantes(produtos) {
    const ctx = document.getElementById('grafico1').getContext('2d');
    
    // Conta produtos por fabricante
    const fabricantes = {};
    produtos.forEach(p => {
        if (p.fabricantev) {
            fabricantes[p.fabricantev] = (fabricantes[p.fabricantev] || 0) + 1;
        }
    });

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(fabricantes),
            datasets: [{
                data: Object.values(fabricantes),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                    '#9966FF', '#FF9F40', '#8AC24A', '#607D8B',
                    '#795548', '#9E9E9E'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Distribuição por Fabricante',
                    font: { size: 16 }
                },
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw} máquina(s)`;
                        }
                    }
                }
            }
        }
    });
}

// 2. Gráfico de Barras - Status das Máquinas
function criarGraficoStatus(produtos) {
    const ctx = document.getElementById('grafico2').getContext('2d');
    
    const ativos = produtos.filter(p => p.status === 'Ativo' && !p.excluido).length;
    const inativos = produtos.filter(p => p.status === 'Inativo' && !p.excluido).length;
    const excluidos = produtos.filter(p => p.excluido).length;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Ativas', 'Inativas', 'Excluídas'],
            datasets: [{
                label: 'Quantidade',
                data: [ativos, inativos, excluidos],
                backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Status das Máquinas',
                    font: { size: 16 }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// 3. Gráfico de Pizza - Distribuição por Categoria
function criarGraficoCategorias(produtos, categorias) {
    const ctx = document.getElementById('grafico3').getContext('2d');
    
    // Conta produtos por categoria
    const contagem = {};
    categorias.forEach(cat => {
        contagem[cat] = produtos.filter(p => p.cat === cat).length;
    });

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categorias,
            datasets: [{
                data: categorias.map(cat => contagem[cat]),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                    '#9966FF', '#FF9F40', '#8AC24A', '#607D8B',
                    '#795548', '#9E9E9E'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Distribuição por Categoria',
                    font: { size: 16 }
                },
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw} máquina(s)`;
                        }
                    }
                }
            }
        }
    });
}

// 4. Gráfico de Linha - Inventário Diário (VALORES DIRETOS)
function criarGraficoInventario(inventarios) {
    const ctx = document.getElementById('grafico4').getContext('2d');
    
    // Processa os dados de inventário
    const { labels, valores } = processarDadosInventario(inventarios);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Quantidade Inventariada',
                data: valores,
                borderColor: '#9C27B0',
                backgroundColor: 'rgba(156, 39, 176, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: '#9C27B0'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Inventário Diário de Máquinas',
                    font: { size: 16 }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const data = context.label;
                            const qnt = context.raw;
                            const nome = inventarios[formatarDataParaKey(data)]?.nome || 'Desconhecido';
                            return `${nome}: ${qnt} máquina(s)`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Quantidade'
                    },
                    ticks: {
                        stepSize: 1
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Data'
                    }
                }
            }
        }
    });
}

// Funções auxiliares para o gráfico de inventário
function processarDadosInventario(inventarios) {
    const labels = [];
    const valores = [];
    
    // Ordena as datas cronologicamente
    const datasOrdenadas = Object.keys(inventarios).sort((a, b) => {
        return new Date(a) - new Date(b);
    });
    
    // Prepara os dados para o gráfico
    datasOrdenadas.forEach(dataKey => {
        const [ano, mes, dia] = dataKey.split('-');
        labels.push(`${dia}/${mes}/${ano.slice(2)}`);
        valores.push(parseInt(inventarios[dataKey].qnt));
    });
    
    return { labels, valores };
}

function formatarDataParaKey(dataDisplay) {
    // Converte de DD/MM/AA para YYYY-MM-DD
    const [dia, mes, ano] = dataDisplay.split('/');
    return `20${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
}