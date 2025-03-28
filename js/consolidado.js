document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registroForm');
    const btnRegistrar = document.getElementById('btnRegistrar');
    const btnExportarExcel = document.getElementById('btnExportarExcel');
    const registrosTableBody = document.querySelector('#registros-table tbody');

    const localStorageKey = 'consolidadoRegistros'; // Clave para guardar en localStorage
    let registros = cargarRegistros(); // Cargar registros desde localStorage
    let editingIndex = -1; // Índice del registro que se está editando

    // Función para cargar los registros desde localStorage
    function cargarRegistros() {
        const storedRegistros = localStorage.getItem(localStorageKey);
        if (storedRegistros) {
            try {
                return JSON.parse(storedRegistros);
            } catch (error) {
                console.error('Error al cargar registros desde localStorage:', error);
                return [];
            }
        }
        return [];
    }

    // Función para guardar los registros en localStorage
    function guardarRegistros() {
        localStorage.setItem(localStorageKey, JSON.stringify(registros));
    }

    // Función para mostrar los registros en la tabla
    function mostrarRegistros() {
        registrosTableBody.innerHTML = '';
        registros.forEach((registro, index) => {
            const row = registrosTableBody.insertRow();
            row.insertCell().textContent = registro.tienda;
            row.insertCell().textContent = registro.imei;
            row.insertCell().textContent = registro.imsi || '';
            row.insertCell().textContent = registro.numero || '';
            row.insertCell().textContent = registro.dni || '';
            row.insertCell().textContent = registro.cliente;
            row.insertCell().textContent = registro.codigo_dibden || '';
            row.insertCell().textContent = registro.ss_sibel || '';
            row.insertCell().textContent = registro.fecha_solicitud || '';

            const accionesCell = row.insertCell();
            accionesCell.classList.add('acciones-columna');

            const eliminarIcon = document.createElement('i');
            eliminarIcon.classList.add('fas', 'fa-trash-alt');
            eliminarIcon.addEventListener('click', () => eliminarRegistro(index));
            accionesCell.appendChild(eliminarIcon);

            const modificarIcon = document.createElement('i');
            modificarIcon.classList.add('fas', 'fa-edit');
            modificarIcon.addEventListener('click', () => cargarRegistroParaModificar(index));
            accionesCell.appendChild(modificarIcon);
        });
    }

    // Función para registrar un nuevo registro
    function registrarRegistro() {
        const tienda = document.getElementById('tienda').value;
        const imei = document.getElementById('imei').value.trim();
        const imsi = document.getElementById('imsi').value.trim();
        const numero = document.getElementById('numero').value.trim();
        const dni = document.getElementById('dni').value.trim();
        const cliente = document.getElementById('cliente').value.trim();
        const codigo_dibden = document.getElementById('codigo_dibden').value.trim();
        const ss_sibel = document.getElementById('ss_sibel').value.trim();
        const fecha_solicitud = document.getElementById('fecha_solicitud').value;

        if (!imei || !cliente) {
            alert('IMEI y Cliente son campos obligatorios.');
            return;
        }

        const imeiExiste = registros.some(registro => registro.imei === imei && editingIndex !== registros.indexOf(registro));
        if (imeiExiste) {
            alert('Ya existe un registro con este IMEI.');
            return;
        }

        const nuevoRegistro = {
            tienda,
            imei,
            imsi,
            numero,
            dni,
            cliente,
            codigo_dibden,
            ss_sibel,
            fecha_solicitud
        };

        if (editingIndex !== -1) {
            registros[editingIndex] = nuevoRegistro;
            editingIndex = -1;
            btnRegistrar.textContent = 'Registrar';
        } else {
            registros.push(nuevoRegistro);
        }

        guardarRegistros(); // Guardar en localStorage después de registrar
        mostrarRegistros();
        form.reset();
    }

    // Función para eliminar un registro
    function eliminarRegistro(index) {
        if (confirm('¿Estás seguro de que quieres eliminar este registro?')) {
            registros.splice(index, 1);
            guardarRegistros(); // Guardar en localStorage después de eliminar
            mostrarRegistros();
        }
    }

    // Función para cargar un registro para modificar
    function cargarRegistroParaModificar(index) {
        const registro = registros[index];
        document.getElementById('tienda').value = registro.tienda;
        document.getElementById('imei').value = registro.imei;
        document.getElementById('imsi').value = registro.imsi || '';
        document.getElementById('numero').value = registro.numero || '';
        document.getElementById('dni').value = registro.dni || '';
        document.getElementById('cliente').value = registro.cliente;
        document.getElementById('codigo_dibden').value = registro.codigo_dibden || '';
        document.getElementById('ss_sibel').value = registro.ss_sibel || '';
        document.getElementById('fecha_solicitud').value = registro.fecha_solicitud || '';

        editingIndex = index;
        btnRegistrar.textContent = 'Guardar Cambios';
    }

    // Simulación de exportar a Excel (generando un archivo HTML)
    btnExportarExcel.addEventListener('click', function() {
        if (registros.length === 0) {
            alert('No hay registros para exportar.');
            return;
        }

        let htmlContent = "<!DOCTYPE html><html><head><title>Consolidado</title></head><body><table><thead><tr>";
        const headers = Object.keys(registros[0]);
        headers.forEach(header => {
            htmlContent += `<th>${header}</th>`;
        });
        htmlContent += "</tr></thead><tbody>";

        registros.forEach(registro => {
            htmlContent += "<tr>";
            Object.values(registro).forEach(value => {
                htmlContent += `<td>${value}</td>`;
            });
            htmlContent += "</tr>";
        });

        htmlContent += "</tbody></table></body></html>";

        const dataUri = 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent);
        const link = document.createElement('a');
        link.setAttribute('href', dataUri);
        link.setAttribute('download', 'consolidado.html');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert('Datos exportados a consolidado.html. Puedes abrir este archivo con Microsoft Excel.');
    });

    btnRegistrar.addEventListener('click', registrarRegistro);

    mostrarRegistros(); // Mostrar los registros cargados al inicio
});