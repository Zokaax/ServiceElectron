submitForm({
    submitButtonId: 'submitAddPayment',
    formId: 'addPaymentForm',
    postUrl: 'api/payments',
    onSuccess: (data, form) => {
        if (data.success) {
            form.reset();
            // document.getElementById('ReceptionSaintOrder').focus()
            alert('el pago se ha agregado exitosamente');
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
        const receptionInput = document.getElementById('paymentReceptionSearch');
        jsonForm.receptionId = Number(receptionInput.dataset.id);
        receptionInput.dataset.id = undefined;
        return jsonForm;
    }
});

searchBar({
    listUrl: ['api/receptions/like?saintOrder', 'api/receptions/like?status'],
    input: 'paymentReceptionSearch',
    container: 'searchReceptionsResults',
    configContent: (result, item) => {

        item.textContent = `Pedido:${result.saintOrder} / ${result.status} / ${result.client.name || ""}`
        // item.dataset.id = result.id
    },
    noContent: (resultContainer) => {
        const noResultsItem = document.createElement('span');
        noResultsItem.classList.add('list-group-item', 'disabled');
        noResultsItem.textContent = 'No se encontraron recepciones.';
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