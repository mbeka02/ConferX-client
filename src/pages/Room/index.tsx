import { useEffect, useRef, useState } from "react";
import { socket } from "../../services/socket";

const Room = () => {
  //types are giving me an issue
  // const peerRef = useRef<RTCPeerConnection>();
  const peerRef = useRef<any>();
  const myVideo = useRef<HTMLVideoElement>(null);
  const otherVideo = useRef<HTMLVideoElement>(null);
  // const mediaStream = useRef<MediaStream>();
  const mediaStream = useRef<MediaStream>();
  const otherUser = useRef();
  const socketRef = useRef();
  const sessionId = "test_room";
  const Senders = useRef<(RTCRtpSender | undefined | MediaStream)[]>([]);
  useEffect(() => {
    const startDevices = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (myVideo.current) {
        myVideo.current.srcObject = stream;
      }
      mediaStream.current = stream;
    };
    startDevices();

    socket.emit("join_room", sessionId);
    socket.on("otherUserJoined", handleCall);
    //  socket.on("joined", (userId) => (otherUser.current = userId));
    socket.on("offer", handleReceiveCall);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleNewIceCandidates);
  }, []);

  //handle peer creation
  const createPeer = (): RTCPeerConnection => {
    //placeholder config
    const configuration = {
      iceServers: [
        {
          urls: "stun:global.stun.twilio.com:3478",
        },
        {
          username:
            "0c966af170eff3db5eea40d4caaf7006759a96edb6a7aafd7a8435b939bdfb9a",
          urls: "turn:global.turn.twilio.com:3478?transport=udp",
          credential: "ohrFzf7UJKxfmEpwo3Yu89ZMw4r0L1A7BrWg30EmfFc=",
        },
      ],
    };
    const peerConnection = new RTCPeerConnection(configuration);

    peerConnection.onicecandidate = (e) => {
      if (e.candidate) {
        const payload = {
          candidate: e.candidate,
          roomId: sessionId,
        };

        socket.emit("ice-candidate", payload);
      }
    };

    peerConnection.ontrack = (e) => {
      if (otherVideo.current) {
        otherVideo.current.srcObject = e.streams[0];
      }
    };
    peerConnection.onnegotiationneeded = () => handleOffer();

    return peerConnection;
  };

  const handleCall = () => {
    peerRef.current = createPeer();

    if (mediaStream.current) {
      mediaStream.current
        .getTracks()
        .forEach((track: MediaStreamTrack) =>
          peerRef.current.addTrack(track, mediaStream.current)
        );
    }
  };
  //change any type
  const handleReceiveCall = async (incoming: any) => {
    peerRef.current = createPeer();
    //*payload.sdp , make sure its the offer
    const description = new RTCSessionDescription(incoming.sdp);
    console.log(incoming);

    //set session description for the remote peer
    peerRef.current.setRemoteDescription(description);

    if (mediaStream.current) {
      mediaStream.current
        .getTracks()
        .forEach((track: MediaStreamTrack) =>
          peerRef.current.addTrack(track, mediaStream.current)
        );
    }

    const answer = await peerRef.current.createAnswer();
    await peerRef.current.setLocalDescription(answer);

    const payload = {
      roomId: sessionId,

      sdp: peerRef.current.localDescription,
    };
    socket.emit("answer", payload);
  };

  const handleOffer = async () => {
    const offer = await peerRef.current.createOffer();
    await peerRef.current.setLocalDescription(offer);
    const payload = {
      roomId: sessionId,
      sdp: peerRef.current.localDescription,
    };
    socket.emit("offer", payload);
  };

  const handleAnswer = (message: any) => {
    const description = new RTCSessionDescription(message.sdp);
    peerRef.current
      .setRemoteDescription(description)
      .catch((error: Error) => console.log(error));
  };
  const handleNewIceCandidates = (incoming: RTCIceCandidate) => {
    const candidate = new RTCIceCandidate(incoming);
    peerRef.current.addIceCandidate(candidate);
  };
  return (
    <div>
      <video
        ref={myVideo}
        autoPlay
        playsInline
        className="w-56 h-28 rounded-md  border-solid border-blue-custom border-[1px]"
      />
      <video
        ref={otherVideo}
        autoPlay
        playsInline
        className="w-56 h-28 rounded-md  border-solid border-blue-custom border-[1px]"
      />
    </div>
  );
};

export default Room;
