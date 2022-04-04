const csv = require('csv-parser');
const fs = require('fs')
const readLine = require("readline")
const prompt = require('prompt-sync')();

const { writeFile } = require('./WriteFileP')
const { readFile } = require('./ReadFile')
const { writeFileF } = require('./WriteFileF')

// Variáveis Globais
class No{
  construir(data,left=null,right=null){
    this.data = data
    this.left = esquerda
    this.right = direita
  }
}



let BD = [], Saida = []
let CountMortos = 0, CountVivos = 0


let X = [], Ylinha = []
let PacientesVivosEscolhidos = [], PacientesMortosEscolhidos = []
let B = 0
//let Xteste = [], YlinhaTeste = []
let WFinal = []

let contTotal = 0
let pacientes = []
let Arr_Hiperplanos = []



function conta(hiperplano,BD,i){
    let H_i = 0
    for(let j=BD[i].length; j>=0; j--){
        if(j==0) H_i += hiperplano[j]*(-1)
        else H_i += hiperplano[j]*BD[i][j-1]
    }
    return H_i
}

async function getSintomas(data){
    // let campos = Object.keys(data).toString().split(',')
    let linha = Object.values(data).toString().split(',')

    let sintomas = []

    for(let i=0;i<linha.length-1;i++){
        sintomas.push(parseInt(linha[i]))
    }

    if(linha[linha.length-1] == "Vivo")BD.push(sintomas), CountVivos++, Ylinha.push(1);
    else BD.push(sintomas), CountMortos++, Ylinha.push(-1);
}

function sinal(z){
    if(z>0) return 1
    else if(z<0){
        return -1
    }
    else return 0
}

function Perceptron(PacientesEscolhidos,n,W,YlinhaEscolhidos,b,t){
    let melhorW = W
    let guardaT = 0
    let acertos = 0
    let melhorA = 0
    let melhorV = 0
    let melhorM = 0
    let acertosV = 0
    let acertosM = 0
    var d = PacientesEscolhidos[0].length
    B = b
    for(var i=0;i<n;i++) PacientesEscolhidos[i] = [-b].concat(PacientesEscolhidos[i]);

    W = [1].concat(W)

    var l = 0
    var Y = new Array(n).fill(0)
    var Yteste = new Array(n).fill(0)
    var tentativas = 0
    let countEq = 0

    var ok = true;

    while (l == 0){
        countEq = 0
        tentativas++;
        acertosV = 0
        acertosM = 0
        for(var i = 0;i<n;i++){
            var soma = 0
            for(var j=0;j<d+1;j++) soma += PacientesEscolhidos[i][j] * W[j];
            Yteste[i] = soma
            Y[i] = sinal(soma)
            if(Y[i] == -1 && YlinhaEscolhidos[i] == -1){
              acertosM++
            }
            else if(Y[i] == 1 && YlinhaEscolhidos[i] == 1){
              acertosV++
            }
        }
        //TesteDeSanidade(W,PacientesEscolhidos,YlinhaEscolhidos)
        if((acertosV + acertosM) >= melhorA){
          melhorW = W
          melhorA = acertosV + acertosM
          melhorV = acertosV
          melhorM = acertosM
          guardaT = tentativas
          /*console.log('quantidade do n: ', BDTreino.length)
          console.log('tentativas: ', tentativas)
          console.log(`Melhor acertos: ${melhorA}, Vivo: ${acertosV}, Morto: ${acertosM}`)
          console.log('%acertoV: ', melhorV/(n/2))
          console.log('%acertosM: ', melhorM/(n/2))
          console.log()*/
        }

        /*acertos = 0
        acertosV = 0
        acertosM = 0
        for(i=0;i<n;i++){
          if(Y[i] == YlinhaEscolhidos[i]){
            if(YlinhaEscolhidos[i] == 1){
              acertosV++
            }
            else{
              acertosM++
            }
          }
        }
        acertos = acertosV + acertosM
        if(acertos > melhorA){
          melhorW = W
          melhorA = acertos
          melhorV = acertosV
          melhorM = acertosM
          guardaT = tentativas
          console.log('quantidade do n: ', n)
          console.log('tentativas: ', tentativas)
          console.log(`Melhor acertos: ${melhorA}, Vivo: ${acertosV}, Morto: ${acertosM}`)
          console.log('%acertoV: ', melhorV/(n/2))
          console.log('%acertosM: ', melhorM/(n/2))
        }*/

        var i=0
        l=1

        while (true){
            if (Y[i] != YlinhaEscolhidos[i]){
                for(var j=0;j<=d;j++){
                    W[j] += YlinhaEscolhidos[i] * PacientesEscolhidos[i][j]
                }
                l=0
            }
            else {
                i += 1
            }

            if(i>=n || l==0){
                break
            }
        }


        if(tentativas == t){
            ok = false
            return [ok,melhorW,tentativas,Yteste,melhorM,melhorV,guardaT]
        }
    }
    contTotal += tentativas
    return [ok,melhorW,tentativas,Yteste,melhorM,melhorV,guardaT]
}


