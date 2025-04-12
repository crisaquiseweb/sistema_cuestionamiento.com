from flask import Flask, render_template, request, jsonify
import socket
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'clave_secreta'  # ¡Cambia esto en una aplicación real!

usuarios_conectados = set()
publicaciones = []

def get_local_ip():
    """Intenta obtener la dirección IP local del servidor."""
    try:
        hostname = socket.gethostname()
        local_ip = socket.gethostbyname(hostname)
        return local_ip
    except socket.gaierror:
        return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/usuarios_conectados')
def obtener_usuarios_conectados():
    client_ip = request.remote_addr
    if client_ip not in usuarios_conectados:
        usuarios_conectados.add(client_ip)
    return jsonify(list(usuarios_conectados))

@app.route('/api/publicar', methods=['POST'])
def publicar_mensaje():
    if request.method == 'POST':
        mensaje = request.form.get('mensaje')
        autor_ip = request.remote_addr
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        if mensaje:
            publicaciones.append({'autor': autor_ip, 'mensaje': mensaje, 'timestamp': timestamp})
            return jsonify({'message': 'Publicación exitosa'}), 201
        else:
            return jsonify({'error': 'El mensaje no puede estar vacío'}), 400
    return jsonify({'error': 'Método no permitido'}), 405

@app.route('/api/obtener_publicaciones')
def obtener_publicaciones():
    return jsonify(publicaciones)

@app.route('/api/logout')
def logout():
    client_ip = request.remote_addr
    if client_ip in usuarios_conectados:
        usuarios_conectados.remove(client_ip)
    return jsonify({'message': 'Sesión cerrada'})

if __name__ == '__main__':
    print(f"Servidor corriendo en la IP local: {get_local_ip()} en el puerto 5000")
    app.run(debug=True, host='0.0.0.0')