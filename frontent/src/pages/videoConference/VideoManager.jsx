import React, { useRef, useState, useEffect, useContext } from "react";
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
import { useNavigate } from 'react-router-dom'
import { useParams } from "react-router-dom";
import axios from 'axios'
import API from '../../../config/api.js'




const SERVER_URL = `${API}`;

const peerConfig = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};



const VideoManager = () => {
  const socketRef = useRef(null);
  const socketIdRef = useRef(null);
  const [unreadCount, setunreadCount] = useState(0)
  const localVideoRef = useRef(null);
  const peerConnections = useRef({});
  const [isMuted, setisMuted] = useState(false);
  const [isScreenSharing, setisScreenSharing] = useState(false);
  const [videos, setVideos] = useState([]);
  const [isCameraOn, setisCameraOn] = useState(true);
  const [meetingusername, setmeetingusername] = useState("");
  const [askForUsername, setAskForUsername] = useState(true);
  const [showMessageBar, setshowMessageBar] = useState(false);
  const screenStreamRef = useRef(null);
  const videoSenderMapRef = useRef({});
  const [chat, setchat] = useState('');
  const [messages, setMessages] = useState([]);


  const navigate = useNavigate()

    const {meeting_code} = useParams();

  const postHistory = async () => {
    try {
      console.log("posthistory");
      let res = await axios.post(`${API}/user/meeting/history`, { meetingCode: meeting_code }, { withCredentials: true })
      console.log(res.data.status);
      console.log("postHistory2");
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.off("chat-message", handleChatMessage);
        socketRef.current.off("user-joined", handleUserJoined);
        socketRef.current.off("user-left", handleUserLeft);
        socketRef.current.off("signal", handleSignal);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);



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

  const handleChatMessage = (data, sender, senderSocketId) => {
    setMessages(prev => [
      ...prev,
      { data, sender, senderSocketId }
    ]);

    // increase unread count only if chat panel is closed
    if (!showMessageBar) {
      setunreadCount(prev => prev + 1);
    }
  };

  const sendChatMessage = (e) => {

    e.preventDefault();

    if (!chat.trim()) return;

    socketRef.current.emit(
      "chat-message",
      chat,
      meetingusername
    );

    setchat("");
  };



  /* -------------------- SOCKET -------------------- */
  const connectSocket = async () => {


    socketRef.current = io(SERVER_URL);

    const meetingString = `${SERVER_URL}/${meeting_code}`;

    socketRef.current.on("connect", () => {
      socketIdRef.current = socketRef.current.id;
      socketRef.current.emit("join-call", meetingString );
    });

    socketRef.current.on("user-joined", handleUserJoined);
    socketRef.current.on("signal", handleSignal);
    socketRef.current.on("user-left", handleUserLeft);
    socketRef.current.on("chat-message", handleChatMessage);
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
    try {
      /* 1️⃣ Stop local media tracks */
      if (window.localStream) {
        window.localStream.getTracks().forEach(track => track.stop());
        window.localStream = null;
      }

      /* 2️⃣ Stop screen sharing if active */
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
        screenStreamRef.current = null;
      }

      /* 3️⃣ Close all peer connections */
      Object.values(peerConnections.current).forEach(pc => {
        pc.close();
      });
      peerConnections.current = {};

      /* 4️⃣ Clear remote videos */
      setVideos([]);

      /* 5️⃣ Disconnect socket */
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      postHistory();

      /* 6️⃣ Reset UI state */
      setAskForUsername(true);
      setshowMessageBar(false);
      setMessages([]);
      setunreadCount(0);

      /* 7️⃣ Optional: reload or redirect */
      navigate("/");  // if using react-router

    } catch (err) {
      console.error("Error ending call:", err);
    }
  };


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
    setshowMessageBar(prev => !prev);
    setunreadCount(0);
  };

 return (
  <div className="w-full h-screen">
    {askForUsername ? (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold mb-4">Enter Lobby</h2>

        <form
          onSubmit={connect}
          className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
        >
          <TextField
            label="Username"
            required
            fullWidth
            value={meetingusername}
            onChange={(e) => setmeetingusername(e.target.value)}
          />

          <Button type="submit" variant="contained">
            Connect
          </Button>
        </form>

        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="mt-4 w-full max-w-sm rounded-md"
        />
      </div>
    ) : (
      <div className="w-full min-h-screen bg-blue-950 relative overflow-hidden">
        {/* Local Video */}
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className={`
            fixed bottom-20 right-4 sm:right-6
            w-32 sm:w-48 md:w-64
            rounded-md shadow-lg
            transform transition-transform duration-300
            ${showMessageBar ? '-translate-x-80 sm:-translate-x-96' : 'translate-x-0'}
          `}
        />

        {/* Joined Users */}
        <h3 className="text-white font-bold text-lg sm:text-xl px-4 py-2">
          People joined
        </h3>

        <div className="flex flex-wrap gap-3 px-4 pb-32">
          {videos.map((v) => (
            <video
              key={v.socketId}
              autoPlay
              playsInline
              ref={(ref) => {
                if (ref) ref.srcObject = v.stream;
              }}
              className="rounded-md w-full sm:w-64 md:w-72 lg:w-80"
            />
          ))}
        </div>

        {/* Chat Sidebar */}
        <div
          className={`
            fixed top-0 right-0 h-full
            w-full sm:w-80
            bg-gray-100
            transform transition-transform duration-300
            ${showMessageBar ? 'translate-x-0' : 'translate-x-full'}
            overflow-y-auto z-40
          `}
        >
          <h1 className="font-bold text-xl px-4 py-3">Chat window</h1>

          <div className="h-[75vh] bg-white overflow-y-auto px-3 py-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`my-2 p-2 rounded-md max-w-[85%]
                  ${
                    msg.sender === meetingusername
                      ? 'bg-blue-500 text-white ml-auto'
                      : 'bg-gray-200 text-black mr-auto'
                  }`}
              >
                <p className="text-xs font-bold">{msg.sender}</p>
                <p className="text-sm break-words">{msg.data}</p>
              </div>
            ))}
          </div>

          <form
            onSubmit={sendChatMessage}
            className="flex gap-2 px-3 py-2 items-center"
          >
            <TextField
              label="Enter your chat..."
              fullWidth
              value={chat}
              onChange={(e) => setchat(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-3 py-2 rounded-md"
            >
              Send
            </button>
          </form>
        </div>

        {/* Controls */}
        <div className="fixed bottom-4 w-full flex justify-center z-50">
          <Stack
            direction="row"
            spacing={1}
            className="bg-white/90 px-3 py-2 rounded-full"
          >
            <IconButton
              color={isMuted ? 'secondary' : 'primary'}
              onClick={onToggleMute}
            >
              {isMuted ? <MicOffIcon /> : <MicIcon />}
            </IconButton>

            <IconButton
              color={isCameraOn ? 'primary' : 'secondary'}
              onClick={onToggleCamera}
            >
              {isCameraOn ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>

            <IconButton
              color={isScreenSharing ? 'secondary' : 'primary'}
              onClick={onToggleScreenShare}
            >
              {isScreenSharing ? <StopScreenShareIcon /> : <ScreenShareIcon />}
            </IconButton>

            <IconButton color="error" onClick={onEndCall}>
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

