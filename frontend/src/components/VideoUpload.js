import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadVideo } from '../services/api';

const VideoUpload = () => {
    const [video, setVideo] = useState(null);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setVideo(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!video) {
            setMessage('Please select a video to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('video', video);

        try {
            await uploadVideo(formData);
            setMessage('Video uploaded successfully!');
            navigate('/videos');
        } catch (error) {
            console.error(error);
            setMessage('Failed to upload video.');
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Upload Video</h1>
            <div style={styles.formGroup}>
                <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    style={styles.fileInput}
                />
                <button onClick={handleUpload} style={styles.uploadButton}>
                    Upload
                </button>
            </div>
            {message && <p style={styles.message}>{message}</p>}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
    },
    heading: {
        fontSize: '2rem',
        marginBottom: '20px',
        color: '#8E0F5D',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
    },
    fileInput: {
        padding: '10px',
        fontSize: '1rem',
        border: '1px solid #ccc',
        borderRadius: '5px',
        width: '100%',
        maxWidth: '400px',
    },
    uploadButton: {
        padding: '10px 20px',
        fontSize: '1rem',
        backgroundColor: '#8E0F5D',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
    uploadButtonHover: {
        backgroundColor: '#720c49',
    },
    message: {
        marginTop: '20px',
        fontSize: '1rem',
        color: '#333',
    },
};

export default VideoUpload;
