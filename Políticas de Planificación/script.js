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

function removeProcess(processID){
    processComp = document.getElementById(`process-${processID}`);
    processComp.remove();
}