function cambiarEstadoDoctor(id, habilitar) {
    const url = `/doctores/estado/${id}`;
    const data = { activo: habilitar ? 1 : 0 };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al actualizar el estado del doctor');
        }
        return response.json();
    })
    .then(data => {
        if (data.message) {
            const row = document.getElementById(`doctor-${id}`);

            // Cambiar el estado visualmente
            if (habilitar) {
                // Remover clases de deshabilitado
                row.classList.remove('table-danger', 'text-decoration-line-through'); 
                row.querySelector('.btn-danger').classList.remove('d-none'); // Mostrar el botón "Deshabilitar"
                row.querySelector('.btn-warning').classList.add('d-none'); // Ocultar el botón "Habilitar"
            } else {
                // Agregar clases de deshabilitado
                row.classList.add('table-danger', 'text-decoration-line-through'); 
                row.querySelector('.btn-danger').classList.add('d-none'); // Ocultar el botón "Deshabilitar"
                row.querySelector('.btn-warning').classList.remove('d-none'); // Mostrar el botón "Habilitar"
            }
        }
    })
    .catch(error => console.error('Error:', error));
}
document.addEventListener('DOMContentLoaded', () => {
    const alerta = document.getElementById('alerta-exito');
    if (alerta) {
        setTimeout(() => {
            alerta.style.display = 'none';
        }, 2000); // 1000 ms = 1 segundo
    }
});



