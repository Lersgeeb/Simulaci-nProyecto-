var MATRIX = [false, false, false, false,
    false, false, false, false,
    false, false, false, false,
    false, false, false, false,
    false, false, false, false,
    false, false, false, false,
    false, false, false, false,
    false, false, false, false,
    false, false, false, false,
    false, false, false, false,
    false, false, false, false,
    false, false, false, false,
    false, false, false, false,
    false, false, false, false,
    false, false, false, false,
    false, false, false, false
];

var option, option2;
var array = [];
var lastTop = [];
var lasTopSplit = [];
var friend = [];
var count = 2;
var processCount = 0;
var total = 64;
var dinamicFull = false;
var procesFollow = [];
var mbFollow = [];
var superSuma = 0;

function getID() {
    alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    randomID = "";
    for (i = 0; i < 4; i++) {
        r = Math.floor(Math.random() * 27);
        randomID += alphabet[r];
    }
    return randomID;
}

function resetMatrix() {
    MATRIX = [false, false, false, false,
        false, false, false, false,
        false, false, false, false,
        false, false, false, false,
        false, false, false, false,
        false, false, false, false,
        false, false, false, false,
        false, false, false, false,
        false, false, false, false,
        false, false, false, false,
        false, false, false, false,
        false, false, false, false,
        false, false, false, false,
        false, false, false, false,
        false, false, false, false,
        false, false, false, false
    ];
}

function remove(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    parent.style.backgroundColor = "lightblue";
}

function removeFriends(div) {

    console.log("adentro de remove ")
    if (typeof(div) == "object") {
        div.style.backgroundColor = "lightblue";
    }

    for (i = 0; i < friend.length; i++) {
        if (
            item(friend[i][0]).style.height == item(friend[i][1]).style.height &&
            item(friend[i][0]).style.backgroundColor == "lightblue" &&
            item(friend[i][1]).style.backgroundColor == "lightblue"
        ) {
            item("memory").removeChild(item(friend[i][1]));
            height = parseInt(item(friend[i][0]).style.height.replace("vh", ""));
            item(friend[i][0]).style.height = `${height * 2}vh`
            friend.splice(i, 1);
            removeFriends("f");
        }
    }
}

function item(n) {
    return document.getElementById(n);
}

function button() {
    if (dinamicFull == false) {
        processCount++;
        state = true;
        mb = item("mb").value;
        action();
    } else {
        alert('Memoria llena');
    }
}

function select() {
    mb = false;
    state = false;
    option = item("gestor").value
    option2 = item("staticOption").value;
    action();
}

function matrixMom(mb) {
    var p_inicial = MATRIX.indexOf(false, 0);
    var columna = Math.floor(p_inicial / 16) + 1;
    var fila = (p_inicial % 16) + 1;
    var array = [];
    var suma = 0;

    for (let index = p_inicial; index < parseInt(mb) + p_inicial; index++) {

        if ((64 - (parseInt(mb) + p_inicial)) >= 0) {

            item(columna + "a" + fila).style.backgroundColor = "green";
            array.push(columna + "a" + fila);
            if ((64 - (parseInt(mb) + p_inicial)) == 0) {
                dinamicFull = true;
            }
        } else {
            alert('No hay espacio en la memoria para este proceso');
            break;
        }
        fila++;
        if ((index + 1) % 16 == 0) {
            columna++;
            fila = 1;
        }
        MATRIX[index] = `p${processCount}`;
    }
    if (MATRIX.includes(`p${processCount}`)) {
        processBottom = "<div id='w' ondblclick='removeDinamic(this);' style = 'position: relative; width: 4vw; height:4vh; border:0.5px solid black; background-color: grey;'></div>";

        item("processTable").innerHTML += processBottom;
        item("w").innerHTML += `p${processCount}`;
        item("w").id = `p${processCount}`;
        procesFollow.push(array);

    }

}

function removeDinamic(div) {
    var suma = 0;
    if (MATRIX.includes(div.id)) {
        for (let index = 0; index < MATRIX.length; index++) {
            if (MATRIX[index] == div.id) {
                MATRIX[index] = false;
            }
        }
    }
    n = div.id.replace("p", "")
    for (let i = 0; i < procesFollow[n - 1].length; i++) {
        item(procesFollow[n - 1][i]).style.backgroundColor = "lightblue";
    }

    item("processTable").removeChild(div);
    dinamicFull = false;
    p_inicial = MATRIX.indexOf(false, 0);

}

function verificarValorinicial(valor_verificar) {
    if (valor_verificar < 0 || valor_verificar > 64) {
        return false;
    } else {
        return true;
    }
}

