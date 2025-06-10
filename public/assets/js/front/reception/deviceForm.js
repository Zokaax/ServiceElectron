submitForm({
    submitButtonId: 'submitAddDevice',
    formId: 'addDeviceForm',
    postUrl: '/api/devices',
    onSuccess: (data, form) => {
        if (data.success) {
            form.reset();
            alert('el dispositivo se ha agregado exitosamente');
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