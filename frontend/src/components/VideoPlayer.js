import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchVideoStream } from '../services/api';

const VideoPlayer = () => {
    const { id } = useParams();
    const [videoUrl, setVideoUrl] = useState('');

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const url = await fetchVideoStream(id);
                setVideoUrl(url);
            } catch (error) {
                console.error('Error fetching video stream:', error);
            }
        };
        fetchVideo();
    }, [id]);

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Video Player</h1>
            {videoUrl ? (
                <div style={styles.videoWrapper}>
                    <video controls style={styles.video}>
                        <source src={videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            ) : (
                <p style={styles.loadingText}>Loading video...</p>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: "'Poppins', sans-serif",
        textAlign: 'center',
        backgroundColor: '#f4f4f4',
        borderRadius: '10px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    },
    heading: {
        fontSize: '2rem',
        marginBottom: '20px',
        color: '#8E0F5D',
    },
    videoWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        borderRadius: '10px',
        overflow: 'hidden',
    },
    video: {
        width: '100%',
        maxWidth: '800px',
        height: 'auto',
        border: 'none',
    },
    loadingText: {
        fontSize: '1.2rem',
        color: '#333',
    },
};

export default VideoPlayer;