function CR() {
    fill = "<div id='n' style = 'position: absolute; left: 2vw; top: 5vh; width: 4vw; height:4vh; border:0.5px solid black; background-color: lightblue;'></div>";

    left = ["2vw", "7vw", "12vw", "17vw"];
    if (state != true) {
        for (i = 1; i < 5; i++) {
            for (j = 1; j < 17; j++) {
                if (j == 1) {
                    item("memory").innerHTML += fill;
                    item("n").id = `${i}a${j}`;
                    item(`${i}a${j}`).style.left = left[i - 1];
                } else {
                    item("memory").innerHTML += fill;
                    item("n").id = `${i}a${j}`;
                    lastTop = parseInt(item(`${i}a${j - 1}`).style.top.replace("vh", ""));
                    item(`${i}a${j}`).style.top = `${lastTop + 5}vh`;
                    item(`${i}a${j}`).style.left = left[i - 1];
                }
            }
        }
    }
}

function action() {

    if (!option) {
        alert("Seleccione una opcion");

    } else if (option == "static") {
        if (state == false) {
            item("dinamicBox").style.display = "none";
            item("staticBox").style.display = "block";
            item("processTable").style.display = "none";
            item("processTable").innerHTML = "";
            item("memory").innerHTML = "";
        }

        if (option2 == "same") {
            space = "<div id='n' ondblclick='remove(this);' style = 'position: relative; left: 2vw; top: 5vh; width: 20vw; height:10vh; border:0.5px solid black; background-color: lightblue;'></div>";
            if (state == false) {
                for (i = 1; i < 9; i++) {
                    item("memory").innerHTML += space;
                    item("n").id = i;
                }
            }

            if (mb < 9 && mb > 0) {
                fill = "<div id = 's' style = 'width: 100%; height:10vh; background-color: green;'></div>";
                for (j = 1; j < 9; j++) {
                    if (item(j).innerHTML == "") {
                        item(j).innerHTML = fill;
                        item(j).style.backgroundColor = "rgb(240, 46, 46)"; //Rojo
                        item("s").style.height = `${(mb / 8) * 100}%`;
                        newID = getID();
                        item("s").id = newID;
                        break;
                    }
                }
                if (j == 9) {
                    alert("¡No hay espacio suficiente!")
                }
            } else if (mb > 8) {
                alert("¡No hay espacio suficiente!")
            }

        } else if (option2 == "different") {
            space = "<div id='n' ondblclick='remove(this);' style = 'position: relative; left: 2vw; top: 5vh; width: 20vw; height:5vh; border:0.5px solid black; background-color: lightblue;'></div>";
            if (state == false) {
                for (i = 1; i < 6; i++) {
                    item("memory").innerHTML += space;
                    item("n").id = i;
                    a = item(`${i}`).style.height = `${(i * 10) / 2}vh`; //5vh 10vh 15vh 20vh 25vh
                }
            }

            if (mb < 33 && mb > 0) {
                fill = "<div id = 'd' style = 'width: 100%; height:10vh; background-color: green;'></div>";

                if (item(1).innerHTML == "" && mb < 3) {
                    item(1).innerHTML = fill; // meter el color verde
                    item(1).style.backgroundColor = "rgb(240, 46, 46)"; //Rojo
                    item("d").style.height = `${(mb / 2) * 100}%`; //Tamaño del color verde
                    item("d").id = `${1}d`;

                } else if (item(2).innerHTML == "" && mb < 5) {
                    item(2).innerHTML = fill; // meter el color verde
                    item(2).style.backgroundColor = " rgb(240, 46, 46)"; //Rojo
                    item("d").style.height = `${(mb / 4) * 100}%`; //Tamaño del color verde
                    item("d").id = `${2}d`;

                } else if (item(3).innerHTML == "" && mb < 9) {
                    item(3).innerHTML = fill; // meter el color verde
                    item(3).style.backgroundColor = " rgb(240, 46, 46)"; //rojo
                    item("d").style.height = `${(mb / 8) * 100}%`; //Tamaño del color verde
                    item("d").id = `${3}d`;

                } else if (item(4).innerHTML == "" && mb < 17) {
                    item(4).innerHTML = fill; // meter el color verde
                    item(4).style.backgroundColor = " rgb(240, 46, 46)"; //rojo
                    item("d").style.height = `${(mb / 16) * 100}%`; //Tamaño del color verde
                    item("d").id = `${4}d`;

                } else if (item(5).innerHTML == "" && mb < 33) {
                    item(5).innerHTML = fill; // meter el color verde
                    item(5).style.backgroundColor = " rgb(240, 46, 46)"; //rojo
                    item("d").style.height = `${(mb / 32) * 100}%`; //Tamaño del color verde
                    item("d").id = `${5}d`;

                } else if (mb > 32) {
                    alert("¡No hay espacio suficiente!");
                } else {
                    alert("¡No hay espacio suficiente!");
                }

            }
        }
    } else if (option == "dinamic") {

        option2 = item("dinamicOption").value;

        if (state == false) {
            item("memory").innerHTML = "";
            item("staticBox").style.display = "none";
            //item("dinamicBox").style.display = "block";
            item("processTable").style.display = "block";
            item("processTable").innerHTML = "";
            CR();
            resetMatrix();
            process = [];
            dinamicFull = false;
            procesFollow = [];
            processCount = 0;

        }

        if (option2 == "first") {
            if (verificarValorinicial(mb) == true) {
                matrixMom(mb);
            } else {
                alert('Capacidad de memoria invalida para este proceso');
            }

        } else if (option2 == "best" && mb != false) {
            if (verificarValorinicial(mb) == true) {
                matrixMom(mb);
            } else {
                alert('Capacidad de memoria invalida para este proceso');
            }

        } else if (option2 == "last" && mb != false) {
            if (verificarValorinicial(mb) == true) {
                matrixMom(mb);
            } else {
                alert('Capacidad de memoria invalida para este proceso');
            }
        }

    } else if (option == "friends") {

        if (state == false) {

            item("memory").innerHTML = "";
            space = "<div id='n' ondblclick = removeFriends(this); style = 'position: relative; left: 2vw; top: 5vh; width: 20vw; height:80vh; border:0.5px solid black; background-color: lightblue;'></div>";
            item("staticBox").style.display = "none";
            item("dinamicBox").style.display = "none";
            item("processTable").style.display = "none";
            item("processTable").innerHTML = "";
            item("memory").innerHTML = space;
            item("n").id = "1f";
            first = item("memory").firstChild;
            total = 64;
            count = 2;
            start = true;
        }
        console.log("ejecutar friends");
        removeFriends("f");
        if (mb < 65) {
            if (start) {
                while (mb <= total && mb != false) {
                    total = total / 2;
                    if (mb <= total) {
                        divide = parseInt(first.style.height.replace("vh", ""));
                        first.style.height = `${divide / 2}vh`;
                        item("memory").innerHTML += space;
                        item("n").id = `${count}f`;
                        item(`${count}f`).style.height = `${divide / 2}vh`;
                        friend.push([first.id, `${count}f`])
                        first = item(`${count}f`);
                        start = false;
                        count++;
                    }
                }
                if (mb != false) {
                    first.style.backgroundColor = "green";
                }

            } else {
                // 80vh = 64mb, 40vh = 32mb, 20vh = 16mb, 10vh = 8mb, 5vh = 4mb, 2.5vh = 2mb, 1vh = 1mb;
                parent = item("memory").children
                amount = false;
                HArray = ["80vh", "40vh", "20vh", "10vh", "5vh", "2.5vh", "1vh"];
                mbArray = [64, 32, 16, 8, 4, 2, 1];
                save = []
                change = false;

                for (i = parent.length - 1; i >= 0; i--) {
                    save.push([parent[i].outerHTML, parent[i].id]);
                    last = parent[i]
                    item("memory").removeChild(parent[i]);
                    if (last.style.backgroundColor == "lightblue") {
                        for (j = 0; j < 7; j++) {
                            if (last.style.height == HArray[j]) {
                                amount = mbArray[j];
                                break;
                            }
                        }
                        if (mb <= amount) {
                            currentLast = last;
                            while (mb <= amount) {
                                current = amount / 2;
                                if (mb <= current) {
                                    friend.push([currentLast.id, `${count}f`])
                                    divide = parseInt(currentLast.style.height.replace("vh", ""));
                                    item("memory").innerHTML += space;
                                    item("n").id = `${count}f`;
                                    item(`${count}f`).style.height = `${divide / 2}vh`;
                                    currentLast = item(`${count}f`);
                                    count++;
                                    amount = current;
                                    change = true;
                                } else {
                                    break
                                }
                            }
                            if (mb <= amount) {
                                if (change) {
                                    for (k = save.length - 1; k >= 0; k--) {
                                        item("memory").innerHTML += save[k][0]
                                    }
                                    item(save[save.length - 1][1]).style.height = `${divide / 2}vh`;
                                    item(save[save.length - 1][1]).style.backgroundColor = "green";
                                    break;
                                } else {
                                    for (k = save.length - 1; k >= 0; k--) {
                                        item("memory").innerHTML += save[k][0]
                                    }
                                    item(save[save.length - 1][1]).style.backgroundColor = "green";
                                    break;
                                }
                            }
                        }
                    }
                }
                if (item("memory").innerHTML == "") {
                    for (k = save.length - 1; k >= 0; k--) {
                        item("memory").innerHTML += save[k][0]
                    }
                    alert("!Memoria llena ó no hay espacio suficiente¡");
                }
            }
        } else {
            alert("¡No hay espacio suficiente!");
        }
    } else {
        item("staticBox").style.display = "none";
        item("dinamicBox").style.display = "none";
        item("processTable").style.display = "none";
    }
}