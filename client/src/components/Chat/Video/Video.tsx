import React from "react";

export default function Video({ muted, videoRef, style }: any) {
  return (
    <video ref={videoRef} style={style} muted={muted}>
      Your browser does not support the video tag.
    </video>
  );
}
