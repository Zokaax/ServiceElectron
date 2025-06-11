submitForm({
    submitButtonId: 'submitAddReception',
    formId: 'addReceptionForm',
    postUrl: 'api/receptions',
    onSuccess: (data, form) => {
        if (data.success) {
            form.reset();
            document.getElementById('receptionSaintOrder').focus()
            alert('la recepcion se ha agregado exitosamente');
        } else {
            console.log(data)
            alert(`No se ha realizado la operacion: ${data.message}`);
        }
    },
    onError: (error) => {
        console.log(error)
        alert('No se ha podido encontrar al servidor');
    },
    processForm: (form) => {
        const formData = new FormData(form);
        const jsonForm = Object.fromEntries(formData.entries());
        const clientInput = document.getElementById('receptionClientSearch');
        const deviceInput = document.getElementById('receptionDeviceSearch');
        jsonForm.clientId = Number(clientInput.dataset.id);
        jsonForm.deviceId = Number(deviceInput.dataset.id);
        deviceInput.dataset.id = undefined;
        clientInput.dataset.id = undefined;

        const deviceDetails = [];
        document.querySelectorAll('.reception-device-description-input').forEach(input => {
            if (input.value.trim() !== '') { // Solo añade descripciones no vacías
                deviceDetails.push(input.value.trim());
            }
        });

        jsonForm.deviceDescription = deviceDetails

        console.log(jsonForm)

        return jsonForm;
    }
});

searchBar({
    listUrl: ['api/devices/like?type', 'api/devices/like?brand', 'api/devices/like?model'],
    input: 'receptionDeviceSearch',
    container: 'searchDeviceResults',
    configContent: (result, item) => {
        item.textContent = `${result.type} ${result.brand} ${result.model}`
    },
    noContent: (resultContainer) => {
        const noResultsItem = document.createElement('span');
        noResultsItem.classList.add('list-group-item', 'disabled');
        noResultsItem.textContent = 'No se encontraron equipos.';
        resultContainer.appendChild(noResultsItem);
        resultContainer.style.display = 'block';
    },
    errorRequest: (error) => {
        if (!error.errorCode == '404') {
            console.log(error, 'element not found')
        } else if (!error.errorCode == '500') {
            console.log(error, 'ha habido un problema con la base de datos')
        }
    }
})

searchBar({
    listUrl: ['api/clients/like?name'],
    input: 'receptionClientSearch',
    container: 'searchClientsResults',
    configContent: (result, item) => {
        item.textContent = `Cliente: ${result.name}`
        // item.dataset.id = result.id
    },
    noContent: (resultContainer) => {
        const noResultsItem = document.createElement('span');
        noResultsItem.classList.add('list-group-item', 'disabled');
        noResultsItem.textContent = 'No se encontraron clientes.';
        resultContainer.appendChild(noResultsItem);
        resultContainer.style.display = 'block';
    },
    errorRequest: (error) => {
        if (!error.errorCode == '404') {
            console.log(error, 'element not found')
        } else if (!error.errorCode == '500') {
            console.log(error, 'ha habido un problema con la base de datos')
        }
    }
})

document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('receptionDateStart');
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses en JS son de 0 a 11
    const day = String(today.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;
    dateInput.value = currentDate;





    const deviceDescriptionContainer = document.getElementById('deviceDescriptionContainer');

    const addReceptionDescriptionFieldButton = document.getElementById('addReceptionDescriptionField');

    const addReceptionDescriptionField = () => {
        const div = document.createElement('div');
        div.className = 'input-group mb-2'; // Clases de Bootstrap para estilo
        div.innerHTML = `
            <input type="text" class="form-control reception-device-description-input" placeholder="Ingrese otro detalle o nota del dispositivo">
            <button class="btn btn-outline-danger remove-reception-description" type="button"><i class="fas fa-times"></i></button>
        `;
        deviceDescriptionContainer.appendChild(div);

        // Ya no necesitamos añadir el listener aquí para cada botón,
        // la delegación de eventos lo manejará.
    };

    addReceptionDescriptionFieldButton.addEventListener('click', addReceptionDescriptionField);

    deviceDescriptionContainer.addEventListener('click', (e) => {
        // Asegúrate de que el clic fue en el botón de remover o en su ícono
        if (e.target.classList.contains('remove-reception-description') || e.target.closest('.remove-reception-description')) {
            // Aseguramos que no se elimine el único campo si es que queda solo uno
            if (deviceDescriptionContainer.querySelectorAll('.input-group').length > 1) {
                e.target.closest('.input-group').remove();
            } else {
                alert('Debe haber al menos un detalle de dispositivo.');
            }
        }
    });
});





















