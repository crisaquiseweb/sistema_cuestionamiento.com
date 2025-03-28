document.addEventListener('DOMContentLoaded', function() {
    const usuariosTableBody = document.querySelector('#usuarios-table tbody');
    const connectionLogKey = 'userConnectionLog';
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const connectionLog = JSON.parse(localStorage.getItem(connectionLogKey) || '[]');
    const recentConnections = connectionLog.filter(logEntry => logEntry.loginTime >= sevenDaysAgo);

    const userConnections = {};
    recentConnections.forEach(connection => {
        if (userConnections[connection.username]) {
            userConnections[connection.username].count++;
            // We could potentially track the last login time here for status
        } else {
            userConnections[connection.username] = { count: 1, lastLogin: connection.loginTime };
        }
    });

    usuariosTableBody.innerHTML = '';
    for (const username in userConnections) {
        const row = usuariosTableBody.insertRow();
        const count = userConnections[username].count;
        const lastLogin = userConnections[username].lastLogin;
        const isActiveThreshold = new Date(Date.now() - 15 * 60 * 1000).toISOString(); // Consider active if logged in last 15 minutes (example)
        const status = lastLogin >= isActiveThreshold ? 'Activo (Aproximado)' : 'Desconectado (Aproximado)';

        row.insertCell().textContent = username;
        row.insertCell().textContent = count;
        row.insertCell().textContent = status;
        // We would calculate duration if we tracked logout times
    }
});