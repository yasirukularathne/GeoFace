"use client";

import React, { useRef, useEffect, useState } from "react";

interface CameraFeedProps {
  onCapture?: (blob: Blob) => void;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const getCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setStreaming(true);
      } catch (err) {
        setError("Unable to access webcam.");
      }
    };
    getCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(async (blob) => {
          if (blob) {
            // Preview the photo
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
            if (onCapture) onCapture(blob);
            // Save to localStorage as base64
            const reader = new FileReader();
            reader.onloadend = () => {
              if (reader.result && typeof reader.result === "string") {
                localStorage.setItem("capturedPhoto", reader.result);
              }
            };
            reader.readAsDataURL(blob);
            // Send to backend
            const formData = new FormData();
            formData.append("photo", blob);
            await fetch("/api/register", {
              method: "POST",
              body: formData,
            });
          }
        }, "image/jpeg");
      }
    }
  };

  return (
    <div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: "100%", maxWidth: 400, transform: "scaleX(-1)" }}
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <button onClick={handleCapture} disabled={!streaming}>
        Capture Snapshot
      </button>
      {previewUrl && (
        <div style={{ marginTop: 16 }}>
          <h3>Photo Preview:</h3>
          <img
            src={previewUrl}
            alt="Snapshot preview"
            style={{ maxWidth: 400, border: "1px solid #ccc" }}
          />
          <br />
          <a
            href={previewUrl}
            download={"snapshot.jpg"}
            style={{ display: "inline-block", marginTop: 8 }}
          >
            <button type="button">Download Photo</button>
          </a>
        </div>
      )}
    </div>
  );
};

export default CameraFeed;
