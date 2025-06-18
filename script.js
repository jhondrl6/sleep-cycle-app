document.addEventListener('DOMContentLoaded', () => {
    // 1. DOM Element References
    const fechaInput = document.getElementById('fecha');
    const horaInput = document.getElementById('hora');
    const valorGlucosaInput = document.getElementById('valorGlucosa');
    const observacionesInput = document.getElementById('observaciones');

    const btnAgregar = document.getElementById('btnAgregar');
    const btnPromedioRango = document.getElementById('btnPromedioRango');
    const btnPromedioUltimaSemana = document.getElementById('btnPromedioUltimaSemana');
    const btnPromedioUltimasDosSemanas = document.getElementById('btnPromedioUltimasDosSemanas');

    const historialTablaBody = document.getElementById('historialTablaBody');
    const resultadoPromedioDiv = document.getElementById('resultadoPromedio');

    const fechaInicioPromedioInput = document.getElementById('fechaInicioPromedio');
    const fechaFinPromedioInput = document.getElementById('fechaFinPromedio');

    // New DOM element references for specific dates and day of the week
    const fechasEspecificasInput = document.getElementById('fechasEspecificasInput');
    const btnPromedioFechasEspecificas = document.getElementById('btnPromedioFechasEspecificas');
    const resultadoPromedioFechasEspecificasDiv = document.getElementById('resultadoPromedioFechasEspecificas');
    const diaSemanaSelect = document.getElementById('diaSemanaSelect');
    const btnPromedioDiaSemana = document.getElementById('btnPromedioDiaSemana');
    const resultadoPromedioDiaSemanaDiv = document.getElementById('resultadoPromedioDiaSemana');

    let mediciones = []; // Array to hold measurements

    // 2. Data Storage (localStorage)
    function loadMeasurements() {
        const medicionesGuardadas = localStorage.getItem('medicionesGlucosa');
        if (medicionesGuardadas) {
            mediciones = JSON.parse(medicionesGuardadas);
        } else {
            mediciones = [];
        }
    }

    function saveMeasurements() {
        localStorage.setItem('medicionesGlucosa', JSON.stringify(mediciones));
    }

    // Helper to format date to DD/MM/YYYY
    function formatDisplayDate(dateString) {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }

    // 4. Displaying History (renderHistorial)
    function renderHistorial() {
        historialTablaBody.innerHTML = ''; // Clear existing rows

        if (mediciones.length === 0) {
            const row = historialTablaBody.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 5;
            cell.textContent = 'No hay mediciones registradas.';
            cell.style.textAlign = 'center';
            return;
        }

        mediciones.forEach(med => {
            const row = historialTablaBody.insertRow();

            row.insertCell().textContent = formatDisplayDate(med.fecha);
            row.insertCell().textContent = med.hora;
            row.insertCell().textContent = med.valor;
            row.insertCell().textContent = med.observaciones;

            const accionesCell = row.insertCell();
            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.classList.add('btn-eliminar'); // For styling if needed
            btnEliminar.dataset.id = med.id; // Store ID for deletion
            btnEliminar.addEventListener('click', () => {
                eliminarMedicion(med.id);
            });
            accionesCell.appendChild(btnEliminar);
        });
    }

    // Delete Functionality
    function eliminarMedicion(id) {
        mediciones = mediciones.filter(med => med.id !== id);
        saveMeasurements();
        renderHistorial();
    }

    // 3. Adding New Measurements
    btnAgregar.addEventListener('click', () => {
        const fecha = fechaInput.value;
        const hora = horaInput.value;
        const valorGlucosa = valorGlucosaInput.value.trim();
        const observaciones = observacionesInput.value.trim();

        // Validation
        if (!fecha) {
            alert('Por favor, ingrese la fecha.');
            fechaInput.focus();
            return;
        }
        if (!hora) {
            alert('Por favor, ingrese la hora.');
            horaInput.focus();
            return;
        }
        if (!valorGlucosa) {
            alert('Por favor, ingrese el valor de glucosa.');
            valorGlucosaInput.focus();
            return;
        }
        const valorNumerico = parseFloat(valorGlucosa);
        if (isNaN(valorNumerico) || valorNumerico <= 0) {
            alert('Por favor, ingrese un valor de glucosa válido y positivo.');
            valorGlucosaInput.focus();
            return;
        }

        const nuevaMedicion = {
            id: Date.now(), // Unique ID
            fecha: fecha,
            hora: hora,
            valor: valorNumerico,
            observaciones: observaciones
        };

        mediciones.push(nuevaMedicion);
        mediciones.sort((a, b) => new Date(b.fecha + 'T' + b.hora) - new Date(a.fecha + 'T' + a.hora)); // Sort by date and time, newest first
        saveMeasurements();
        renderHistorial();

        // Clear input fields
        fechaInput.value = '';
        horaInput.value = '';
        valorGlucosaInput.value = '';
        observacionesInput.value = '';
    });

    // 5. Calculating Averages

    // Helper function to parse "YYYY-MM-DD" string to a Date object (ignoring time for date comparisons)
    function parseDate(dateString) {
        if (!dateString) return null;
        const [year, month, day] = dateString.split('-');
        return new Date(year, month - 1, day); // Month is 0-indexed
    }

    // More flexible function to display results
    function mostrarResultado(divElement, medicionesFiltradas, tipoPromedioStr) {
        if (medicionesFiltradas.length === 0) {
            divElement.textContent = `No hay mediciones para ${tipoPromedioStr}.`;
            return;
        }

        const sumaValores = medicionesFiltradas.reduce((sum, med) => sum + med.valor, 0);
        const promedio = sumaValores / medicionesFiltradas.length;
        divElement.textContent = `Promedio (${tipoPromedioStr}): ${promedio.toFixed(2)} mg/dL (${medicionesFiltradas.length} mediciones).`;
    }

    // Function to use the old div for existing average functions
    function calcularYMostrarPromedio(medicionesFiltradas, tipoPromedioStr = "el período seleccionado") {
        if (medicionesFiltradas.length === 0) {
            resultadoPromedioDiv.textContent = `No hay mediciones en ${tipoPromedioStr}.`;
            return;
        }

        const sumaValores = medicionesFiltradas.reduce((sum, med) => sum + med.valor, 0);
        const promedio = sumaValores / medicionesFiltradas.length;
        resultadoPromedioDiv.textContent = `Promedio: ${promedio.toFixed(2)} mg/dL (${medicionesFiltradas.length} mediciones)`;
    }


    // New function for specific dates average
    function calcularPromedioFechasEspecificas() {
        const fechasStr = fechasEspecificasInput.value.trim();
        if (!fechasStr) {
            alert('Por favor, ingrese las fechas específicas.');
            resultadoPromedioFechasEspecificasDiv.textContent = 'Ingrese fechas para calcular el promedio.';
            return;
        }

        const fechasArray = fechasStr.split(',').map(f => f.trim());
        const fechasValidas = [];
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

        for (const fecha of fechasArray) {
            if (!dateRegex.test(fecha)) {
                alert(`Formato de fecha incorrecto: "${fecha}". Use YYYY-MM-DD.`);
                resultadoPromedioFechasEspecificasDiv.textContent = `Formato de fecha incorrecto: "${fecha}".`;
                return;
            }
            // Basic validation for date parts (does not check for valid day in month e.g. 2023-02-30)
            const [year, month, day] = fecha.split('-').map(Number);
            if (month < 1 || month > 12 || day < 1 || day > 31) {
                 alert(`Fecha inválida: "${fecha}". Verifique mes y día.`);
                 resultadoPromedioFechasEspecificasDiv.textContent = `Fecha inválida: "${fecha}".`;
                 return;
            }
            fechasValidas.push(fecha);
        }

        const medicionesFiltradas = mediciones.filter(med => fechasValidas.includes(med.fecha));
        mostrarResultado(resultadoPromedioFechasEspecificasDiv, medicionesFiltradas, "fechas específicas");
    }

    // New function for specific day of the week average
    function calcularPromedioDiaSemanaEspecifico() {
        const diaSeleccionado = parseInt(diaSemanaSelect.value, 10); // 0 for Sunday, 1 for Monday...

        const medicionesFiltradas = mediciones.filter(med => {
            const fechaMedicion = parseDate(med.fecha); // YYYY-MM-DD string to Date object
            return fechaMedicion && fechaMedicion.getDay() === diaSeleccionado;
        });

        const nombreDia = diaSemanaSelect.options[diaSemanaSelect.selectedIndex].text;
        mostrarResultado(resultadoPromedioDiaSemanaDiv, medicionesFiltradas, `los ${nombreDia}`);
    }


    btnPromedioRango.addEventListener('click', () => {
        const fechaInicioStr = fechaInicioPromedioInput.value;
        const fechaFinStr = fechaFinPromedioInput.value;

        if (!fechaInicioStr || !fechaFinStr) {
            alert('Por favor, seleccione ambas fechas para el rango.');
            return;
        }

        const fechaInicio = parseDate(fechaInicioStr);
        const fechaFin = parseDate(fechaFinStr);

        if (fechaInicio > fechaFin) {
            alert('La fecha de inicio no puede ser posterior a la fecha de fin.');
            return;
        }
        // Set time to end of day for fechaFin to make it inclusive
        fechaFin.setHours(23, 59, 59, 999);


        const medicionesEnRango = mediciones.filter(med => {
            const fechaMedicion = parseDate(med.fecha);
            return fechaMedicion >= fechaInicio && fechaMedicion <= fechaFin;
        });

        calcularYMostrarPromedio(medicionesEnRango, "el rango especificado");
    });

    btnPromedioUltimaSemana.addEventListener('click', () => {
        const hoy = new Date();
        const haceUnaSemana = new Date();
        haceUnaSemana.setDate(hoy.getDate() - 7);
        // Reset time part for comparison
        haceUnaSemana.setHours(0,0,0,0);
        hoy.setHours(23,59,59,999);


        const medicionesUltimaSemana = mediciones.filter(med => {
            const fechaMedicion = parseDate(med.fecha); // Use parseDate to compare only dates
            return fechaMedicion >= haceUnaSemana && fechaMedicion <= hoy;
        });
        calcularYMostrarPromedio(medicionesUltimaSemana, "la última semana");
    });

    btnPromedioUltimasDosSemanas.addEventListener('click', () => {
        const hoy = new Date();
        const haceDosSemanas = new Date();
        haceDosSemanas.setDate(hoy.getDate() - 14);
        // Reset time part for comparison
        haceDosSemanas.setHours(0,0,0,0);
        hoy.setHours(23,59,59,999);

        const medicionesUltimasDosSemanas = mediciones.filter(med => {
            const fechaMedicion = parseDate(med.fecha); // Use parseDate to compare only dates
            return fechaMedicion >= haceDosSemanas && fechaMedicion <= hoy;
        });
        calcularYMostrarPromedio(medicionesUltimasDosSemanas, "las últimas dos semanas");
    });

    // Add event listeners for new buttons
    btnPromedioFechasEspecificas.addEventListener('click', calcularPromedioFechasEspecificas);
    btnPromedioDiaSemana.addEventListener('click', calcularPromedioDiaSemanaEspecifico);


    // 6. Initial Setup
    loadMeasurements();
    mediciones.sort((a, b) => new Date(b.fecha + 'T' + b.hora) - new Date(a.fecha + 'T' + a.hora)); // Sort on load
    renderHistorial();
});
