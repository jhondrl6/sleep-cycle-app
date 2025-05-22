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

    function calcularYMostrarPromedio(medicionesFiltradas) {
        if (medicionesFiltradas.length === 0) {
            resultadoPromedioDiv.textContent = 'No hay mediciones en el período seleccionado.';
            return;
        }

        const sumaValores = medicionesFiltradas.reduce((sum, med) => sum + med.valor, 0);
        const promedio = sumaValores / medicionesFiltradas.length;
        resultadoPromedioDiv.textContent = `Promedio: ${promedio.toFixed(2)} mg/dL (${medicionesFiltradas.length} mediciones)`;
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

        calcularYMostrarPromedio(medicionesEnRango);
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
        calcularYMostrarPromedio(medicionesUltimaSemana);
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
        calcularYMostrarPromedio(medicionesUltimasDosSemanas);
    });


    // 6. Initial Setup
    loadMeasurements();
    mediciones.sort((a, b) => new Date(b.fecha + 'T' + b.hora) - new Date(a.fecha + 'T' + a.hora)); // Sort on load
    renderHistorial();
});
