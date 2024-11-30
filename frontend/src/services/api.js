import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Update with your server URL

export const uploadVideo = async (formData) => {
    const response = await axios.post(`${API_BASE_URL}/upload/video`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const fetchVideos = async () => {
    const response = await axios.get(`${API_BASE_URL}/videos`);
    return response.data;
};

export const fetchVideoStream = (id) => {
    return `${API_BASE_URL}/video/${id}`; // Stream URL
};
