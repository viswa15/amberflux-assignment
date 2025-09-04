// frontend/src/App.jsx

import React, { useState, useRef, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
    const [isRecording, setIsRecording] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState(null);
    const [timer, setTimer] = useState(0);
    const [recordings, setRecordings] = useState([]);

    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);
    const timerIntervalRef = useRef(null);
    const recordedChunksRef = useRef([]);

    // Fetch recordings on component mount
    useEffect(() => {
        fetchRecordings();
    }, []);

    const fetchRecordings = async () => {
        try {
            const response = await fetch(`${API_URL}/api/recordings`);
            const data = await response.json();
            setRecordings(data);
        } catch (error) {
            console.error("Failed to fetch recordings:", error);
        }
    };


    const handleStartRecording = async () => {
        try {
            // Get screen and mic access
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: { mediaSource: "tab" },
                audio: true,
            });
            streamRef.current = stream;

            // Stop recording if the user closes the tab
            stream.getVideoTracks()[0].onended = handleStopRecording;

            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });
            recordedChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
                setRecordedBlob(blob);
                streamRef.current.getTracks().forEach(track => track.stop()); // Stop the stream tracks
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            
            // Start timer
            timerIntervalRef.current = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);

            // Auto-stop after 3 minutes
            setTimeout(handleStopRecording, 180000); // 3 * 60 * 1000

        } catch (error) {
            console.error("Error starting recording:", error);
            alert("Could not start recording. Please allow permissions.");
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
        }
        clearInterval(timerIntervalRef.current);
        setIsRecording(false);
        setTimer(0);
    };

    const handleUpload = async () => {
        if (!recordedBlob) return;
        const formData = new FormData();
        formData.append('video', recordedBlob, `recording-${Date.now()}.webm`);

        try {
            const response = await fetch(`${API_URL}/api/recordings`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert('Upload successful!');
                setRecordedBlob(null); // Reset preview
                fetchRecordings(); // Refresh list
            } else {
                alert('Upload failed.');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed.');
        }
    };
    
    const formatTime = (seconds) => new Date(seconds * 1000).toISOString().substr(14, 5);

    return (
        <div className="container">
            <h1>Tab Screen Recorder</h1>
            
            {!isRecording && !recordedBlob && (
                <button onClick={handleStartRecording}>Start Recording</button>
            )}

            {isRecording && (
                <div>
                    <button onClick={handleStopRecording}>Stop Recording</button>
                    <p className="timer">Recording Time: {formatTime(timer)} / 03:00</p>
                </div>
            )}

            {recordedBlob && (
                <div className="preview-section">
                    <h2>Preview</h2>
                    <video src={URL.createObjectURL(recordedBlob)} controls width="600" />
                    <div>
                        <a href={URL.createObjectURL(recordedBlob)} download={`recording-${Date.now()}.webm`}>
                            <button>Download</button>
                        </a>
                        <button onClick={handleUpload}>Upload</button>
                        <button onClick={() => setRecordedBlob(null)}>Record Again</button>
                    </div>
                </div>
            )}
            
            <hr />

            <h2>Uploaded Recordings</h2>
            <div className="recordings-list">
                {recordings.length > 0 ? (
                    recordings.map(rec => (
                        <div key={rec.id} className="recording-item">
                            <video src={rec.url} width="300" controls preload="metadata"></video>
                            <p>Filename: {rec.filename}</p>
                            <p>Size: {Math.round(rec.filesize / 1024)} KB</p>
                            <p>Created: {new Date(rec.createdAt).toLocaleString()}</p>
                        </div>
                    ))
                ) : (
                    <p>No recordings yet.</p>
                )}
            </div>
        </div>
    );
}

export default App;