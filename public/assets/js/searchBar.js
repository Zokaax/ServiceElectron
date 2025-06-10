function searchBar({
    listUrl,
    input,
    container,
    min = 3,
    delay = 300,
    configContent,
    noContent,
    errorRequest
}) {

    const searchInput = document.getElementById(input);
    const resultContainer = document.getElementById(container);

    searchInput.addEventListener('input', debounce(async (event) => {
        const searchTerm = event.target.value;
        if (searchTerm.length >= min) {
            const results = await fetchSearch(listUrl, searchTerm);
            displayResults(results);
        } else {
            resultContainer.innerHTML = '';
            resultContainer.style.display = 'none';
            searchInput.dataset.selectedDeviceId = '';
        }
    }, delay));


    function displayResults(results) {
        resultContainer.innerHTML = '';
        if (results.data && results.data.length > 0) {

            results.data.forEach(result => {
                const listItem = document.createElement('span');
                listItem.classList.add('list-group-item', 'list-group-item-action');
                listItem.dataset.id = result.id ///

                configContent(result, listItem)

                listItem.addEventListener('click', () => {
                    searchInput.value = listItem.textContent;
                    resultContainer.style.display = 'none';
                    searchInput.dataset.id = listItem.dataset.id;
                    searchInput.focus();
                });
                resultContainer.appendChild(listItem);
            });
            resultContainer.style.display = 'block';
        } else {
            noContent(resultContainer)
        }
    }


    // Ocultar los resultados cuando se pierde el foco del input
    searchInput.addEventListener('blur', () => {
        setTimeout(() => { // Pequeño delay para permitir clics en los resultados
            resultContainer.style.display = 'none';
        }, 200);
    });

    // Mostrar los resultados al enfocar el input (si ya hay texto)
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.length >= 3 && resultContainer.children.length > 0) {
            resultContainer.style.display = 'block';
        }
    });

    async function fetchSearch(urls, searchTerm) {
        try {
            if (!Array.isArray(urls)) {
                const response = await fetch(`${urls}=${searchTerm}`);
                const data = await response.json();
                return data
            }

            let allResults = [];

            const promises = urls.map(async (url) => {
                const response = await fetch(`${url}=${searchTerm}`)
                const msg = await response.json()
                if (msg.success && msg.data) {
                    allResults = allResults.concat(msg.data);
                }
                return msg
            })

            return {
                data: await Promise.allSettled(promises)
                    .then(() => {
                        const idChecked = new Set();
                        const selected = allResults.filter(obj => {
                            if (!idChecked.has(obj.id)) {
                                idChecked.add(obj.id);
                                return true;
                            }
                            return false;
                        })
                        return selected;
                    }).catch(err => {
                        return []
                    })
            }

        } catch (error) {
            errorRequest(error)
            return [];
        }
    }

    function debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }
}



// searchBar({
//     url: '/api/clients?name',
//     input: 'xuinput',
//     container: 'container',
//     configContent: (result, item) => {
//         item.textContent = `${result.content}`
//     },
//     noContent: (resultContainer) => {
//         const noResultsItem = document.createElement('span');
//         noResultsItem.classList.add('list-group-item', 'disabled');
//         noResultsItem.textContent = 'No se encontraron resultados.';
//         resultContainer.appendChild(noResultsItem);
//         resultContainer.style.display = 'block';
//     }
// })