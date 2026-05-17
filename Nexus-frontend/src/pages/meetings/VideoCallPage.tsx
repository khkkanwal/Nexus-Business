import React, { useEffect, useRef, useState } from "react";

import { useParams } from "react-router-dom";

import { socket } from "../../services/socketService";

export const VideoCallPage = () => {
  const { id } = useParams();

  const localVideoRef = useRef<HTMLVideoElement>(null);

  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const peerConnection = useRef<RTCPeerConnection | null>(null);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    startCall();
  }, []);

  const startCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setLocalStream(stream);

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    socket.emit("join-room", id);

    peerConnection.current = new RTCPeerConnection();

    stream.getTracks().forEach((track) => {
      peerConnection.current?.addTrack(track, stream);
    });

    peerConnection.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          roomId: id,
          candidate: event.candidate,
        });
      }
    };

    const offer = await peerConnection.current.createOffer();

    await peerConnection.current.setLocalDescription(offer);

    socket.emit("offer", {
      roomId: id,
      offer,
    });
  };

  // RECEIVE OFFER
  socket.on("offer", async (offer) => {
    if (!peerConnection.current) return;

    await peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(offer),
    );

    const answer = await peerConnection.current.createAnswer();

    await peerConnection.current.setLocalDescription(answer);

    socket.emit("answer", {
      roomId: id,
      answer,
    });
  });

  // RECEIVE ANSWER
  socket.on("answer", async (answer) => {
    if (!peerConnection.current) return;

    await peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(answer),
    );
  });

  // RECEIVE ICE
  socket.on("ice-candidate", async (candidate) => {
    if (!peerConnection.current) return;

    await peerConnection.current.addIceCandidate(
      new RTCIceCandidate(candidate),
    );
  });

  const toggleAudio = () => {
    localStream?.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
  };

  const toggleVideo = () => {
    localStream?.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
  };

  const endCall = () => {
    peerConnection.current?.close();

    socket.emit("end-call", id);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Video Call</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-full rounded-xl bg-black"
        />

        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full rounded-xl bg-black"
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={toggleAudio}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Toggle Audio
        </button>

        <button
          onClick={toggleVideo}
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
        >
          Toggle Video
        </button>

        <button
          onClick={endCall}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          End Call
        </button>
      </div>
    </div>
  );
};
