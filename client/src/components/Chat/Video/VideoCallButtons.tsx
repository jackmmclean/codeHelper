import React from "react";
import {
  FaShare,
  FaVideo,
  FaVideoSlash,
  FaVolumeMute,
  FaVolumeUp,
  FaWindowClose,
  FaExpandAlt,
} from "react-icons/fa";
import Button from "react-bootstrap/Button";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

export default function VideoCallButtons({
  soundOn,
  toggleSound,
  videoOn,
  toggleVideo,
  shareScreenButton,
  videoCallButton,
  streamType,
  endCall,
  openFullscreen,
}: any) {
  return (
    <div style={{ fontSize: "30px", color: "blue", textAlign: "center" }}>
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id="tip">{soundOn ? "Mute" : "Unmute"}</Tooltip>}
      >
        <Button onClick={toggleSound}>
          {soundOn ? <FaVolumeMute /> : <FaVolumeUp />}
        </Button>
      </OverlayTrigger>{" "}
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id="tip">
            {videoOn ? "Hide Your Video" : "Show Your Video"}
          </Tooltip>
        }
      >
        <Button onClick={toggleVideo}>
          {videoOn ? <FaVideoSlash /> : <FaVideo />}
        </Button>
      </OverlayTrigger>{" "}
      {streamType === "video" ? (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="tip">Share Screen</Tooltip>}
        >
          <Button onClick={shareScreenButton}>
            <FaShare />
          </Button>
        </OverlayTrigger>
      ) : (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="tip">Share Video</Tooltip>}
        >
          <Button onClick={videoCallButton}>
            <FaVideo />
          </Button>
        </OverlayTrigger>
      )}{" "}
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id="tip">Full Screen</Tooltip>}
      >
        <Button onClick={openFullscreen}>
          <FaExpandAlt />
        </Button>
      </OverlayTrigger>{" "}
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id="tip">End Call</Tooltip>}
      >
        <Button variant="danger" onClick={endCall}>
          <FaWindowClose />
        </Button>
      </OverlayTrigger>
    </div>
  );
}
