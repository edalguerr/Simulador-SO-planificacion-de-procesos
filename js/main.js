
var procesos = [//Datos de prueba
    { nombre: 'A', tLlegada: 0, tCpu: 6, prioridad: 1, tInicio: 0, tFin: 0, tEspera: 0 },
    { nombre: 'B', tLlegada: 1, tCpu: 4, prioridad: 2, tInicio: 0, tFin: 0, tEspera: 0 },
    { nombre: 'C', tLlegada: 3, tCpu: 1, prioridad: 3, tInicio: 0, tFin: 0, tEspera: 0 },
    { nombre: 'D', tLlegada: 5, tCpu: 3, prioridad: 4, tInicio: 0, tFin: 0, tEspera: 0 }
];

var procesosOrigi = [//Datos de prueba
    { nombre: 'A', tLlegada: 0, tCpu: 6, prioridad: 1, tInicio: 0, tFin: 0, tEspera: 0 },
    { nombre: 'B', tLlegada: 1, tCpu: 4, prioridad: 2, tInicio: 0, tFin: 0, tEspera: 0 },
    { nombre: 'C', tLlegada: 3, tCpu: 1, prioridad: 3, tInicio: 0, tFin: 0, tEspera: 0 },
    { nombre: 'D', tLlegada: 5, tCpu: 3, prioridad: 4, tInicio: 0, tFin: 0, tEspera: 0 }
];
var table = document.getElementById("procesosTable");
var tiempoPromedioEl = document.getElementById('tiempoPromedio');

renderizarProcesos();

function agregarProceso() {
    //console.log(e[0].value)

    let nuevoProceso = {
        nombre: document.getElementById("nombre").value,
        tLlegada: parseInt(document.getElementById("tLlegada").value),
        tCpu: parseInt(document.getElementById("tCpu").value),
        prioridad: parseInt(document.getElementById("prioridad").value),
        tInicio: 0,
        tFin: 0,
        tEspera: 0
    };

    procesos.push(nuevoProceso);
    renderizarProcesos();

    //alert('Proceso agregado');

    formAgregar.reset();
    
}


function renderizarProcesos() {
    //var table = document.getElementById("procesosTable");
    //console.log("tabla: "+table.rows.length)

    let lengthTable = table.rows.length;
    for (let i = 1; i < lengthTable; i++) {
        table.deleteRow(1);
        //console.log(i)   
    }

    for (let i = 0; i < procesos.length; i++) {

        let row = table.insertRow(-1);
        let celNombre = row.insertCell(0);
        let celTLlegada = row.insertCell(1);
        let celTcpu = row.insertCell(2);
        let celPrioridad = row.insertCell(3);
        let celTInicio = row.insertCell(4);
        let celTFin = row.insertCell(5);
        let celTEspera = row.insertCell(6);

        celNombre.innerHTML = procesos[i].nombre;
        celTLlegada.innerHTML = procesos[i].tLlegada;
        celTcpu.innerHTML = procesos[i].tCpu;
        celPrioridad.innerHTML = procesos[i].prioridad;
        celTInicio.innerHTML = procesos[i].tInicio;
        celTFin.innerHTML = procesos[i].tFin;
        celTEspera.innerHTML = procesos[i].tEspera;

    }
    //console.log("tabla: "+table.rows.length)
    //console.log("procesos: "+procesos.length)
}


function algoritmoSJF() {

    let tiempoGlobal = 0;
    let tiempoEsperaTotal = 0;
    let numProcesosCompletos = 0;

    let procesosSJF = procesos.slice();


    //ordenando el arreglo por tiempo de cpu, de menor a mayor
    procesosSJF.sort(function (a, b) {
        return a.tCpu - b.tCpu;
    });

    console.log(procesosSJF)

    while (numProcesosCompletos < procesosSJF.length) {
        //para que el tiempo global se actualize al proceso mas
        //cercano que llegue, Ej: para evitar error del tipo: si el proceso
        //que primero llega, llega en el segundo 1, el tiempo global no se estancaria
        //se actualizaria a 1, si luego llega uno en 4 y otro en 6, 
        //entonces el tiempo global se actualiza a 4
        let tMenorLLegada = procesosSJF[0].tLlegada;

        for (let i = 0; i < procesosSJF.length; i++) {

            //se ejecuta el proceso si ya llegó y si no se habia ejecutado
            if (procesosSJF[i].tLlegada <= tiempoGlobal && !procesosSJF[i].completado) {
                procesosSJF[i].completado = true;
                procesosSJF[i].tInicio = tiempoGlobal;
                tiempoGlobal += procesosSJF[i].tCpu;
                procesosSJF[i].tFin = procesosSJF[i].tInicio + procesosSJF[i].tCpu;
                procesosSJF[i].tEspera = procesosSJF[i].tInicio - procesosSJF[i].tLlegada;
                tiempoEsperaTotal += procesosSJF[i].tEspera;

                numProcesosCompletos++;
            }

            if (tMenorLLegada > procesosSJF[i].tLlegada && !procesosSJF[i].completado) {
                tMenorLLegada = procesosSJF[i].tLlegada;
            }

        }

        //actualizamos el tiempo global solo si este es menor que el tiempo de 
        //llegada del proceso mas cercano, es decir cuando el tiempo global no alcanza
        //a ningun proceso 
        if (tiempoGlobal < tMenorLLegada) {
            tiempoGlobal = tMenorLLegada;
        }
    }


    //actualizando la información en el arreglo original
    procesos = procesosSJF;

    //ordenando la informacion segun tiempo llegada
    procesos.sort(function (a, b) {
        return a.tLlegada - b.tLlegada;
    })

    tiempoPromedioEl.innerHTML += '' + (tiempoEsperaTotal / procesos.length);

    //renderizando los nuevos datos
    renderizarProcesos();

}


