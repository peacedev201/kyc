import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { VIDEO_ID_ATTENDED_AUTHORIZATION } from "../queriesAndMutations/authQuery";
import {
  CHANGE_USER_STATUS_VIDEO_IDENTIFICATION,
  CHANGE_USER_VIDEO_IDENTIFICATION_ID,
} from "../queriesAndMutations";
import { USER_VIDEO_IDENT_STATUS } from '../constants/user'
import { useMe } from "../myHooks";
import "../styles/legacy/style.scss";
import makeStyles from "@material-ui/core/styles/makeStyles";
import AppBar from "../components/AppBar";
import Footer from "../components/Footer";
import { VIDEO_ID_TYPES } from "../constants/video_id_types";
import CircularProgress from "@material-ui/core/CircularProgress";
const axios = require("axios");

const useStyles = makeStyles(() => ({
  videoIDClass: {
    maxHeight: "900px",
  },
  circularProgressWrapper: {
    display: "flex",
    justifyContent: "center",
  },
}));

const detectVideoIdType = (customer) => {
  let videoIdTypeDetected = "";
  let documentType = customer.documentType;

  if (documentType === "DRIVER_LICENSE") {
    videoIdTypeDetected = VIDEO_ID_TYPES.find(
      (ele) =>
        ele["countryName"] === customer.nationality &&
        ele["type"] === "DriverLicense"
    );
  } else {
    if (documentType === "NATIONAL_ID_CARD") {
      videoIdTypeDetected = VIDEO_ID_TYPES.find(
        (ele) =>
          ele["countryName"] === customer.nationality &&
          ele["type"] === "IdCard"
      );
    } else {
      videoIdTypeDetected = VIDEO_ID_TYPES.find(
        (ele) =>
          ele["countryName"] === customer.nationality &&
          ele["type"] === "Passport"
      );
    }
  }

  if (videoIdTypeDetected === undefined){
    if (documentType === "DRIVER_LICENSE") {
      videoIdTypeDetected = VIDEO_ID_TYPES.find(
        (ele) =>
          ele["countryName"] === customer.countryOfResidence &&
          ele["type"] === "DriverLicense"
      );
    } else {
      if (documentType === "NATIONAL_ID_CARD") {
        videoIdTypeDetected = VIDEO_ID_TYPES.find(
          (ele) =>
            ele["countryName"] === customer.countryOfResidence &&
            ele["type"] === "IdCard"
        );
      } else {
        videoIdTypeDetected = VIDEO_ID_TYPES.find(
          (ele) =>
            ele["countryName"] === customer.countryOfResidence &&
            ele["type"] === "Passport"
        );
      }
    }
  }

  return videoIdTypeDetected;
}

const VideoIDAttendedPage = () => {
  const { data: { me: userData } = {} } = useMe();
  const customer = userData.customer || {};
  const videoIdTypeDetected = detectVideoIdType(customer);
  const { data } = useQuery(VIDEO_ID_ATTENDED_AUTHORIZATION);
  const [changeUserVideoIdentStatus] = useMutation(CHANGE_USER_STATUS_VIDEO_IDENTIFICATION);
  const [changeUserVideoIdentId] = useMutation(CHANGE_USER_VIDEO_IDENTIFICATION_ID);
  const [ videoVerifyStatus, setVideoVerifyStatus] = useState("Unverified");
  const [ scriptLoaded, setScriptLoaded] = useState(false);
  const classes = useStyles();

  const getDataOfRecordedVideo = async (video_record_id) => {
    // Sandbox
    // const accessToken = "376d1e54-bda8-4bb4-95c1-0903b4293132";
    // const videoURL = `https://etrust-sandbox.electronicid.eu/v2/videoid/${video_record_id}`;
    // Live
    const accessToken = "aa9e4568-f9e3-4d84-8017-a217c71aed09";
    const videoURL = `https://etrust-live.electronicid.eu/v2/videoid/${video_record_id}`;
    const AuthStr = "Bearer ".concat(accessToken);
    await axios
      .get(videoURL, { headers: { Authorization: AuthStr } })
      .then((response) => {
        let videoStatus =
          response.data.status === "Completed"
            ? USER_VIDEO_IDENT_STATUS.PASSED
            : USER_VIDEO_IDENT_STATUS.DENIED;
        setVideoVerifyStatus(videoStatus);
        changeUserVideoIdentStatus({
          variables: {
            id: +userData.id,
            videoIdentificationStatus: videoStatus,
          },
        }).then(() => console.log("update video status successfully!"));
        changeUserVideoIdentId({
          variables: {
            id: +userData.id,
            videoIdentificationId: video_record_id,
          },
        }).then(() => console.log("update video record id successfully!"));
      })
  };

  const loadScript = (data) => {
    const script = document.createElement("script");
    // script.src ="https://etrust-sandbox.electronicid.eu/v2/js/videoidattended.js";
    // Sandbox
    // script.src = "https://etrust-sandbox.electronicid.eu/v2/js/videoid.js";
    // Live
    script.src = "https://etrust-live.electronicid.eu/v2/js/videoid.js";
    document.head.appendChild(script);
    script.onload = function () {
      let EID = window.EID;
      // let videoId = EID.videoIDAttended("#video", {
      //   lang: "en",
      // });
      let videoId = EID.videoId("#video", {
        lang: "en",
      });
      videoId.turnOn();
      videoId.start({
        authorization: data.VideoIDAttendAuthorization.authorization,
        idType: videoIdTypeDetected.id,
      });
      videoId.on("phaseStarting", function (phase) {
        if (phase.name === "FRONT") {
          console.log(phase.name + " - Starting");
          setScriptLoaded(true);
        }
        phase.continue();
      });
      videoId.on("completed", function (video) {
        videoId.turnOff();
        getDataOfRecordedVideo(video.id);
        alert("VideoId record successfully!");
      });
      videoId.on("failed", function (error) {
        alert("VideoId Failed");
      });
    };
  };

  useEffect(() => {
    if (data) {
      console.log('loadScript running...')
      loadScript(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div className="page-user">
      <AppBar />
      <div className="page-content">
        <div className="container">
          <p className="text-center">
            VideoID Page, status: {videoVerifyStatus}
          </p>
          <p className="text-center">
            <strong>Only available from 9-5pm Vaduz, Liechtenstein time.</strong>
          </p>
          {scriptLoaded ? (
            ""
          ) : (
            <div className={classes.circularProgressWrapper}>
              <CircularProgress />
            </div>
          )}
          <div id="video" className={classes.videoIDClass}></div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default VideoIDAttendedPage;
