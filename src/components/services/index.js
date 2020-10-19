import store from '../store';
export default {
  // Register new user
  async registerNewUser(userEmail, userPassword) {
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          password: userPassword,
        }),
      };
      const url = 'https://goit-store.herokuapp.com/auth/registration';
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      throw error;
    }
  },
  // Login user
  async loginUser(userEmail, userPassword) {
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          password: userPassword,
        }),
      };
      const url = 'https://goit-store.herokuapp.com/auth/login';
      const response = await fetch(url, options);
      const data = response.json();
      await data.then(res => {
        store.auth.accces_token = res.accces_token;
        store.user = res.user;
      });
    } catch (error) {
      throw error;
    }
  },
  // Get all users
  async getAllUsers() {
    try {
      const options = {
        method: 'GET',
      };
      const url = 'https://goit-store.herokuapp.com/users';
      const response = await fetch(url, options);
      const data = response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },
  //   Change user password
  async changePassword(newPassword, confirmNewPassword) {
    try {
      const options = {
        method: 'PATCH',
        headers: {
          Authorization: store.auth.accces_token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: newPassword,
          confirmPassword: confirmNewPassword,
        }),
      };
      const url = `https://goit-store.herokuapp.com/users/changePassword`;
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      throw error;
    }
  },
  //   Add favorite product
  async addFavoriteProduct(product) {
    try {
      const options = {
        method: 'POST',
        headers: {
          Authorization: store.auth.accces_token,
        },
        body: JSON.stringify(product)
      };
      const url = `https://goit-store.herokuapp.com/users/addFavoriteProduct/`;
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      throw error;
    }
  },
  //   Remove favorite product
  async removeFavoriteProduct(productId) {
    try {
      const options = {
        method: 'DELETE',
        headers: {
          Authorization: store.auth.accces_token,
        },
      };
      const url = `https://goit-store.herokuapp.com/users/removeFavoriteProduct/${productId}`;
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      throw error;
    }
  },
  // Get current user
  async getCurrentUser() {
    try {
      const options = {
        method: 'GET',
        headers: {
          Authorization: store.auth.accces_token,
        },
      };
      const url = 'https://goit-store.herokuapp.com/users/currentUser';
      const response = await fetch(url, options);
      const data = response.json();
      await data.then(
        ({ favorites, lastSeen, role, _id, name, email, password }) => {
          store.user.favorites = favorites;
          store.user.lastSeen = lastSeen;
          store.user.role = role;
          store.user._id = _id;
          store.user.name = name;
          store.user.email = email;
          store.user.password = password;
        },
      );
      return data;
    } catch (error) {
      throw error;
    }
  },
  //   Get all products
  async getAllProducts() {
    try {
      const options = {
        method: 'GET',
      };
      const url = `https://goit-store.herokuapp.com/products`;
      const response = await fetch(url, options);
      const data = response.json();
      await data.then(data => (store.products = data));
      return data;
    } catch (error) {
      throw error;
    }
  },
  // Create new product
  async createNewProduct(object) {
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(object),
      };
      const url = 'https://goit-store.herokuapp.com/products';
      const response = await fetch(url, options);
      const data = response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },
  //   Get categories
  async getCategories() {
    try {
      const options = {
        method: 'GET',
      };
      const url = `https://goit-store.herokuapp.com/products/getCategories`;
      const response = await fetch(url, options);
      const data = response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },
  //   Search products
  async searchProducts(search = '', category = '', itemsPerPage = 1, page = 1) {
    try {
      const options = {
        method: 'GET',
      };
      const url = `https://goit-store.herokuapp.com/products?itemsPerPage=${itemsPerPage}&page=${page}&search=${search}&category=${category}`;
      const response = await fetch(url, options);
      const data = response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },
  //   Get all orders
  async getAllOrders() {
    try {
      const options = {
        method: 'GET',
        headers: {
          Authorization: store.auth.accces_token,
        },
      };
      const url = `https://goit-store.herokuapp.com/orders`;
      const response = await fetch(url, options);
      const data = response.json();
      await data.then(data => (store.orders = data));
      console.dir(store.orders);
      return data;
    } catch (error) {
      throw error;
    }
  },
  // Create new order
  async createNewOrder(productList) {
    const order = {
      address: store.user.address,
      productList: productList,
    };
    console.dir(order);
    try {
      const options = {
        method: 'POST',
        headers: {
          Authorization: store.auth.accces_token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      };
      console.log(JSON.stringify(order));
      const url = 'https://goit-store.herokuapp.com/orders';
      const response = await fetch(url, options);
      const data = response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },
};