function algoritmoSRTF() {
    let tiempoGlobal = 0;
    let tiempoEsperaTotal = 0;
    let numProcesosCompletos = 0;
    let demoroMenos = true;
    //let iAnterior = 0;

    let procesosSRTF = procesos.slice();


    //ordenando el arreglo por tiempo de llegada, de menor a mayor
    procesosSRTF.sort(function (a, b) {
        return a.tLlegada - b.tLlegada;
    })

    console.log(procesosSRTF)

    while (numProcesosCompletos < procesosSRTF.length) {


        //tomarlo en primera persona, tratando el proceso como un objeto

        for (let i = 0; i < procesosSRTF.length; i++) {
            console.log(i)
            //estoy en la cola  en el tiempo actual y tengo tiempo de
            //ejecucion mayor a cero?
            if (procesosSRTF[i].tLlegada <= tiempoGlobal && procesosSRTF[i].tCpu > 0) {
                console.log('entro')
                //debugger;
                //iAnterior = i;
                //estoy en la cola  en el tiempo actual y tengo tiempo de
                //ejecucion mayor a cero?
                //hay algun otro que haya llegado en el tiempo actual
                //y tenga menos duracion de cpu que yo?
                //R/= Si, entonces no hago nada, no me ejecuto
                //R/= No, entonces me ejecuto durante un instante de tiempo
                //NOTA: el tiempo global se actualiza fuera del for principal
                //que está dentro del while

                //hay algun otro con menos duracion de cpu que yo?
                demoroMenos = true;
                for (let x = 0; x < procesosSRTF.length; x++) {

                    //R/= Si, hay alguien mas que demora menos que yo,
                    //entonces no es mi turno, debo esperar
                    if (procesosSRTF[x].tCpu < procesosSRTF[i].tCpu && procesosSRTF[x].tLlegada <= tiempoGlobal && !procesosSRTF[x].completado) {
                        demoroMenos = false;

                        break;
                    }
                }

                //R/= No, yo soy el que demoro menos, al fin es mi turno,
                //entonces me ejecuto durante un instante de tiempo
                if (demoroMenos) {
                    console.log('demoro menos: ' + procesosSRTF[i].nombre)
                    procesosSRTF[i].tInicio = tiempoGlobal;
                    procesosSRTF[i].tCpu -= 1;

                    /*Es mi primer turno?
                    R/= Si, entonces debo usar el tiempo de llegada
                    R/= No, entonces debo usar la ultima vez que fué mi turno(tFin)
                    */

                    //R/= No, entonces debo usar la ultima vez que fué mi turno(tFin)
                    if (procesosSRTF[i].tFin > 0) {
                        procesosSRTF[i].tEspera += (procesosSRTF[i].tInicio - procesosSRTF[i].tFin);
                        tiempoEsperaTotal += (procesosSRTF[i].tInicio - procesosSRTF[i].tFin);
                    }
                    //R/= Si, entonces debo usar el tiempo de llegada
                    else {
                        procesosSRTF[i].tEspera += (procesosSRTF[i].tInicio - procesosSRTF[i].tLlegada);
                        tiempoEsperaTotal += (procesosSRTF[i].tInicio - procesosSRTF[i].tLlegada);
                    }


                    procesosSRTF[i].tFin = 1 + tiempoGlobal;

                }


            }

            //Ya terminé todo lo que debia hacer?
            //R/= Si, entonces aviso que ya termine y que ahora faltan menos
            //procesos
            //R/= No, entonces no hago nada
            if (procesosSRTF[i].tCpu <= 0 && !procesosSRTF[i].completado) {
                numProcesosCompletos++;
                procesosSRTF[i].completado = true;
                console.log('completado: ' + numProcesosCompletos)
            }

            //para evitar que se ejecuten dos procesos en un mismo instante de tiempo
            if (demoroMenos) {
                break;
            }

        }
        debugger;

        //el tiempo va a ir avanzando de 1 por 1
        tiempoGlobal += 1;
        console.log('Tiempo global' + tiempoGlobal);

    }


    //actualizando la información en el arreglo original
    procesos = procesosSRTF;

    //ordenando la informacion segun tiempo llegada
    procesos.sort(function (a, b) {
        return a.tLlegada - b.tLlegada;
    })

    tiempoPromedioEl.innerHTML += '' + (tiempoEsperaTotal / procesos.length);

    //renderizando los nuevos datos
    renderizarProcesos();
}


