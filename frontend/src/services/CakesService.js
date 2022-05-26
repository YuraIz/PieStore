import axios from "axios";
const API_URL = "http://localhost:8000";

export default class CakesService {
    getCakes() {
        const url = `${API_URL}/api/cakes/`;
        return axios.get(url).then((response) => response.data);
    }
    getCakesByURL(link) {
        const url = `${API_URL}/${link}`;
        return axios.get(url).then((response) => response.data);
    }
    getCake(pk) {
        const url = `${API_URL}/api/cakes/${pk}`;
        return axios.get(url).then((response) => response.data);
    }
    deleteCake(cake) {
        const url = `${API_URL}/api/cakes/${cake.pk}`;
        return axios.delete(url);
    }
    createCake(cake) {
        alert(JSON.stringify(cake));
        const url = `${API_URL}/api/cakes/`;
        return axios.post(url, cake);
    }
    updateCake(cake) {
        const url = `${API_URL}/api/cakes/${cake.pk}`;
        return axios.put(url, cake);
    }
}
