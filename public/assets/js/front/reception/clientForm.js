submitForm({
    submitButtonId: 'submitAddClient',
    formId: 'addClientForm',
    postUrl: '/api/clients',
    onSuccess: (data, form) => {
        if (data.success) {
            form.reset();
            alert('el cliente se ha agregado exitosamente');
        } else {
            console.log(data)
            alert(`No se ha realizado la operacion: ${data.message}`);
        }
    },
    onError: (error) => {
        console.log(error)
        alert('No se ha podido encontrar al servidor');
    }
});