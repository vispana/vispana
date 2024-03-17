export default class HistoryClient {
    fetchHistory() {
        const items = this.getAllFromLocalStorage();
        return this.sort(items)
    }

    getAllFromLocalStorage() {
        let items = []
        for (let i = 0; i < localStorage.length; i++) {
            // set iteration key name
            const key = localStorage.key(i);
            // use key name to retrieve the corresponding value
            const value = localStorage.getItem(key);
            items.push(JSON.parse(value))
        }
        return items
    }

    sort(array) {
        return array.sort(function (a, b) {
            if (a.timestamp < b.timestamp) {
                return 1;
            }
            if (a.timestamp > b.timestamp) {
                return -1;
            }
            return 0;
        })
    }
}
