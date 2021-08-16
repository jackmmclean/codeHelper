import React, { useEffect, useRef, useState } from "react";
import socket from "../../../api/socket";
import Container from "react-bootstrap/Container";
import VideoCallButtons from "./VideoCallButtons";
import Peer from "peerjs";
import Video from "./Video";

export default function VideoCall({
  studentUsername,
  currentUser,
  closeVideo,
  reshowCallButton,
}: any) {
  const peerOptions: any = process.env.REACT_APP_PEERPORT
    ? {
        host: process.env.REACT_APP_PEERHOST,
        port: process.env.REACT_APP_PEERPORT,
        path: "/peerjs",
      }
    : {
        host: process.env.REACT_APP_PEERHOST,
        path: "/peerjs",
      };

  const myVideo = useRef<any>(null);
  const otherUserVideo = useRef<any>(null);
  const myPeer = new Peer(currentUser, peerOptions);

  var myStream: any;

  const [currentPeer, setCurrentPeer] = useState(null);
  const [streamType, setStreamType] = useState("video");

  const [soundOn, setSoundOn] = useState(true);
  const toggleSound = () => {
    myVideo.current.srcObject.getAudioTracks()[0] &&
      (myVideo.current.srcObject.getAudioTracks()[0].enabled = !soundOn);
    setSoundOn(!soundOn);
  };

  const [videoOn, setVideoOn] = useState(true);
  const toggleVideo = () => {
    myVideo.current.srcObject.getVideoTracks()[0].enabled = !videoOn;
    setVideoOn(!videoOn);
  };

  function addVideoStream(video: any, stream: any) {
    video.current.srcObject = stream;
    video.current.addEventListener("loadedmetadata", () => {
      video.current.play();
    });
  }

  function switchToScreenShare() {
    navigator.mediaDevices
      //@ts-ignore
      .getDisplayMedia({
        video: {
          cursor: "always",
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      })
      .then((stream: any) => {
        replaceStream(stream);
        setStreamType("screenShare");
        setSoundOn(true);
        setVideoOn(true);
      })
      .catch((err: any) => {
        console.log("Unable to get display media " + err);
      });
  }

  function switchToVideoCall() {
    //@ts-ignore
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream: any) => {
        replaceStream(stream);
        setStreamType("video");
        setSoundOn(true);
        setVideoOn(true);
      })
      .catch((err: any) => {
        console.log("Unable to get display media " + err);
      });
  }

  function replaceStream(mediaStream: any) {
    addVideoStream(myVideo, mediaStream);
    //@ts-ignore
    for (let sender of currentPeer.getSenders()) {
      if (sender.track.kind === "audio") {
        if (mediaStream.getAudioTracks().length > 0) {
          sender.replaceTrack(mediaStream.getAudioTracks()[0]);
        }
      }
      if (sender.track.kind === "video") {
        if (mediaStream.getVideoTracks().length > 0) {
          sender.replaceTrack(mediaStream.getVideoTracks()[0]);
        }
      }
    }
  }

  function endCall() {
    socket.emit("leaveCall", studentUsername || currentUser);
    myPeer.destroy();
    stopStreamedVideo(myVideo);
    closeVideo();
    reshowCallButton();
  }

  function stopStreamedVideo(videoElem: any) {
    if (currentPeer) {
      //@ts-ignore
      const stream = currentPeer.getSenders();
      const tracks = stream.map((sender: any) => sender.track);

      tracks.forEach(function (track: any) {
        track.stop();
      });
    } else if (videoElem.current) {
      const stream = videoElem.current.srcObject;
      const tracks = stream.getTracks();

      tracks.forEach(function (track: any) {
        track.stop();
      });

      videoElem.current.srcObject = null;
    } else {
      const tracks = myStream && myStream.getTracks();

      tracks.forEach(function (track: any) {
        track.stop();
      });
    }
  }

  function openFullscreen() {
    if (otherUserVideo.current.requestFullscreen) {
      otherUserVideo.current.requestFullscreen();
    } else if (otherUserVideo.current.webkitRequestFullscreen) {
      /* Safari */
      otherUserVideo.current.webkitRequestFullscreen();
    } else if (otherUserVideo.current.msRequestFullscreen) {
      /* IE11 */
      otherUserVideo.current.msRequestFullscreen();
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream: any) => {
        addVideoStream(myVideo, stream);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        myStream = stream;

        myPeer.on("call", (call: any) => {
          call.answer(stream);
          call.on("stream", (userVideoStream: any) => {
            setCurrentPeer(call.peerConnection);
            addVideoStream(otherUserVideo, userVideoStream);
          });
        });

        myPeer.on("error", function (err) {
          console.log(err.message);
        });

        socket.on("user-connected", (userId: any) => {
          var callOn = false;
          function myLoop() {
            //  create a loop function
            setTimeout(function () {
              if (currentPeer === null) {
                const call = myPeer.call(userId, stream);

                call.on("stream", (userVideoStream: any) => {
                  //@ts-ignore
                  setCurrentPeer(call.peerConnection);
                  addVideoStream(otherUserVideo, userVideoStream);
                  callOn = true;
                });

                setTimeout(function () {
                  if (!callOn) {
                    call.close();
                    myLoop();
                  }
                }, 500);
              }
            }, 500);
          }

          myLoop();

          console.log(`${userId} connected`);
        });
      })
      .catch((e: any) => console.log(e));

    myPeer.on("open", (id: any) => {
      socket.emit("joinCall", studentUsername);
    });

    socket.on("user-disconnected", (userId: any) => {
      setTimeout(endCall, 500);
    });

    return () => {
      socket.off("user-connected");
      endCall();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container className="d-flex align-items-center justify-content-center">
      <Video
        videoRef={otherUserVideo}
        muted={false}
        style={{ width: "500px" }}
      />
      <div style={{ marginLeft: "10px", textAlign: "center" }}>
        <Video videoRef={myVideo} muted={true} style={{ width: "200px" }} />
        <VideoCallButtons
          soundOn={soundOn}
          toggleSound={toggleSound}
          videoOn={videoOn}
          toggleVideo={toggleVideo}
          shareScreenButton={switchToScreenShare}
          videoCallButton={switchToVideoCall}
          streamType={streamType}
          endCall={endCall}
          openFullscreen={openFullscreen}
        />
      </div>
      <br />
    </Container>
  );
}
