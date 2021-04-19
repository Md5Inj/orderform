class Storage {
    static setItem(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
        window.dispatchEvent( new Event('storage'));
    }

    static getItem(key) {
        let item = localStorage.getItem(key);
        let result;

        if (item !== "") {
            result = JSON.parse(item);
        } else {
            result = item;
        }

        return result;
    }
}

export default Storage;
