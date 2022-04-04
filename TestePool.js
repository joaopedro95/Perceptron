const csv = require('csv-parser');
const fs = require('fs')
const readLine = require("readline")


//const { writeFile } = require('./WriteFile')
const { readFile } = require('./ReadFile')

// Variáveis Globais
let PacientesMortos = [], PacientesVivos = []
let Pacientes = []
let CountMortos = 0, CountVivos = 0

let numHiperPlano = 103

let X = [], Ylinha = []
let PacientesVivosEscolhidos = [], PacientesMortosEscolhidos = []

let AcertoV = 0, ErroV = 0
let AcertoM = 0, ErroM = 0

async function getSintomas(data){
    // let campos = Object.keys(data).toString().split(',')
    let linha = Object.values(data).toString().split(',')

    let sintomas = []

    for(let i=0;i<linha.length-1;i++){
        sintomas.push(parseInt(linha[i]))
    }

    if(linha[linha.length-1] == "Vivo")Pacientes.push(sintomas), Ylinha.push(1);
    else Pacientes.push(sintomas), Ylinha.push(-1);
}

function conta(hiperplano,X,i){
    let H_i = 0
    for(let j=X[i].length; j>=0; j--){
        if(j==0) H_i += hiperplano[j]*(-1)
        else H_i += hiperplano[j]*X[i][j-1]
    }
    return H_i
}

function RandomArray(n){  // Escolhendo aleatóriamente os pacientes
    PacientesVivosEscolhidos = [], PacientesMortosEscolhidos = []

    let countPacientes = 0

    while(countPacientes < n/2){
        let idx = Math.floor(Math.random() * PacientesVivos.length)
        if(!PacientesVivosEscolhidos.includes(idx)){
            PacientesVivosEscolhidos.push(idx)
            X.push(PacientesVivos[idx])
            Ylinha.push(1)
            countPacientes++
        }
    }

    countPacientes = 0
    while(countPacientes < n/2){
        idx = Math.floor(Math.random() * PacientesMortos.length)
        if(!PacientesMortosEscolhidos.includes(idx)){
            PacientesMortosEscolhidos.push(idx)
            X.push(PacientesMortos[idx])
            Ylinha.push(-1)
            countPacientes++
        }
    }
}

function sinal(z){
    if(z>0) return 1
    else if(z<0){
        return -1
    }
    else return 0
}

var hrstart = process.hrtime()

function TestePool(){
    fs.createReadStream('Sintoma2021Perceptron2.csv')
    .pipe(csv({}))
    .on('data', (data) => {  //Lógica aplicada a cada linha
        getSintomas(data)
    })
    .on('end', async () => {   //Lógica aplicada quando chega no EOF
        console.log('Quantidade de mortos do banco = %d', CountMortos)
        console.log('Quantidade de vivos do banco = %d\n\n', CountVivos)
        //338460_21
        //268290_20
        let Hpidx = 1
        let matrizH = new Array(150).fill(0).map(_ => new Array(2).fill(0))
        for(let i = 0; i<Pacientes.length; i++){
            let arrH_i = []
            let vivo = 0, morto = 0
            //Hpidx == qtd hiperplanos

            for(Hpidx = 1; Hpidx<=numHiperPlano;Hpidx++){
                let arr = await readFile('HiperplanoEstrategia1Real',`Hiperplano${Hpidx}`,X.length)
                let hiperplano = arr[1]

                hiperplano = hiperplano.split(',')

                for(let k=0;k<hiperplano.length-1;k++){
                    hiperplano[k] = parseInt(hiperplano[k])
                }
                // Início Calcula H(i)

                // console.log(hiperplano.length)
                // console.log(X[i].length)
                // console.log('\n')

                let H_i = conta(hiperplano,Pacientes,i)
                arrH_i.push(H_i)

                // Fim Calcula H(i)

                if(H_i > 0){
                  vivo++
                  if(Ylinha[i] == 1){
                    matrizH[Hpidx-1][0]++
                  }
                }
                else{
                  morto++
                  if(Ylinha[i] == -1){
                    matrizH[Hpidx-1][1]++
                  }
                }

            }

            let contMH_i=0,contVH_i=0
            for (let j=0;j<arrH_i.length;j++){
                if(arrH_i[j]<0) contMH_i++
                else contVH_i++
            }

            Hpidx--
            if((vivo/Hpidx) >= (1/2)){
                if(Ylinha[i] == 1) AcertoV++
                else ErroV++
            }else {
                if(Ylinha[i] == -1) AcertoM++
                else ErroM++
            }

            /*console.log(`Paciente ${i} = `, X[i])
            console.log(`\narrH_i = `, arrH_i)
            console.log(`Evolução = ${Ylinha[i]}`)
            console.log(`Tamanho da pool = ${Hpidx}`)
            console.log(`Contador de Hip. vivos/mortos= ${contVH_i}/${contMH_i}\n`)*/
        }
        /*for(let i=0;i<18;i++){
          console.log(matrizH[i][0])
        }
        console.log('\n')
        for(let i=0;i<18;i++){
          console.log(matrizH[i][1])
        }*/
        console.log('\n')
        console.log("Qtd. de hiperplanos = ",Hpidx)
        console.log("AcertoV = ", AcertoV )
        console.log("ErroV = ", ErroV )
        console.log("AcertoM = ", AcertoM )
        console.log("ErroM = ", ErroM )
        //Calculando o tempo de execução do código
        let hrend = process.hrtime(hrstart)
        console.info('\nExecution time (hr): %ds %dms\n', hrend[0], hrend[1] / 1000000)
    }
    )

    return [AcertoV,ErroV,AcertoM,ErroM]
}

TestePool()
module.exports = {
    TestePool,
    conta
}
