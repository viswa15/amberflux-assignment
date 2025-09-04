# MERN Screen Recorder

A simple web application built with the MERN stack (using SQL instead of MongoDB) that allows users to record their active browser tab with microphone audio. Users can then preview, download, and upload the recording.

**Live Demo:**
* **Frontend (Vercel):** [Your-Vercel-URL]
* **Backend (Render):** [Your-Render-URL]

---

## Features

-   **Tab Recording:** Record the current browser tab with microphone audio.
-   **Live Timer:** Displays the current duration of the recording.
-   **3-Minute Limit:** Recordings automatically stop after 3 minutes.
-   **Preview & Playback:** Watch the recording immediately after stopping.
-   **Download:** Save the recording directly to your device as a `.webm` file.
-   **Upload:** Persist the recording by uploading it to the server.
-   **Recording Gallery:** View a list of all previously uploaded recordings with inline playback.

---

## Technology Stack

-   **Frontend:** React (Vite), JavaScript (ES6+), Fetch API
-   **Backend:** Node.js, Express.js
-   **Database:** SQL (SQLite for local development)
-   **File Handling:** Multer
-   **Browser APIs:** `navigator.mediaDevices.getDisplayMedia`, `MediaRecorder`

---

## Local Development Setup

### Prerequisites

-   Node.js and npm
-   A modern browser like Google Chrome or Firefox.

### 1. Clone the Repository

```bash
git clone [your-repo-url]
cd mern-screen-recorder
```

### 2. Backend Setup

```bash
cd backend
npm install
node server.js
```
The backend server will start on `http://localhost:5000`.

### 3. Frontend Setup

In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
The React app will open on `http://localhost:5173` (or another port if 5173 is busy).

---

## Known Limitations

-   **Browser Compatibility:** This application relies on the `getDisplayMedia` API, which is primarily supported in modern desktop browsers like Chrome, Firefox, and Edge. It will not work on most mobile browsers.
-   **Deployment Filesystem:** The backend is configured to save uploads to the local filesystem. This works for local development but is not suitable for production platforms with ephemeral filesystems like Render's free tier. For a production-ready app, file uploads should be handled by a dedicated cloud storage service like **AWS S3** or **Google Cloud Storage**.
-   **No Authentication:** The application is public, with no user accounts or authentication. All uploaded recordings are visible to everyone.