import React, { useEffect, useState } from 'react';
import { fetchVideos } from '../services/api';
import { Link } from 'react-router-dom';

const VideoList = () => {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const getVideos = async () => {
            try {
                const data = await fetchVideos();
                setVideos(data);
            } catch (error) {
                console.error('Error fetching videos:', error);
            }
        };

        getVideos();
    }, []);

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Uploaded Videos</h1>
            {videos.length === 0 ? (
                <p style={styles.noVideos}>No videos found. Upload some videos to get started!</p>
            ) : (
                <ul style={styles.videoList}>
                    {videos.map((video) => (
                        <li key={video._id} style={styles.videoItem}>
                            <Link to={`/video/${video._id}`} style={styles.videoLink}>
                                {video.title || 'Untitled Video'}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: "'Poppins', sans-serif",
        color: '#333',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    },
    heading: {
        fontSize: '2rem',
        textAlign: 'center',
        marginBottom: '20px',
        color: '#8E0F5D',
    },
    noVideos: {
        textAlign: 'center',
        fontSize: '1.2rem',
        color: '#555',
    },
    videoList: {
        listStyleType: 'none',
        padding: 0,
        margin: 0,
    },
    videoItem: {
        backgroundColor: '#ffffff',
        margin: '10px 0',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    },
    videoItemHover: {
        transform: 'translateY(-2px)',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
    },
    videoLink: {
        textDecoration: 'none',
        fontSize: '1.1rem',
        color: '#8E0F5D',
        fontWeight: '500',
    },
};

export default VideoList;