// Asegúrate de que este script se ejecute después de que el DOM esté cargado
// document.addEventListener('DOMContentLoaded', () => {
//     const addReceptionForm = document.getElementById('addReceptionForm');
//     const receptionDateStartInput = document.getElementById('receptionDateStart');

//     // Inicializar la fecha de registro con la fecha actual
//     const today = new Date();
//     const day = String(today.getDate()).padStart(2, '0');
//     const month = String(today.getMonth() + 1).padStart(2, '0'); // Enero es 0!
//     const year = today.getFullYear();
//     receptionDateStartInput.value = `${year}-${month}-${day}`;


// Función para añadir un nuevo campo de descripción del dispositivo


// Event listener para el botón "Añadir otro detalle"

// Delegación de eventos para remover campos de descripción



// Event listener para el formulario de envío
// addReceptionForm.addEventListener('submit', async (e) => {
//     e.preventDefault(); // Evita el envío predeterminado del formulario

//     // Recopilar los datos del formulario
//     const receptionSaintOrder = document.getElementById('receptionSaintOrder').value;
//     const receptionDateStart = document.getElementById('receptionDateStart').value;
//     const receptionAmoutDolars = document.getElementById('receptionAmoutDolars').value;
//     const receptionClientSearch = document.getElementById('receptionClientSearch').value; // Aquí iría el ID real del cliente
//     const receptionDeviceSearch = document.getElementById('receptionDeviceSearch').value; // Aquí iría el ID real del dispositivo
//     const receptionStatus = document.getElementById('receptionStatus').value;
//     const receptionClientIssue = document.getElementById('receptionClientIssue').value;
//     const receptionWorkDone = document.getElementById('receptionWorkDone').value;


// Recopilar todos los detalles/descripciones del dispositivo


//         const receptionData = {
//             saintOrder: receptionSaintOrder,
//             dateStart: receptionDateStart,
//             amoutDolar: parseFloat(receptionAmoutDolars), // Convertir a número
//             // Estos son IDs o referencias que tendrías que obtener de tus búsquedas
//             // Por ahora, usamos los valores de texto del input
//             clientId: receptionClientSearch, // Esto debería ser el ID del cliente seleccionado
//             deviceId: receptionDeviceSearch, // Esto debería ser el ID del dispositivo seleccionado
//             status: receptionStatus,
//             clientIssue: receptionClientIssue,
//             workDone: receptionWorkDone,
//             // Aquí es donde guardamos el array de descripciones del dispositivo
//             deviceDescription: deviceDetails
//         };

//         console.log('Datos de la recepción a enviar:', receptionData);

//         // --- Aquí es donde harías la llamada a tu API de Supabase ---
//         // (Asumiendo que tienes configurado window.api.post para interactuar con tu proceso principal)

//         try {
//             const response = await window.api.post('http://localhost:3000/api/receptions', receptionData);

//             if (response && !response.error) {
//                 console.log('Recepción registrada con éxito:', response);
//                 alert('¡Recepción registrada con éxito!');
//                 addReceptionForm.reset(); // Limpia el formulario
//                 // Limpiar campos de descripción y dejar solo uno vacío
//                 deviceDescriptionContainer.innerHTML = `
//                     <div class="input-group mb-2">
//                         <input type="text" class="form-control reception-device-description-input" placeholder="Ingrese un detalle o nota del dispositivo">
//                         <button class="btn btn-outline-danger remove-reception-description" type="button"><i class="fas fa-times"></i></button>
//                     </div>
//                 `;
//             } else {
//                 console.error('Error al registrar recepción:', response.message || 'Error desconocido');
//                 alert('Error al registrar recepción: ' + (response.message || 'Error desconocido'));
//             }
//         } catch (error) {
//             console.error('Error en la llamada a la API:', error);
//             alert('Ocurrió un error al intentar registrar la recepción.');
//         }
//     });
// });