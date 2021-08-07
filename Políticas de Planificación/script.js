var variableSim = {};
var setID = 1;
var processes = [];


// Variables simulacion
function getParameters(){
    
    inputSimCapacidad = document.getElementById('inputSimCapacidad').value;
    inputSimInstruccion = document.getElementById('inputSimInstruccion').value;
    inputSimIntercambio = document.getElementById('inputSimIntercambio').value;
    inputSimPolitica = document.getElementById('inputSimPolitica').value;
    inputSimQuantum = document.getElementById('inputSimQuantum').value;
      
    variablesSim = {
        'capacidad':inputSimCapacidad,
        'velocidad':inputSimInstruccion,
        'tiempoIntercambio':inputSimIntercambio,
        'politica':inputSimPolitica,
        'quantum':inputSimQuantum
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
        instructions:value
    };
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

//Simulación visual
function changeCpuIcon(iconName){
    imageComp = document.getElementById('state-image-comp');
    
    switch (iconName){
        case 'ready':
            imageComp.innerHTML = '<img src="./Assets/checked.png" alt="">'
            break;
        case 'wait':
            imageComp.innerHTML = '<img src="./Assets/wait.png" alt="">'
            break;
        case 'change':
            imageComp.innerHTML = '<img src="./Assets/change.png" alt="">'
            break;
    }
} 