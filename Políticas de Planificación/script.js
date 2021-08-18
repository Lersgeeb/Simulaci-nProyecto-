var simProcessList = [];
var variableSim = {};
var setID = 1;
var processes = [];
var currentProcess = {};
var stateSim = 'Ready';
var timeSimulationValues = {};
var realTimeExecution = 0
var timeQuamtumCounter = 0;

// Variables simulacion
function getParameters(){
    
    inputSimCapacidad = document.getElementById('inputSimCapacidad').value;
    inputSimInstruccion = document.getElementById('inputSimInstruccion').value;
    inputSimIntercambio = document.getElementById('inputSimIntercambio').value;
    inputSimPolitica = document.getElementById('inputSimPolitica').value;
    inputSimQuantum = document.getElementById('inputSimQuantum').value;
      
    variableSim = {
        'capacidad': parseInt(inputSimCapacidad),
        'velocidad': parseFloat(inputSimInstruccion),
        'tiempoIntercambio': parseFloat(inputSimIntercambio),
        'politica': inputSimPolitica,
        'quantum': parseInt(inputSimQuantum)
    }

}

function setTimeSimulation(){
    getParameters();
    timeExeSimulation = document.getElementById('timeExeSimulation').value;

    switch(timeExeSimulation){
        case 'Acelerado':
            timeSimulationValues = {
                'instruction': (variableSim.velocidad*100),
                'change': (variableSim.tiempoIntercambio*100),
                'visual':10
            };
            break;
        case 'TiempoReal':
            timeSimulationValues = {
                'instruction': (variableSim.velocidad*1000),
                'change': (variableSim.tiempoIntercambio*1000),
                'visual':100
            };
            break;

        case 'SinDelay':
            timeSimulationValues = {
                'instruction': 0,
                'change': 0,
                'visual':0
            };
            break;
    }    
}

// Agregar Proceso
function addInstruction(){
    getParameters()
    addProcessInput = document.getElementById('add-process-input');
    value = parseInt(addProcessInput.value);
    if(value>0 && processes.length<variableSim.capacidad){
        process = createProcess(value);
        processes.push(process);

        renderProcessParam();
        addProcessInput.value = '';
    }
}

function addRandomProcesses(){
    getParameters()
    for (i=processes.length; i<variableSim.capacidad; i++){
        process = createProcess(getRandomInt(0,111));
        processes.push(process);
    }
    
    renderProcessParam();
}


function createProcess(value){
    return {
        id:setID++,
        instructions:value,
        valuePolite:0,
        waitingTime:0
    };
}

function removeProcesses(){
    processes = [];
    renderProcessParam();
}

function removeProcess(processID){
    processes = processes.filter( process => process.id != processID);
    renderProcessParam();
}


function renderProcessParam(){
    processParamsVisual = document.getElementById('processParamsVisual');
    processParamsVisual.innerHTML = ' ';
    
    processes.map( process => {
        processParamsVisual.innerHTML += `
            <div class="process" id="process-${process.id}">
                <div class="white-space">
                    <div class="instruction-seg">
                        <div class="instructions-left">${process.instructions}</div>     
                        <div class="instruction-remove" onclick="removeProcess(${process.id})">x</div>
                    </div>
                </div>
            </div>        
        `
    });
}

//Simulación
async function startSimulation(){
    simProcessList = JSON.parse(JSON.stringify(processes));
    setTimeSimulation();
    calculateValues();
    setCurrentProcess();
    calculateValues();
    renderVisualSimul();
    setStateSim('Execution');
    startCount();
    while(stateSim != 'Ready'){

        if(stateSim == 'Execution'){

            switch (variableSim.politica){
                case 'FCFS':
                    await runningExecution(); 
                    break;
        
                case 'Round Robin': 
                    await runningExecutionRR();
                    break;
        
                case 'SPN':
                    await runningExecution(); 
                    break;
        
                case 'HRRN':
                    await runningExecutionHRRN();
            }
              

        }
        if(stateSim == 'Change'){
            await ProcessChange();
        }
    } 
}

async function runningExecution(){
    if(currentProcess.instructions > 0){
        await executeInstructions();
    }
    else{
        if(simProcessList.length > 0){
            setStateSim('Change');        
        }
        else{
            removeRealTime();
            renderResults();
            setCurrentProcess();
            setStateSim('Ready');
        }
    }
}

async function runningExecutionRR(){
    if( timeQuamtumCounter >= variableSim.quantum && currentProcess.instructions != 0){
        if(timeQuamtumCounter >= variableSim.quantum){
            setStateSim('Change');
            simProcessList.push(currentProcess);
        }
    }
    else{
        await runningExecution();
    }    
}

async function runningExecutionHRRN(){
    await runningExecution();
    calculateHRRN();
}

async function executeInstructions(){
    currentProcess.instructions -= 1;
    realTimeExecution += variableSim.velocidad;
    timeQuamtumCounter += variableSim.velocidad;
    renderVisualSimul();
    if(timeSimulationValues.instruction>0){
        await sleep(timeSimulationValues.instruction);
    }
}