function RandomArrayP(n,BD,YlinhaBD){  // Escolhendo aleatóriamente os pacientes //n: número de pacientes usados para gerar o hiperplano.
  //X: É um vetor com n pacientes utilizados para gerar o hiperplano
  //Ylinha: É o vetor Evolução com n pacientes utilizados para gerar o hiperplano
  //BD: Banco de dados que se quer separar
  //Resposta: Evolução dos pacientes do BD
  let indiceVivo = []
  let indiceMorto = []
  let PacientesEscolhidos = []
  let YlinhaEscolhidos = []
  for(let i=0;i<YlinhaBD.length;i++){
    if(YlinhaBD[i] == 1){ //YlinhaBD[1], YlinhaBD[5], YlinhaBD[7]
      indiceVivo.push(i) //indiceVivo[0] = 1, indiceVivo[1] = 5, indiceVivo[2] = 7
    }
    else {
      indiceMorto.push(i)
    }
  }

  for(let i=0;i<n;i++){
    if(i<n/2){
      let indiceRandomVivo = Math.floor(Math.random()*indiceVivo.length)
      PacientesEscolhidos.push(BD[indiceVivo[indiceRandomVivo]])
      YlinhaEscolhidos.push(1)
      indiceVivo.splice(indiceRandomVivo,1)
    }
    else{
      let indiceRandomMorto = Math.floor(Math.random()*indiceMorto.length)
      PacientesEscolhidos.push(BD[indiceMorto[indiceRandomMorto]])
      YlinhaEscolhidos.push(-1)
      indiceMorto.splice(indiceRandomMorto,1)
    }
  }
  return([PacientesEscolhidos, YlinhaEscolhidos])
    /*while(countPacientes < Math.min(Math.floor(n/2),PacientesVivos.length)){
        let idx = Math.floor(Math.random() * PacientesVivos.length)
        if(!PacientesVivosEscolhidos.includes(idx)){
            PacientesVivosEscolhidos.push(idx)
            X.push(PacientesVivos[idx])
            Ylinha.push(1)
            countPacientes++
        }
    }

    countPacientes = 0
    while(countPacientes < Math.floor(n/2)){
        idx = Math.floor(Math.random() * PacientesMortos.length)
        if(!PacientesMortosEscolhidos.includes(idx)){
            PacientesMortosEscolhidos.push(idx)
            X.push(PacientesMortos[idx])
            Ylinha.push(-1)
            countPacientes++
        }
    }*/
}

