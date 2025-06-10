submitForm({
    submitButtonId: 'submitAddReception',
    formId: 'addReceptionForm',
    postUrl: '/api/receptions',
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
        return jsonForm;
    }
});

searchBar({
    listUrl: ['/api/devices/like?type', '/api/devices/like?brand', '/api/devices/like?model'],
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
    listUrl: ['/api/clients/like?name'],
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
});