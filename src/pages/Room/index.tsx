import { useEffect, useRef, useState } from "react";
import { socket } from "../../services/socket";
import SimplePeer from "simple-peer";

interface RefPeers {
  peerId: string;
  peer: SimplePeer.Instance;
}
type Props = {
  peer: SimplePeer.Instance;
};

const Video = ({ peer }: Props) => {
  const ref = useRef<HTMLVideoElement>(null);
  peer.on("stream", (stream) => {
    if (ref.current) {
      ref.current.srcObject = stream;
    }
  });
  return (
    <video
      ref={ref}
      autoPlay
      playsInline
      className="w-56 h-28 rounded-md  border-solid border-blue-custom border-[1px]"
    />
  );
};

const Room = () => {
  const peersRef = useRef<RefPeers[]>([]);

  const [peers, setPeers] = useState<SimplePeer.Instance[]>([]);
  const UserVideo = useRef<HTMLVideoElement>(null);

  const mediaStream = useRef<MediaStream>();

  const sessionId = "test_room";
  // const Senders = useRef<any>([]);
  useEffect(() => {
    //capture user's stream webcam and mic access
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        //audio: true,
      })
      .then((stream) => {
        if (UserVideo.current) {
          UserVideo.current.srcObject = stream;
        }
        socket.emit("join_room", sessionId);
        socket.on("users", (users) => {
          const peers: any[] = [];
          users.forEach((userId: string) => {
            const peer = createPeer(userId, socket.id, stream);
            peersRef.current.push({
              peerId: userId,
              peer,
            });
            peers.push(peer);
          });
          setPeers(peers);
        });
        socket.on("user-joined", (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerId: payload.callerID,
            peer,
          });
          setPeers((users) => [...users, peer]);
        });
        socket.on("receiving-returned-signal", (payload) => {
          const item = peersRef.current.find((i) => i.peerId === payload.id);
          item?.peer.signal(payload.signal);
        });
      });
    // socket.on("otherUserJoined", handleCall);
    //  socket.on("joined", (userId) => (otherUser.current = userId));
    //socket.on("offer", handleReceiveCall);
    //socket.on("answer", handleAnswer);
    //socket.on("ice-candidate", handleNewIceCandidates);
  }, []);

  //handle peer creation
  const createPeer = (
    userToSignal: string,
    callerID: string,
    stream: MediaStream
  ) => {
    //placeholder config
    const configuration = {
      iceServers: [
        {
          urls: "stun:stun.relay.metered.ca:80",
        },
        {
          urls: "turn:a.relay.metered.ca:80",
          username: "3bfad118bd91583d3826d37b",
          credential: "slfgGm3AV7fm80Ki",
        },
        {
          urls: "turn:a.relay.metered.ca:80?transport=tcp",
          username: "3bfad118bd91583d3826d37b",
          credential: "slfgGm3AV7fm80Ki",
        },
      ],
    };
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,

      stream,
    });
    peer.on("signal", (signal) => {
      socket.emit("sending-signal", { userToSignal, callerID, signal });
    });

    return peer;
  };
  const addPeer = (
    incomingSignal: string,
    callerID: string,
    stream: MediaStream
  ) => {
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socket.emit("returning-signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  };

  /*const handleCall = () => {
    peerRef.current = createPeer();
    //attach stream to peer obj
    //store info  needed for screen share in Senders arr
    mediaStream.current
      ?.getTracks()
      .forEach((track: MediaStreamTrack) =>
        Senders.current.push(
          peerRef.current.addTrack(track, mediaStream.current)
        )
      );
  };
  //change any type
  const handleReceiveCall = async (incoming: any) => {
    peerRef.current = createPeer();

    const description = new RTCSessionDescription(incoming.sdp);

    //set session description for the remote peer
    peerRef.current.setRemoteDescription(description);

    mediaStream.current
      ?.getTracks()
      .forEach((track: MediaStreamTrack) =>
        peerRef.current.addTrack(track, mediaStream.current)
      );

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
  };*/

  const toggleVideo = () => {
    const tracks = mediaStream.current
      ?.getTracks()
      .find((track) => track.kind === "video");
    if (tracks) {
      tracks.enabled ? (tracks.enabled = false) : (tracks.enabled = true);
    }
  };
  const toggleMic = () => {
    const tracks = mediaStream.current
      ?.getTracks()
      .find((track) => track.kind === "audio");
    //if audio track is present toggle oit
    if (tracks) {
      tracks.enabled ? (tracks.enabled = false) : (tracks.enabled = true);
    }
  };
  //fix cursor issue
  /* const screenShare = async () => {
    const options = {
      cursor: true,
    };
    const stream = await navigator.mediaDevices.getDisplayMedia(options);
    const display = stream.getTracks()[0];
    Senders.current
      .find((sender: any) => sender.track.kind === "video")
      .replaceTrack(display);
    display.onended = () => {
      Senders.current
        .find((sender: any) => sender.track.kind === "video")
        .replaceTrack(mediaStream.current?.getTracks()[1]);
    };
  };*/
  return (
    <div>
      <video
        ref={UserVideo}
        autoPlay
        playsInline
        className="w-56 h-28 rounded-md  border-solid border-blue-custom border-[1px]"
      />
      {peers.map((peer, index) => {
        return <Video peer={peer} key={index} />;
      })}

      <button>SHARE</button>
    </div>
  );
};

export default Room;
