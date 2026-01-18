import React, { useRef, useState } from "react";
import { io } from "socket.io-client";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const SERVER_URL = "http://localhost:3000";

const peerConfig = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const VideoManager = () => {
  const socketRef = useRef(null);
  const socketIdRef = useRef(null);
  const localVideoRef = useRef(null);
  const peerConnections = useRef({});

  const [videos, setVideos] = useState([]);
  const [username, setUsername] = useState("");
  const [askForUsername, setAskForUsername] = useState(true);

  /* -------------------- BLACK & SILENCE -------------------- */
  const silence = () => {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };

  const black = ({ width = 640, height = 480 } = {}) => {
    const canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
    const stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  const blackSilence = () =>
    new MediaStream([black(), silence()]);

  /* -------------------- MEDIA -------------------- */
  const getLocalStream = async () => {
    if (window.localStream) return;

    let videoTrack = null;
    let audioTrack = null;

    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoTrack = videoStream.getVideoTracks()[0];
    } catch (e) {
      videoTrack = black();
    }

    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioTrack = audioStream.getAudioTracks()[0];
    } catch (e) {
      audioTrack = silence();
    }

    const stream = new MediaStream([videoTrack, audioTrack]);

    window.localStream = stream;
    localVideoRef.current.srcObject = stream;
  };

  /* -------------------- SOCKET -------------------- */
  const connectSocket = async () => {
    await getLocalStream();

    socketRef.current = io(SERVER_URL);

    socketRef.current.on("connect", () => {
      socketIdRef.current = socketRef.current.id;
      socketRef.current.emit("join-call", window.location.href);
    });

    socketRef.current.on("user-joined", handleUserJoined);
    socketRef.current.on("signal", handleSignal);
    socketRef.current.on("user-left", handleUserLeft);
  };

  /* -------------------- USER JOIN -------------------- */
  const handleUserJoined = (joinedId, clients) => {
    clients.forEach((clientId) => {
      if (clientId === socketIdRef.current) return;
      if (peerConnections.current[clientId]) return;

      const pc = new RTCPeerConnection(peerConfig);
      peerConnections.current[clientId] = pc;

      window.localStream.getTracks().forEach((track) =>
        pc.addTrack(track, window.localStream)
      );

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          socketRef.current.emit(
            "signal",
            clientId,
            JSON.stringify({ ice: e.candidate })
          );
        }
      };

      pc.ontrack = (e) => {
        setVideos((prev) => {
          if (prev.find((v) => v.socketId === clientId)) return prev;
          return [...prev, { socketId: clientId, stream: e.streams[0] }];
        });
      };
    });

    // only new user sends offers
    if (joinedId === socketIdRef.current) {
      Object.keys(peerConnections.current).forEach((id) => {
        createOffer(id);
      });
    }
  };

  /* -------------------- SIGNAL -------------------- */
  const handleSignal = async (fromId, message) => {
    const data = JSON.parse(message);
    let pc = peerConnections.current[fromId];

    if (!pc) {
      pc = new RTCPeerConnection(peerConfig);
      peerConnections.current[fromId] = pc;

      window.localStream.getTracks().forEach((track) =>
        pc.addTrack(track, window.localStream)
      );

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          socketRef.current.emit(
            "signal",
            fromId,
            JSON.stringify({ ice: e.candidate })
          );
        }
      };

      pc.ontrack = (e) => {
        setVideos((prev) => {
          if (prev.find((v) => v.socketId === fromId)) return prev;
          return [...prev, { socketId: fromId, stream: e.streams[0] }];
        });
      };
    }

    if (data.sdp) {
      await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
      if (data.sdp.type === "offer") {
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socketRef.current.emit(
          "signal",
          fromId,
          JSON.stringify({ sdp: answer })
        );
      }
    }

    if (data.ice) {
      await pc.addIceCandidate(new RTCIceCandidate(data.ice));
    }
  };

  /* -------------------- OFFER -------------------- */
  const createOffer = async (toId) => {
    const pc = peerConnections.current[toId];
    if (!pc) return;

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socketRef.current.emit(
      "signal",
      toId,
      JSON.stringify({ sdp: offer })
    );
  };

  /* -------------------- USER LEFT -------------------- */
  const handleUserLeft = (id) => {
    if (peerConnections.current[id]) {
      peerConnections.current[id].close();
      delete peerConnections.current[id];
    }
    setVideos((prev) => prev.filter((v) => v.socketId !== id));
  };

  /* -------------------- UI -------------------- */
  const connect = () => {
    setAskForUsername(false);
    connectSocket();
  };

  return (
    <div>
      {askForUsername ? (
        <div>
          <h2>Enter Lobby</h2>

          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Button variant="contained" onClick={connect}>
            Connect
          </Button>

          <video
            
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            style={{ width: 300, marginTop: 10 }}
          />
        </div>
      ) : (
        <div className="w-full h-screen bg-blue-950">
          
          <video className="absolute bottom-14 right-10 rounded-md" ref={localVideoRef} autoPlay muted playsInline width={300} />

          <h3 className="text-white font-bold text-xl px-2 py-1">People joined</h3>
          <div className="flex flex-wrap gap-2.5 py-1.5 px-2">
            {videos.map((v) => (
              <video
              className="rounded-md"
                key={v.socketId}
                autoPlay
                playsInline
                ref={(ref) => {
                  if (ref) ref.srcObject = v.stream;
                }}
                width={300}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoManager;

