import axios from 'axios';


const Server = () => {
    const serverWithoutToken = axios.create({
        baseURL: process.env.REACT_APP_API_URL
    });
    const server = axios.create({
        baseURL: process.env.REACT_APP_API_URL
    });
    server.interceptors.request.use(
        async config => {
            const userToken = await localStorage.getItem('userToken');
            if (userToken) {
                config.headers.Authorization = `Bearer ${userToken}`;
            }
            return config;
        },
        err => {
            return Promise.reject(err);
        }
    );
    return {server, serverWithoutToken}
}

export default Server;