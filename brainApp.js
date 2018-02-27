var brain = require('brain');

var net = new brain.NeuralNetwork();

var problemas = {
    combustivel: `ser falta de combustivel.<br/>Abasteça com uma boa gasolina e tente ligar o carro novamente.`,
    bateria: `ser a bateria descarregada.<br/>Troque a bateria por uma nova, ou recarregue ela, e tente ligar o carro novamente.`,
    motorPartida: `ser o motor de partida com defeito.<br/>Procure uma oficina para fazer o reparo.`,
    alarme: `ser o alarme bloqueando o acionamento do motor.<br/>Desative o alarme e tente ligar o carro novamente.`,
    teclaAlerta: "ser atecla do alerta.",
    curtoNoCarro: "ter algum curto ciruito no carro.",
    releDaSeta: "do rele da seta está queimado.",
    freio: "ser a pinça do freio.",
    volante: "ser alguma folga na fixação dos amortecedores.",
    buraco: "ser o coxim do motor quebrado.",
    batida: "ser alguma peça quebrado ou solta em decorrencia da batida.",
    porta: "ser os pinos de porta com desgaste.",
    passageiro: "ser uma folga na trava do encosto do banco traseiro ou folgas no trilho ou no encosto de cabeça dianteiro.",
    coluna: "ser fixadores do cinto de segurança na coluna.",
    motorFraco: "ser combustivel de má qualidade.",
    oleo: "ser falta de oleo no motor, complete com urgencia.",
    injecao: `ser algum problema eletrico mais serio.<br/>Leve o carro no mecanico para passar o scanner e descobrir o real problema.`,
    fumaca: `ser desgaste no cabeçote.<br/>Faça a retifica do motor.`
};

net.train([
    {input: {combustivel: 0, bateria: 0, motorPartida: 0, alarme: 0}, output: {combustivel: 1}},
    {input: {combustivel: 0, bateria: 1, motorPartida: 1, alarme: 1}, output: {combustivel: 1}},
    {input: {combustivel: 1, bateria: 0, motorPartida: 0, alarme: 0}, output: {bateria: 1}},
    {input: {combustivel: 1, bateria: 0, motorPartida: 1, alarme: 0}, output: {bateria: 1}},
    {input: {combustivel: 1, bateria: 0, motorPartida: 0, alarme: 1}, output: {bateria: 1}},
    {input: {combustivel: 1, bateria: 0, motorPartida: 1, alarme: 1}, output: {bateria: 1}},
    {input: {combustivel: 1, bateria: 1, motorPartida: 0, alarme: 0}, output: {motorPartida: 1}},
    {input: {combustivel: 1, bateria: 1, motorPartida: 0, alarme: 1}, output: {motorPartida: 1}},
    {input: {combustivel: 1, bateria: 1, motorPartida: 1, alarme: 1}, output: {alarme: 1}},

    {input: {teclaAlerta: 0, fusivel: 0, releDaSeta: 1}, output: {teclaAlerta: 1}},
    {input: {teclaAlerta: 0, fusivel: 1, releDaSeta: 1}, output: {teclaAlerta: 1}},
    {input: {teclaAlerta: 0, fusivel: 1, releDaSeta: 0}, output: {curtoNoCarro: 1}},
    {input: {teclaAlerta: 0, fusivel: 0, releDaSeta: 0}, output: {releDaSeta: 1}},
    {input: {teclaAlerta: 0, fusivel: 1, releDaSeta: 0}, output: {releDaSeta: 1}},

    {input: {parteCarro: 0, freio: 1, volante: 0, buraco: 0, batida: 0}, output: {freio: 1}},
    {input: {parteCarro: 0, freio: 1, volante: 0, buraco: 1, batida: 0}, output: {freio: 1}},
    {input: {parteCarro: 0, freio: 1, volante: 0, buraco: 1, batida: 1}, output: {freio: 1}},
    {input: {parteCarro: 0, freio: 0, volante: 1, buraco: 0, batida: 0}, output: {volante: 1}},
    {input: {parteCarro: 0, freio: 0, volante: 0, buraco: 1, batida: 0}, output: {buraco: 1}},
    {input: {parteCarro: 0, freio: 0, volante: 0, buraco: 0, batida: 1}, output: {batida: 1}},
    {input: {parteCarro: 0, freio: 1, volante: 1, buraco: 1, batida: 1}, output: {batida: 1}},
    {input: {parteCarro: 0.5, porta: 1, passageiro: 0, coluna: 0, batida: 0}, output: {porta: 1}},
    {input: {parteCarro: 0.5, porta: 1, passageiro: 0, coluna: 0, batida: 1}, output: {porta: 1}},
    {input: {parteCarro: 0.5, porta: 0, passageiro: 1, coluna: 0, batida: 0}, output: {passageiro: 1}},
    {input: {parteCarro: 0.5, porta: 0, passageiro: 0, coluna: 1, batida: 0}, output: {coluna: 1}},
    {input: {parteCarro: 0.5, porta: 0, passageiro: 1, coluna: 1, batida: 0}, output: {coluna: 1}},
    {input: {parteCarro: 0.5, porta: 0, passageiro: 0, coluna: 0, batida: 1}, output: {batida: 1}},
    {input: {parteCarro: 0.5, porta: 1, passageiro: 1, coluna: 1, batida: 1}, output: {batida: 1}},
    {input: {parteCarro: 1, passageiro: 1, batida: 0}, output: {passageiro: 1}},
    {input: {parteCarro: 1, passageiro: 1, batida: 1}, output: {batida: 1}},
    {input: {parteCarro: 1, passageiro: 0, batida: 1}, output: {batida: 1}},

    {input: {motorFraco: 1, oleo: 0, injecao: 0, fumaca: 0}, output: {motorFraco: 1}},
    {input: {motorFraco: 1, oleo: 1, injecao: 0, fumaca: 0}, output: {oleo: 1}},
    {input: {motorFraco: 1, oleo: 1, injecao: 0, fumaca: 1}, output: {oleo: 1}},
    {input: {motorFraco: 1, oleo: 1, injecao: 0, fumaca: 1}, output: {oleo: 1}},
    {input: {motorFraco: 1, oleo: 0, injecao: 1, fumaca: 0}, output: {injecao: 1}},
    {input: {motorFraco: 1, oleo: 1, injecao: 1, fumaca: 0}, output: {injecao: 1}},
    {input: {motorFraco: 1, oleo: 0, injecao: 1, fumaca: 1}, output: {injecao: 1}},
    {input: {motorFraco: 1, oleo: 1, injecao: 1, fumaca: 0}, output: {injecao: 1}},
    {input: {motorFraco: 1, oleo: 0, injecao: 0, fumaca: 1}, output: {fumaca: 1}}
]);

exports.brainProcess = function (res) {
    delete res['BotBuilder.Data.WaterfallStep'];
    var output = net.run(getResults(res));
    return getFinalResult(output);
}

function getResults(res) {
    for(var key in res){
        if(isNaN(res[key])){
            if(res[key].match(/(não)|(nao)|(Não)|(Nao)|(NÂO)|(NAO)/i)){
                res[key] = 0;
            } else {
                res[key] = 1;
            }
        }
    }
    return res;
}

function getFinalResult(res) {
    var vals = [];    
    for(var i in res){
       vals.push(res[i]);
    }

    var max = Math.max.apply(null, vals);

     for(var i in res){
        if(res[i] == max){
            return "O problema tem " + parseFloat((res[i] * 100).toFixed(2)) + "% de chances de " + problemas[i];
        }
    }
}