import axios from 'axios';

const URL = 'http://localhost:3000';

interface GetRequest {
  path: string;
  params?: any;
  hasToken?: boolean;
}

interface PostRequest {
  path: string;
  body?: any;
  params?: any;
  hasToken?: boolean;
}

interface PutRequest {
  path: string;
  body?: any;
  params?: any;
  hasToken?: boolean;
}

class ServiceClass {
  protected async getToken() {
    return localStorage.getItem('x-token');
  }

  protected async get<T>({ path, hasToken, params }: GetRequest) {
    const token = hasToken ? await this.getToken() : undefined;
    const headers = { 'x-token': token };
    return axios
      .get<T>(`${URL}/${path}`, { headers, params })
      .then((response) => response.data)
      .catch((error) => {
        throw { ...error?.response?.data, status: error?.response?.status };
      });
  }

  protected async post<T>({ path, body = {}, hasToken, params }: PostRequest) {
    const token = hasToken ? await this.getToken() : undefined;
    const headers = { 'x-token': token };
    return axios
      .post<T>(`${URL}/${path}`, body, { headers, params })
      .then((response) => response.data)
      .catch((error) => {
        throw { ...error?.response?.data, status: error?.response?.status };
      });
  }

  protected async put<T>({ path, body = {}, hasToken, params }: PutRequest) {
    const token = hasToken ? await this.getToken() : undefined;
    const headers = { 'x-token': token };
    return axios
      .put<T>(`${URL}/${path}`, body, { headers, params })
      .then((response) => response.data)
      .catch((error) => {
        throw { ...error?.response?.data, status: error?.response?.status };
      });
  }
}

export default ServiceClass;
