from urllib import response
from rest_framework.test import APITestCase
from rest_framework import status
# Create your tests here.

class PieTests(APITestCase):
    def test_cake_list(self):
        response = self.client.get("/api/cakes/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotEqual(response.data.get('data', None) , None)

    def test_cake_item(self):
        response = self.client.get("/api/cakes/1")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for key in ['pk', 'image', 'name', 'price', 'description']:
            self.assertNotEqual(response.data.get(key, None) , None)    


        cake = {
            "image": "http://localhost:8080/media/cake_1.png",
            "name": "Клюквенный торт с маскарпоне",
            "price": 10,
            "description": "Понятия не имею какой он на вкус"
        }    

        response = self.client.post("/api/cakes/", cake)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        for key in ['pk', 'image', 'name', 'price', 'description']:
            self.assertNotEqual(response.data.get(key, None) , None)    

        pk = response.data.get('pk')
        cake_url = f"/api/cakes/{pk}"

        response = self.client.delete(cake_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        response = self.client.get(cake_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

            

    def test_cart(self):
        response = self.client.get('/api/cart/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        cart_id = response.data
        cart_url = f'/api/cart/{cart_id}'
        response = self.client.get(cart_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'data': [], 'status': 'CHOOSING', 'timer': None})

        response = self.client.post(cart_url, {'item': 1})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        response = self.client.delete(cart_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)