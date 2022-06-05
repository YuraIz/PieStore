import axios from "axios";
const API_URL = "http://localhost:8000";

export default class CartService {
    saveCartId() {
        function setCookie(cname, cvalue, exdays) {
            const d = new Date();
            d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
            let expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        }
        setCookie("cart_id", this.cart_id, 0.1);
    }

    getCartId() {
        function getCookie(cname) {
            let name = cname + "=";
            let decodedCookie = decodeURIComponent(document.cookie);
            let ca = decodedCookie.split(";");
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === " ") {
                    c = c.substring(1);
                }
                if (c.indexOf(name) === 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }
        let value = getCookie("cart_id");
        if (value === "") {
            return null;
        }
        return value;
    }

    constructor() {
        const url = `${API_URL}/api/cart/`;
        this.cart_id = this.getCartId();
        let self = this;
        if (this.cart_id == null) {
            this.promise = axios
                .get(url)
                .then((response) => {
                    self.cart_id = parseInt(response.data);
                    self.saveCartId();
                    console.log(`cart_id is ${self.cart_id}`);
                    console.log(`cart_id from cookie is ${self.getCartId()}`);
                })
                .catch(() => console.log("can't get cart_id"));
        }
    }

    async getCart() {
        await this.promise;
        const url = `${API_URL}/api/cart/${this.cart_id}`;
        const response = await axios.get(url);
        return response.data;
    }

    async updateCart(cake, quantity) {
        await this.promise;
        const url = `${API_URL}/api/cart/${this.cart_id}`;
        const edit = { item: cake.pk, quantity: quantity };
        const response = await axios.post(url, edit);
        return response.data;
    }

    async deleteItems() {
        await this.promise;
        const url = `${API_URL}/api/cart/${this.cart_id}`;
        const response = await axios.delete(url);
        return response.data;
    }
}