function RunPerceptron(n,t,BD,YlinhaBD){
    let arrE = []
    let PacientesEscolhidos = []
    let YlinhaEscolhidos = []
    // console.clear()

    arrE = RandomArrayP(n,BD,YlinhaBD)
    PacientesEscolhidos = arrE[0]
    YlinhaEscolhidos = arrE[1]
    //console.log(PacientesEscolhidos[0].length)
    //console.log(YlinhaEscolhidos)

    //Perceptron
    let W = []
    let b = 1

    for(let i=0;i<PacientesEscolhidos[0].length;i++){
        W.push(Math.random()+0.1)
    }

    let N = PacientesEscolhidos.length
    let ok, iteracoes

    let arr = Perceptron(PacientesEscolhidos,N,W,YlinhaEscolhidos,b,t)

    ok = arr[0]
    W = arr[1]
    iteracoes = arr[2]
    Yteste = arr[3]

    while(!ok){
        PacientesEscolhidos = [], YlinhaEscolhidos = []
        W = []

        arrE = RandomArrayP(n,BD,YlinhaBD)
        PacientesEscolhidos = arrE[0]
        YlinhaEscolhidos = arrE[1]

        for(let i=0;i<PacientesEscolhidos[0].length;i++){
            W.push(Math.random()+0.1)
        }

        arr = Perceptron(PacientesEscolhidos,N,W,YlinhaEscolhidos,b,t)
        return arr
        ok = arr[0]
        W = arr[1]
        iteracoes = arr[2]
        Yteste = arr[3]

        if(!ok) console.log("Não achou o Hiperplano")
    }


    // console.log("\nO hiperplano foi achado em %d iterações", iteracoes)
    // console.log(`Hiperplano = ${W}`)
    return [iteracoes,W]
}

function Run(z,n,t,BD,YlinhaBD){
    // console.log('Quantidade de mortos do banco = %d', CountMortos)
    // console.log('Quantidade de vivos do banco = %d', CountVivos)

    let iteracoes_media = 0
    for(let i=0;i<z;i++){
        let arr = RunPerceptron(n,t,BD,YlinhaBD)
        iteracoes_media += arr[0]

        // console.log(`Rodando o Perceptron pela ${i+1}° vez de ${z} vezes`)
        Arr_Hiperplanos.push(arr[1])
    }
    // console.log(`\n\nMédia de iterações para um n = ${n} e iteração máxima t = ${t}: ${iteracoes_media/z} iterações`)
}

function TesteDeSanidade(W,BDSanidade,YlinhaBDSanidade) {

    let contRemidos=0
    let contObitos=0

    for(let i=0;i<BDSanidade.length;i++){
        let aux = conta(W,BDSanidade,i)
        if(YlinhaBDSanidade[i] == -1 && sinal(aux) == -1){
            contObitos++
        }
        else if(YlinhaBDSanidade[i] == 1 && sinal(aux) == 1){
            contRemidos++
        }
    }
    return [contRemidos,contObitos]

}

var hrstart = process.hrtime()

function SliceBD(BD,YlinhaBD,n){  // Escolhendo aleatóriamente os pacientes //n: número de pacientes usados para gerar o hiperplano.
  //X: É um vetor com n pacientes utilizados para gerar o hiperplano
  //Ylinha: É o vetor Evolução com n pacientes utilizados para gerar o hiperplano
  //BD: Banco de dados que se quer separar
  //Resposta: Evolução dos pacientes do BD
  let indiceVivo = []
  let indiceMorto = []
  let PacientesTreino = []
  let PacientesTeste = []
  let YlinhaTreino = []
  let YlinhaTeste = []
  for(let i=0;i<BD.length;i++){
    if(YlinhaBD[i] == 1){ //YlinhaBD[1], YlinhaBD[5], YlinhaBD[7]
      indiceVivo.push(BD[i]) //indiceVivo[0] = 1, indiceVivo[1] = 5, indiceVivo[2] = 7
    }
    else {
      indiceMorto.push(BD[i])
    }
  }

  for(let i=0;i<n;i++){
      let indiceRandomVivo = Math.floor(Math.random()*(indiceVivo.length-i) + i)
      let tempV = indiceVivo[i]
      indiceVivo[i] = indiceVivo[indiceRandomVivo]
      indiceVivo[indiceRandomVivo] = tempV
      /*PacientesEscolhidos.push(BD[indiceVivo[indiceRandomVivo]])
      YlinhaEscolhidos.push(1)
      indiceVivo.splice(indiceRandomVivo,1)*/
      let indiceRandomMorto = Math.floor(Math.random()*(indiceMorto.length-i) + i)
      let tempM = indiceMorto[i]
      indiceMorto[i] = indiceMorto[indiceRandomMorto]
      indiceMorto[indiceRandomMorto] = tempM
      PacientesTreino.push(indiceMorto[i])
      YlinhaTreino.push(-1)
      PacientesTreino.push(indiceVivo[i])
      YlinhaTreino.push(1)
  }
  for(let i=n;i<indiceVivo.length;i++){
    PacientesTeste.push(indiceVivo[i])
    YlinhaTeste.push(1)
  }
  for(let i=n;i<indiceMorto.length;i++){
    PacientesTeste.push(indiceMorto[i])
    YlinhaTeste.push(-1)
  }

  return([PacientesTreino, YlinhaTreino, PacientesTeste, YlinhaTeste])
}