async function ProcessChange(){
    setCurrentProcess();
    calculateValues();
    realTimeExecution += variableSim.tiempoIntercambio;
    await sleep(timeSimulationValues.change);
    setStateSim('Execution');
}


// Manipulación de valores para la simulación
function calculateValues(){
    
    switch (variableSim.politica){
        case 'FCFS':
            calculateFCFS();
            break;

        case 'Round Robin': 
            calculateRR();
            break;

        case 'SPN':
            calculateSPN();
            break;

        case 'HRRN':
            calculateHRRN();
            break;
    }
}

function calculateFCFS(){
    simProcessList.map( (process, index) => {
        process.valuePolite = index + 1
    })
}

function calculateRR(){
    simProcessList.map( (process, index) => {
        process.valuePolite = index + 1
    })
}

function calculateSPN(){
    simProcessList.sort((a, b) => parseInt(a.instructions) - parseInt(b.instructions));
    simProcessList.map( (process, index) => {
        process.valuePolite = index + 1
    })
}

function calculateHRRN(){
    simProcessList.map( (process) => {
        s =  variableSim.velocidad * process.instructions;
        process.valuePolite = ((realTimeExecution + s) / s).toFixed(2);
    });
    simProcessList.sort((a, b) => parseFloat(b.valuePolite) - parseFloat(a.valuePolite));
}

function setCurrentProcess(){
    currentProcess = simProcessList.shift();
}


//Render
function renderVisualSimul(){
    renderProcessQueue();
    renderCurrentProcess();
}

function renderProcessQueue(){
    processContainerSim = document.getElementById('process-container-sim');
    processContainerSim.innerHTML = " ";
    simProcessList.map( process => {

        processContainerSim.innerHTML += `
            <div class="process" id="process-sim-${process.id}">
                <div class="white-space">
                    <div class="instruction-seg">
                        <div class="instructions-left">${process.instructions}</div>
                        <div class="instruction-ratio">${process.valuePolite}</div>
                    </div>
                </div>
            </div>    
        `
    });
}

function renderCurrentProcess(){
    currentProcessContainer = document.getElementById('current-process-container');
    if(currentProcess){
        currentProcessContainer.innerHTML = `
            <div class="process" id="process-sim-${currentProcess.id}">
                <div class="white-space">
                    <div class="instruction-seg">
                        <div class="instructions-left">${currentProcess.instructions}</div>
                    </div>
                </div>
            </div>
        `
    }
    else{
        currentProcessContainer.innerHTML = " "
    }
   
}

function renderResults(){
    resultSegment = document.getElementById('resultSegment');
    resultSegment.innerHTML = `
        <h1>Resultados</h1>
        <div class="executionDiv">
            <h3>El tiempo total real de ejecución fue de: ${realTimeExecution.toFixed(2)} segundos</h3>
        </div>
    `
}

//State 

function setStateSim(state){
    console.log(state);
    stateSim = state;
    changeTime();
    changeCpuIcon();
    renderVisualSimul();
}

function changeCpuIcon(){
    imageComp = document.getElementById('state-image-comp');
    
    switch (stateSim){
        case 'Ready':
            imageComp.innerHTML = '<img src="./Assets/checked.png" alt="">'
            break;
        case 'Execution':
            imageComp.innerHTML = '<img src="./Assets/wait.png" alt="">'
            break;
        case 'Change':
            imageComp.innerHTML = '<img src="./Assets/change.png" alt="">'
            break;
    }
} 

function changeTime(){
    switch (stateSim){
        case 'Ready':
            realTimeExecution = 0
            timeQuamtumCounter = 0;
            break;
        case 'Change':
            timeQuamtumCounter = 0;
            break;
    }
} 


//Extra simulation
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); 
}

//tiempo de ejecucion
var secondsLabel = null;
var millisecondLabel = null;
var totalSeconds = 0;
var timeInterval = null;


function renderTimeExecutionCounter(){
    realTime = document.getElementById('realTime');
    realTime.innerHTML = `
        <h3>
            <span>Tiempo de ejecucción:</span>
            <label id="second">00</label>:<label id="millisecond">0</label>               
        </h3>
    `
    secondsLabel = document.getElementById("second");
    millisecondLabel = document.getElementById("millisecond");
    totalSeconds = 0;
    timeInterval = null;
}

function startCount(){
    renderTimeExecutionCounter();
    totalMilisecond = 0;
    timeInterval = setInterval(setTime,timeSimulationValues.visual);    
}

function setTime() {
    ++totalMilisecond;
    millisecondLabel.innerHTML = totalMilisecond % 10;
    secondsLabel.innerHTML = pad(parseInt(totalMilisecond / 10));
}


function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
      return "0" + valString;
    } else {
      return valString;
    }
}

function removeRealTime(){
    clearInterval(timeInterval);
    realTime = document.getElementById('realTime');
    realTime.innerHTML = "";
}