function prioridadExpropiativa() {
    let tiempoGlobal = 0;
    let tiempoEsperaTotal = 0;
    let numProcesosCompletos = 0;
    let mayorPrioridad = true;

    let procesosSRTF = procesos.slice();


    //ordenando el arreglo por tiempo de llegada, de menor a mayor
    procesosSRTF.sort(function (a, b) {
        return a.tLlegada - b.tLlegada;
    })

    console.log(procesosSRTF)

    while (numProcesosCompletos < procesosSRTF.length) {


        //tomarlo en primera persona, tratando el proceso como un objeto

        for (let i = 0; i < procesosSRTF.length; i++) {
            console.log(i)
            //estoy en la cola  en el tiempo actual y tengo tiempo de
            //ejecucion mayor a cero?
            if (procesosSRTF[i].tLlegada <= tiempoGlobal && procesosSRTF[i].tCpu > 0) {
                console.log('entro')
                //debugger;
                
                //estoy en la cola  en el tiempo actual y tengo tiempo de
                //ejecucion mayor a cero?
                //hay algun otro que haya llegado en el tiempo actual
                //y tenga mayor prioridad que yo?)(tiene mas prioridad los mas cercanos a cero)
                //R/= Si, entonces no hago nada, no me ejecuto
                //R/= No, entonces me ejecuto durante un instante de tiempo
                //NOTA: el tiempo global se actualiza fuera del for principal
                //que está dentro del while

                //hay algun otro con mayor prioridad que yo?
                mayorPrioridad = true;
                for (let x = 0; x < procesosSRTF.length; x++) {

                    //R/= Si, hay alguien mas con mayor prioridad que yo,
                    //entonces no es mi turno, debo esperar
                    if (procesosSRTF[x].prioridad > procesosSRTF[i].prioridad && procesosSRTF[x].tLlegada <= tiempoGlobal && !procesosSRTF[x].completado) {
                        mayorPrioridad = false;

                        break;
                    }
                }

                //R/= No, yo soy el de mayor prioridad, al fin es mi turno,
                //entonces me ejecuto durante un instante de tiempo
                if (mayorPrioridad) {
                    console.log('mayor prioridad: ' + procesosSRTF[i].nombre)
                    procesosSRTF[i].tInicio = tiempoGlobal;
                    procesosSRTF[i].tCpu -= 1;

                    /*Es mi primer turno?
                    R/= Si, entonces debo usar el tiempo de llegada
                    R/= No, entonces debo usar la ultima vez que fué mi turno(tFin)
                    */

                    //R/= No, entonces debo usar la ultima vez que fué mi turno(tFin)
                    if (procesosSRTF[i].tFin > 0) {
                        procesosSRTF[i].tEspera += (procesosSRTF[i].tInicio - procesosSRTF[i].tFin);
                        tiempoEsperaTotal += (procesosSRTF[i].tInicio - procesosSRTF[i].tFin);
                    }
                    //R/= Si, entonces debo usar el tiempo de llegada
                    else {
                        procesosSRTF[i].tEspera += (procesosSRTF[i].tInicio - procesosSRTF[i].tLlegada);
                        tiempoEsperaTotal += (procesosSRTF[i].tInicio - procesosSRTF[i].tLlegada);
                    }


                    procesosSRTF[i].tFin = 1 + tiempoGlobal;

                }


            }

            //Ya terminé todo lo que debia hacer?
            //R/= Si, entonces aviso que ya termine y que ahora faltan menos
            //procesos
            //R/= No, entonces no hago nada
            if (procesosSRTF[i].tCpu <= 0 && !procesosSRTF[i].completado) {
                numProcesosCompletos++;
                procesosSRTF[i].completado = true;
                console.log('completado: ' + numProcesosCompletos)
            }

            //para evitar que se ejecuten dos procesos en un mismo instante de tiempo
            if (mayorPrioridad) {
                break;
            }

        }
        debugger;

        //el tiempo va a ir avanzando de 1 por 1
        tiempoGlobal += 1;
        console.log('Tiempo global' + tiempoGlobal);

    }


    //actualizando la información en el arreglo original
    procesos = procesosSRTF;

    //ordenando la informacion segun tiempo llegada
    procesos.sort(function (a, b) {
        return a.tLlegada - b.tLlegada;
    })

    tiempoPromedioEl.innerHTML += '' + (tiempoEsperaTotal / procesos.length);

    //renderizando los nuevos datos
    renderizarProcesos();
}


function restaurarProcesos(){
    
    procesos =  procesosOrigi.slice();
    //console.log("restaurar");
    //console.log(procesosOrigi)
    //console.log(procesos)
    renderizarProcesos();
}


