document.addEventListener('DOMContentLoaded', function() {

    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const filterByDateEndSwitch = document.getElementById('filterByDateEnd');
    const generateReportBtn = document.getElementById('generateReportBtn');
    const saveReceptionChangesPDFBtn = document.getElementById('generateReportPDFBtn');
    const reportsOutput = document.getElementById('reportsOutput');
    //modal
    const receptionDetailModal = new bootstrap.Modal(document.getElementById('receptionDetailModal'));
    const modalReceptionId = document.getElementById('modalReceptionId');
    const modalSaintOrder = document.getElementById('modalSaintOrder');
    const modalSaintInvoice = document.getElementById('modalSaintInvoice');
    const modalDateStart = document.getElementById('modalDateStart');
    const modalDateEnd = document.getElementById('modalDateEnd');
    const modalClientName = document.getElementById('modalClientName');
    const modalDevice = document.getElementById('modalDevice');
    const modalClientIssue = document.getElementById('modalClientIssue');
    const modalWorkDone = document.getElementById('modalWorkDone');
    const modalReceptionAmoutDolars = document.getElementById('modalReceptionAmoutDolars');
    const modalStatus = document.getElementById('modalStatus');
    const saveReceptionChangesBtn = document.getElementById('saveReceptionChanges');

    // Establece las fechas predeterminadas al mes actual
    function setDefaultDates() {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        startDateInput.value = formatDate(firstDayOfMonth);
        endDateInput.value = formatDate(lastDayOfMonth);
    }

    // Obtiene la clase CSS para el color del estado
    function getStatusClass(status) {
        switch (status) {
            case 'EN PROCESO':
                return 'status-EN-PROCESO';
            case 'COBRADO':
                return 'status-COBRADO';
            case 'PENDIENTE':
                return 'status-PENDIENTE';
            case 'PAGADO':
                return 'status-PAGADO';
            case 'DEVOLUCION':
                return 'status-DEVOLUCION';
            case 'GARANTIA':
                return 'status-GARANTIA';
            case 'CRUCE':
                return 'status-CRUCE';
            case 'ELIMINADA':
                return 'status-ELIMINADA';
            default:
                return 'status-OTRO';
        }
    }

    // --- Lógica de Filtrado y Renderizado ---

    async function filterReceptions() {

        const start = startDateInput.value;
        const end = endDateInput.value;
        const done = filterByDateEndSwitch.checked;

        const receptions = await fetch(`api/receptions/date?dateStart=${start}&dateEnd=${end}&dateField=${done ? 'dateEnd':'dateStart'}`)
            .then(response => response.json())
            .then(json => json.data)
            .catch(error => console.log(error)) || []


        const groupedReceptions = receptions.reduce((acc, recepcion) => {
            const status = recepcion.status || 'OTRO';
            if (!acc[status]) {
                acc[status] = [];
            }
            acc[status].push(recepcion);
            return acc;
        }, {});

        renderReceptions(groupedReceptions, receptions);
    }



    function renderReceptions(groupedReceptions, receptions) {
        reportsOutput.innerHTML = ''; // Limpiar el contenido anterior

        const sortedStatuses = Object.keys(groupedReceptions).sort();

        // small, recepciones encontradas
        const totalElement = document.getElementById('totalReceptions');
        totalElement.textContent = `Total: ${receptions.length}`;

        if (sortedStatuses.length === 0) {
            reportsOutput.innerHTML = `
                    <div class="text-center text-muted p-5">
                        <p>No se encontraron recepciones para el rango de fechas y filtros seleccionados.</p>
                    </div>
                `;
            return;
        }

        sortedStatuses.forEach(status => {
            const statusGroupDiv = document.createElement('div');
            statusGroupDiv.className = 'card mb-4 status-group';
            statusGroupDiv.innerHTML = `
                    <div class="status-header ${getStatusClass(status)}">
                        <h5 class="mb-0 text-gray-900">${status} (${groupedReceptions[status].length})</h5>
                    </div>
                    <div class="list-group list-group-flush">
                        </div>
                `;
            const listGroup = statusGroupDiv.querySelector('.list-group');

            groupedReceptions[status].forEach(recepcion => {
                const receptionItemHtml = `
                        <button type="button" class="list-group-item list-group-item-action recepcion-item-card ${getStatusClass(recepcion.status)}" data-recepcion-id="${recepcion.id}">
                            <div class="d-flex w-100 justify-content-between">
                                <h6 class="mb-1">Pedido: ${recepcion.saintOrder} ${(recepcion.payments && recepcion.payments.length > 0) ? '/ Factura: ' + recepcion.payments[0].saintInvoice.toString() : ''}</h6>
                                <small class="text-muted">${recepcion.amoutDolar || 0}$</small>
                            </div>
                            <p class="mb-1">Cliente: ${recepcion.client.name} | Dispositivo: ${recepcion.device.type} ${recepcion.device.brand} ${recepcion.device.model}</p>
                            <small>Inicio: ${recepcion.dateStart || 'N/A'} | Cierre: ${recepcion.dateEnd || 'N/A'}</small>
                        </button>
                    `;
                listGroup.insertAdjacentHTML('beforeend', receptionItemHtml);
            });



            reportsOutput.appendChild(statusGroupDiv);
        });


        // Añadir event listeners a los nuevos elementos clickeables
        document.querySelectorAll('.recepcion-item-card').forEach(button => {
            button.addEventListener('click', function() {
                const receptionId = parseInt(this.dataset.recepcionId);
                const selectedReception = receptions.find(r => r.id === receptionId);
                if (selectedReception) {
                    openReceptionModal(selectedReception);
                }
            });
        });


    }

    function openReceptionModal(reception) {
        modalReceptionId.value = reception.id;
        modalSaintOrder.value = reception.saintOrder;
        modalDateStart.value = reception.dateStart;
        modalDateEnd.value = reception.dateEnd;
        modalClientName.value = reception.client.name;
        modalDevice.value = `${reception.device.type} ${reception.device.brand} ${reception.device.model}`;
        modalClientIssue.value = reception.clientIssue;
        modalWorkDone.value = reception.workDone;
        modalReceptionAmoutDolars.value = reception.amoutDolar;
        modalStatus.value = reception.status;

        modalSaintInvoice.value = (reception.payments && reception.payments.length > 0) ? reception.payments[0].saintInvoice : '';


        receptionDetailModal.show();
    }

    saveReceptionChangesBtn.addEventListener('click', async () => {
        const id = parseInt(modalReceptionId.value);
        const updatedReception = {
            dateStart: modalDateStart.value,
            dateEnd: modalDateEnd.value || undefined,
            clientIssue: modalClientIssue.value,
            workDone: modalWorkDone.value,
            amoutDolar: modalReceptionAmoutDolars.value,
            status: modalStatus.value
        };


        await fetch('/api/receptions/' + id, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedReception)
            })
            .then(response => response.json())
            .then(data => {
                filterReceptions();
                receptionDetailModal.hide();
            })
            .catch(error => console.error('Error al actualizar:', error));

        filterReceptions();
        receptionDetailModal.hide();
    });

    function generatePDFReport() {
        alert('TO DO, convertir reportes en PDF')
        //TODO convertir en pdf groupedReceptions
    }
    saveReceptionChangesPDFBtn.addEventListener('click', generatePDFReport);

    setDefaultDates();
    generateReportBtn.addEventListener('click', filterReceptions);
    filterReceptions();
});