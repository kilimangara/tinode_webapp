import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.API_BACKEND_BASE_PATH,
});

const setToken = (token) => {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

const clearToken = () => {
    delete axiosInstance.defaults.headers.common["Authorization"];
}

const authorize = (token, refreshToken) => {
    setToken(token);
    async function refresh() {
        const { data } = await axiosInstance.request({
            url: "auth/token/refresh/",
            method: 'post',
            data: {
                refresh: refreshToken
            }
        });
        authorize(data.access, data.refresh);
    }
    setTimeout(refresh, 1000 * 10 * 60);
}


const Methods = {
    async oneLogin(token) {
        const { data } = await axiosInstance.request({
            url: 'auth/one_time_login/',
            method: 'post',
            data: {
                one_time_token: token,
            }
        });
        authorize(data.access, data.refresh);
        return data;
    },
    async usersByTinodeUids(uids) {
        const { data } = await axiosInstance.request({
            url: 'chat/users/search',
            method: 'post',
            data: {
                uids: uids,
            }
        })
        return data;
    },
    async banUser(userUuid) {
        await axiosInstance.request({
            url: `auth/management/profile/${userUuid}`,
            method: 'delete',
        });
    },
    async fetchChatSecret() {
        const { data } = await axiosInstance.request({
            url: 'chat/secrets',
            method: 'get',
        });
        return data;
    }
}

export default Methods