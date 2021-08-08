var simProcessList = [];
var variableSim = {};
var setID = 1;
var processes = [];
var currentProcess = {};
var stateSim = 'Ready';
var timeSimulationValues = {
    'instruction': 150,
    'change': 1200
};
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
                'instruction': 150,
                'change': 1200
            };
            break;
        case 'TiempoReal':
            timeSimulationValues = {
                'instruction': (variableSim.velocidad*1000),
                'change': (variableSim.tiempoIntercambio*1000)
            };
            break;

        case 'SinDelay':
            timeSimulationValues = {
                'instruction': 0,
                'change': 0
            };
            break;
    }    
}

// Agregar Proceso
function addInstruction(){
    addProcessInput = document.getElementById('add-process-input');
    value = parseInt(addProcessInput.value);
    if(value>0){
        process = createProcess(value);
        processes.push(process);

        renderProcessParam();
        addProcessInput.value = '';
    }
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
    getParameters();
    calculateValues();
    setCurrentProcess();
    calculateValues();
    renderVisualSimul();
    setStateSim('Execution');
    
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