import React, { useEffect, useState } from "react";
import "../styles/legacy/style.scss";
import AppBar from "../components/AppBar";
import Footer from "../components/Footer";

const VideoRecoredPage = ({ match }) => {
  const paramsVideoId = match.params.videoId;
  const [ videoFileName, setVideoFileName ] = useState(null);
  // Sandbox
  // const accessToken = "376d1e54-bda8-4bb4-95c1-0903b4293132";
  // const videoURL = `https://etrust-sandbox.electronicid.eu/v2/videoid.file/${paramsVideoId}`;
  // Live
  const accessToken = "aa9e4568-f9e3-4d84-8017-a217c71aed09";
  const videoURL = `https://etrust-live.electronicid.eu/v2/videoid.file/${paramsVideoId}`;
  const AuthStr = "Bearer ".concat(accessToken);

  const getRecordedVideo = async () => {
    try {
      const result = await fetch(videoURL, {
        headers: {
          Authorization: AuthStr,
        },
      });
      const blob = await result.blob();
      if(blob) {
        setVideoFileName(URL.createObjectURL(blob));
      }
    } catch {}
  }

  useEffect(() => {
    getRecordedVideo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page-user">
      <AppBar />
      <div className="page-content">
        <div className="container text-center">
          <video controls src={videoFileName}>
          </video>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VideoRecoredPage;
