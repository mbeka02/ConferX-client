import { useEffect, useRef, useState } from "react";
import { socket } from "../../services/socket";

const Room = () => {
  //types are giving me an issue
  // const peerRef = useRef<RTCPeerConnection>();
  const peerRef = useRef<any>();
  const myVideo = useRef<HTMLVideoElement>(null);
  const otherVideo = useRef<HTMLVideoElement>(null);
  // const mediaStream = useRef<MediaStream>();
  const mediaStream = useRef<any>();

  const Senders = useRef<(RTCRtpSender | undefined | MediaStream)[]>([]);
  useEffect(() => {
    const startDevices = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      mediaStream.current = stream;
      if (myVideo.current) {
        myVideo.current.srcObject = stream;
      }
    };

    startDevices();
  }, []);

  //placeholder config
  const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };
  //handle peer creation
  const createPeer = (): RTCPeerConnection => {
    const peerConnection = new RTCPeerConnection(configuration);

    peerConnection.onicecandidate = (e) => {
      if (e.candidate) {
      }
    };

    peerConnection.ontrack = (e) => {
      if (otherVideo.current) {
        otherVideo.current.srcObject = e.streams[0];
      }
    };
    return peerConnection;
  };

  const handleCall = () => {
    peerRef.current = createPeer();

    mediaStream.current
      .getTracks()
      .forEach((track: MediaStreamTrack) =>
        Senders.current.push(
          peerRef.current.addTrack(track, mediaStream.current)
        )
      );
  };
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
