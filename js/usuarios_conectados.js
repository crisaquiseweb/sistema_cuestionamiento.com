document.addEventListener('DOMContentLoaded', function() {
    const usuariosTableBody = document.getElementById('usuarios-table').getElementsByTagName('tbody')[0];
    const resetButton = document.getElementById('reset-records');
    const connectionLogKey = 'userConnectionLog';

    function cargarUsuariosConectados() {
        let connectionLog = [];
        const storedLog = localStorage.getItem(connectionLogKey);

        if (storedLog) {
            try {
                connectionLog = JSON.parse(storedLog);
            } catch (error) {
                console.error("Error al analizar el log de conexiones desde localStorage:", error);
                connectionLog = []; // Si hay un error al parsear, se usa un array vacío
            }
        }

        console.log("Log de conexiones desde localStorage:", connectionLog); // Para depuración

        // Limpiar la tabla
        usuariosTableBody.innerHTML = '';

        if (Array.isArray(connectionLog) && connectionLog.length > 0) {
            connectionLog.forEach(logEntry => {
                const row = usuariosTableBody.insertRow();

                // Nombre de Usuario
                const nombreCell = row.insertCell();
                nombreCell.textContent = logEntry.username;

                // Tiempo de Conexión
                const tiempoCell = row.insertCell();
                const loginTime = new Date(logEntry.loginTime);
                tiempoCell.textContent = loginTime.toLocaleString();

                // Las siguientes columnas las dejamos vacías por ahora para simplificar
                row.insertCell().textContent = 'Desconocido'; // Navegador
                row.insertCell().textContent = 'Desconocido'; // IP
                row.insertCell().textContent = '●'; // Estado
                row.insertCell(); // Avatar (dejamos la celda vacía)
            });
        } else {
            // Si no hay usuarios conectados, mostrar un mensaje
            const row = usuariosTableBody.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 6; // O el número total de columnas
            cell.textContent = 'No hay usuarios conectados (registrados en este navegador).';
            cell.style.textAlign = 'center';
        }
    }

    // Cargar los usuarios conectados al cargar la página
    cargarUsuariosConectados();

    // Opcional: Actualizar la lista periódicamente
    setInterval(cargarUsuariosConectados, 5000);

    // Lógica para el botón de reiniciar registros
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            if (confirm('¿Estás seguro de que quieres reiniciar los registros de usuarios conectados (solo para este navegador)?')) {
                localStorage.removeItem(connectionLogKey);
                usuariosTableBody.innerHTML = ''; // Limpiar la tabla
                cargarUsuariosConectados(); // Volver a cargar (estará vacía)
            }
        });
    }
});