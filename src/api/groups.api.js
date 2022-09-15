import http from 'services/http.service';

export async function getGroup(config) {
    try {
        const response = await http.get(`/groups`,config);
        return response;
    } catch (e) {
        return Promise.reject(e);
    }
}


