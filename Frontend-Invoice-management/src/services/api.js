const API_BASE_URL = process.env.REACT_APP_SERVER_URL || '';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }

  async getProducts() {
    return this.get('/api/products/products');
  }

  async createProduct(productData) {
    return this.post('/api/products/create', productData);
  }

  async getCustomers() {
    return this.get('/api/customer/getAllCustomers');
  }

  async getCustomerDetails(customerId) {
    return this.get(`/api/customer/getCustomerDetails?customerId=${customerId}`);
  }

  async createCustomer(customerData) {
    return this.post('/api/customer/signup', customerData);
  }

  async getAccounts() {
    return this.get('/api/accounts/accounts');
  }

  async getAccountReceipts(accountId) {
    return this.get(`/api/receipt/accountId?accountId=${accountId}`);
  }

  async getTransactions(accountId) {
    return this.get(`/api/transaction/getAllTransactionOfAccount?accountId=${accountId}`);
  }

  async getCustomerTransactions(customerId) {
    return this.get(`/api/transaction/getAllTransactionOfCustomer?customerId=${customerId}`);
  }

  async getCustomerReceipts(customerId) {
    return this.get(`/api/receipt/customerId?customerId=${customerId}`);
  }

  async createTransaction(transactionData) {
    return this.post('/api/transaction', transactionData);
  }

  async createReceipt(receiptData) {
    return this.post('/api/receipt/', receiptData);
  }

  async getWorkerData(dateRange) {
    return this.post('/api/worker/getAllData', dateRange);
  }

  async loginWorker(credentials) {
    return this.post('/api/worker/login', credentials);
  }

  async registerWorker(workerData) {
    return this.post('/api/worker/signup', workerData);
  }

  async sendEmail() {
    return this.get('/sendMail');
  }

  async uploadFile(formData) {
    return this.request('/upload', {
      method: 'POST',
      headers: {},
      body: formData,
    });
  }
}

export default new ApiService();