async function GeradorBD(){
    BD = []
    Ylinha = []
    await fs.createReadStream('BancoTratado2021_16_08_21.csv')
    .pipe(csv({}))
    .on('data', (data) => {  //Lógica aplicada a cada linha
        getSintomas(data)
    })
    .on('end', async () => {
      console.log('Quantidade de mortos do banco = %d', CountMortos)
      console.log('Quantidade de vivos do banco = %d', CountVivos)
      let ObitoTotalTeste = CountMortos - 10000
      let RemidoTotalTeste = CountVivos - 10000
      let contRemidos = 0
      let contObitos = 0
      let respSanidade = []
      let n = 10000
      let countHP = 0
      let countBD = 0
      let countW = 1
      let countFile = 0
      let acertosMTreino = 0
      let acertosVTreino = 0
      let tentativa = 0
      let BDTreino = []
      let YlinhaTreino = []
      let BDTeste = []
      let YlinhaTeste = []
      countW = 1
      while(true){
        countBD++
        let resp = SliceBD(BD,Ylinha,n)
        BDTreino = resp[0]
        YlinhaTreino = resp[1]
        BDTeste = resp[2]
        YlinhaTeste = resp[3]
        countHP = 0
        acertosMTreino = 0
        acertosVTreino = 0
        let W = []
        let b = 1

        for(let i=0;i<BDTreino[0].length;i++){
            W.push(Math.random()+0.1)
        }

        let N = BDTreino.length
        let ok, iteracoes
        let arr = Perceptron(BDTreino,N,W,YlinhaTreino,b,10000)

        ok = arr[0]
        W = arr[1]
        iteracoes = arr[2]
        Yteste = arr[3]
        acertosMTreino = arr[4]
        acertosVTreino = arr[5]
        tentativa = arr[6]
        respSanidade = TesteDeSanidade(W,BDTeste,YlinhaTeste)
        contRemidos = respSanidade[0]
        contObitos = respSanidade[1]
        //console.log(BD[1])
        //console.log(Saida[500])
        console.log(`AcertosV (Teste): ${contRemidos*100/RemidoTotalTeste}%`)
        console.log(`AcertosM (Teste): ${contObitos*100/ObitoTotalTeste}%`)
        console.log()
        //if(contObitos/ObitoTotalTeste >= 0.32 && contRemidos/RemidoTotalTeste >= 0.32){
          await writeFile(`HiperplanoEstrategiaDadoTeste`,countW,W,contObitos,contRemidos,(contObitos+contRemidos)/(ObitoTotalTeste+RemidoTotalTeste),tempo,N,acertosMTreino,acertosVTreino,tentativa)
          await writeFileF(`HiperplanoEstrategiaTeste`,countW,W,contObitos,contRemidos,(contObitos+contRemidos)/(ObitoTotalTeste+RemidoTotalTeste))
          countW++
          countHP++
        //}
    }
      //preOrder(ArvoreHP)
    })

    // return WFinal;
}

//0
//10
//15

let date = new Date()
var tempo = [date.getDate(),date.getMonth()+1,date.getFullYear(),date.getHours(),date.getMinutes(),date.getSeconds()]
GeradorBD()
