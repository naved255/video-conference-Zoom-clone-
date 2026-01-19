import React, { useRef, useState, useEffect } from "react";
import { io } from "socket.io-client";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from '@mui/material/IconButton';
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import Stack from "@mui/material/Stack";
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import Badge from "@mui/material/Badge";
import ChatIcon from "@mui/icons-material/Chat";



const SERVER_URL = "http://localhost:3000";

const peerConfig = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const VideoManager = () => {
  const socketRef = useRef(null);
  const socketIdRef = useRef(null);
  const [unreadCount, setunreadCount] = useState(3)
  const localVideoRef = useRef(null);
  const peerConnections = useRef({});
  const [isMuted, setisMuted] = useState(false);
  const [isScreenSharing, setisScreenSharing] = useState(false);
  const [videos, setVideos] = useState([]);
  const [isCameraOn, setisCameraOn] = useState(true);
  const [username, setUsername] = useState("");
  const [askForUsername, setAskForUsername] = useState(true);
  const [showMessageBar, setshowMessageBar] = useState(false);
  const screenStreamRef = useRef(null);
  const videoSenderMapRef = useRef({});


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
    // if (window.localStream) return;

    let videoTrack = null;
    let audioTrack = null;

    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoStream) {
        setisCameraOn(true);
      } else {
        setisCameraOn(false);
      }
      videoTrack = videoStream.getVideoTracks()[0];
    } catch (e) {
      setisCameraOn(false);
      videoTrack = black();
    }

    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (audioStream) {
        setisMuted(false);
      } else {
        setisMuted(true);
      }
      audioTrack = audioStream.getAudioTracks()[0];
    } catch (e) {
      setisMuted(true);
      audioTrack = silence();
    }

    const stream = new MediaStream([videoTrack, audioTrack]);

    window.localStream = stream;
    localVideoRef.current.srcObject = stream;
  };

  useEffect(() => {
    getLocalStream();
  }, [])


  /* -------------------- SOCKET -------------------- */
  const connectSocket = async () => {


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

      window.localStream.getTracks().forEach((track) => {
        const sender = pc.addTrack(track, window.localStream);

        if (track.kind === "video") {
          videoSenderMapRef.current[clientId] = sender;
        }
      });


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

      window.localStream.getTracks().forEach((track) => {
        const sender = pc.addTrack(track, window.localStream);

        if (track.kind === "video") {
          videoSenderMapRef.current[clientId] = sender;
        }

      });


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
    getLocalStream();
    connectSocket();
  };

  const onToggleScreenShare = async () => {
    try {
      // STOP screen sharing → restore camera
      if (isScreenSharing) {
        const cameraTrack = window.localStream.getVideoTracks()[0];

        Object.values(videoSenderMapRef.current).forEach(sender => {
          sender.replaceTrack(cameraTrack);
        });

        screenStreamRef.current.getTracks().forEach(t => t.stop());
        screenStreamRef.current = null;

        localVideoRef.current.srcObject = window.localStream;
        setisScreenSharing(false);
        return;
      }

      // START screen sharing
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      const screenTrack = screenStream.getVideoTracks()[0];

      Object.values(videoSenderMapRef.current).forEach(sender => {
        sender.replaceTrack(screenTrack);
      });

      localVideoRef.current.srcObject = screenStream;
      screenStreamRef.current = screenStream;
      setisScreenSharing(true);

      // If user clicks "Stop sharing" from browser UI
      screenTrack.onended = () => {
        onToggleScreenShare();
      };

    } catch (err) {
      console.error("Screen share error:", err);
    }
  };


  const onToggleMute = () => {
    try {
      const stream = window.localStream;
      if (!stream) return;

      const audioTrack = stream.getAudioTracks()[0];
      if (!audioTrack) return;

      audioTrack.enabled = !audioTrack.enabled;
      setisMuted(!audioTrack.enabled); // state matches actual mute
    } catch (error) {
      console.error(error);
    }
  };


  const onEndCall = () => {

  }

  const onToggleCamera = () => {
    try {
      const stream = window.localStream;
      if (!stream) return;

      const videoTrack = stream.getVideoTracks()[0];
      if (!videoTrack) return;

      videoTrack.enabled = !videoTrack.enabled;
      setisCameraOn(videoTrack.enabled);
    } catch (error) {
      console.log(error)
    }
  }

  const onMessageBar = () => {
    setshowMessageBar(!showMessageBar);
  }

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

          <video
            className={`absolute bottom-14 right-10 rounded-md
    transform transition-transform duration-400
    ${showMessageBar ? '-translate-x-100' : 'translate-x-0'}`}
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            width={300}
          />


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
          <div className="fixed bottom-14 w-full flex justify-center items-center">

            <div className={`fixed h-screen w-80 bg-gray-100   transform transition-transform duration-300 ${showMessageBar ? 'translate-x-0' : 'translate-x-full'}
 overflow-y-auto top-0 right-0 py-3 px-4`}>
              <h1 className="font-bold text-xl px-2 py-1">Chat window</h1>
              <div className="h-[80vh] bg-white overflow-y-auto">

              </div>
              <form className="flex mt-2 gap-2.5 px-1 py-1 justify-center items-center" action="">
                <input className="bg-gray-300 w-96 rounded-md px-1.5 py-1" placeholder="Enter your message..." type="text" name="message" />
                <button className="bg-blue-500 px-2 py-1 text-center rounded-md" type="submit">send</button>
              </form>
            </div>

            <Stack direction="row" spacing={2}>
              {/* Mute / Unmute */}
              <IconButton
                color={isMuted ? "secondary" : "primary"}
                onClick={onToggleMute}

              >
                {isMuted ? <MicOffIcon /> : <MicIcon />}
              </IconButton>

              <IconButton
                color={isCameraOn ? "primary" : "secondary"}
                onClick={onToggleCamera}
              >
                {isCameraOn ? <VideocamIcon /> : <VideocamOffIcon />}
              </IconButton>

              {/* Screen Share / Stop Sharing */}
              <IconButton
                color={isScreenSharing ? "secondary" : "primary"}
                onClick={onToggleScreenShare}
              >
                {isScreenSharing ? <StopScreenShareIcon /> : <ScreenShareIcon />}
              </IconButton>

              {/* End Call */}
              <IconButton
                color="error"
                onClick={onEndCall}
              >
                <CallEndIcon />
              </IconButton>

              <IconButton onClick={onMessageBar} color="primary">
                <Badge badgeContent={unreadCount} color="error">
                  <ChatIcon />
                </Badge>
              </IconButton>
            </Stack>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoManager;

