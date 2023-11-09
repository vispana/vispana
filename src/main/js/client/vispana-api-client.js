export default class VispanaApiClient {

	constructor(configHost) {
		if(configHost == null || configHost.trim().length === 0) {
			throw new Error(`Invalid config host: ${configHost}`)
		}
		this.configHost =  configHost;
	}
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
}
