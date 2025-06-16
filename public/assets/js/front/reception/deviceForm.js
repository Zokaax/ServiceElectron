submitForm({
    submitButtonId: 'submitAddDevice',
    formId: 'addDeviceForm',
    postUrl: 'api/devices',
    onSuccess: (data, form) => {
        if (data.success) {
            form.reset();
            console.log('el dispositivo se ha agregado exitosamente');
        } else {
            console.log(data)
            console.log(`No se ha realizado la operacion: ${data.message}`);
        }
    },
    onError: (error) => {
        console.log(error)
        console.log('No se ha podido encontrar al servidor');
    }
});