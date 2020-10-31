const localStorage = new require('node-localstorage').LocalStorage('./public/NodeData');

const _localStorage = {
    addDataToLocalStorage: (itemName, data) => {
        localStorage.setItem(itemName, data);
    },
    isLength: (itemName) => {
        if(localStorage.getItem(itemName) != null) {
            return true;
        }
        return false;
    },
    getData: (itemName) => {
        return localStorage.getItem(itemName);
    }
}

module.exports = _localStorage;