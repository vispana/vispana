export default class VispanaApiClient {
    async fetchVespaState(configHost) {
        const options = {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
            }
        };

        return fetch(`/api/overview?config_host=${configHost}/`, options)
            .then(response => response.json())
    }

    async postQuery(containerHost, query, offset, limit) {
        // add offset and limit to the query
        query.offset = offset
        query.hits = limit

        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(query)
        };

        return fetch(`/api/query?container_host=${containerHost}`, options)
            .then(response => response.json())
    }
}
