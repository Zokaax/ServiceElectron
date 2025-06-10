function submitForm({
    submitButtonId,
    formId,
    postUrl,
    onSuccess,
    onError,
    processForm
}) {
    const submitButton = document.getElementById(submitButtonId);
    const form = document.getElementById(formId);

    if (!submitButton || !form) {
        console.error(`No se contro el botón con ID '${submitButtonId}' o el formulario con ID '${formId}'.`);
        return;
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(form);
        let jsonForm = Object.fromEntries(formData.entries());
        console.log(jsonForm)

        if (processForm) {
            jsonForm = processForm(form);
        }

        fetchPost({
            url: postUrl,
            form,
            json: jsonForm,
            onSuccess,
            onError
        });
    });
};


function updateElement(elementId, getUrl, onSuccess, onError) {
    const listElement = document.getElementById(elementId);

    if (!listElement) {
        console.error(`No se encontró el elemento con ID '${elementId}'.`);
        return;
    }

    fetchGet(getUrl, data => {
        onSuccess(data.data, listElement)
    }, (error, listElement) => onError(error, listElement));
}


async function fetchPost({
    url,
    form,
    json,
    onSuccess,
    onError
}) {
    return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json),
        })
        .then(response => response.json())
        .then(data => {
            onSuccess(data, form);
        })
        .catch(error => {
            onError(error);
        });
}

function fetchGet(url, funcionok, funcionerr) {
    fetch(url, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            return funcionok(data);
        })
        .catch(error => {
            funcionerr(error);
        });
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function setCurrentDate() {
    const fechaElemento = document.getElementById('currentDate');
    const ahora = new Date();
    const opciones = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    const fechaFormateada = ahora.toLocaleDateString('es-VE', opciones); // 'es-VE' para formato venezolano
    fechaElemento.textContent = fechaFormateada;
}
// setCurrentDate();