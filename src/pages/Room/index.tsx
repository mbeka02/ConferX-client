import { useEffect, useRef, useState } from "react";

const Room = () => {
  const myVideo = useRef<HTMLVideoElement>(null);
  const mediaStream = useRef<MediaStream>();
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        mediaStream.current = stream;

        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
      });
  }, []);
  return (
    <div>
      <video
        ref={myVideo}
        autoPlay
        playsInline
        className="w-56 h-28 rounded-md  border-solid border-blue-custom border-[1px]"
      />
    </div>
  );
};

export default Room;
