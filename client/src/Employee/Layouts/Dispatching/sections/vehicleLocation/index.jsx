import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import Header from "../../../../../OtherComponents/Header";

const mapContainerStyle = {
  width: "100%",
  height: "80vh",
};

const libraries = ["places"]; // Load only the libraries you need

const DispatchedTransactions = () => {
  const [gpsData, setGpsData] = useState({ latitude: null, longitude: null });
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY, // Use your environment variable
    libraries,
  });

  useEffect(() => {
    // const socket = new WebSocket("ws://192.168.1.244:3001");
    const socket = new WebSocket("ws://192.168.137.1:3001");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setGpsData(data);
    };

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  }, []);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  const { latitude, longitude } = gpsData;

  return (
    <Box p="20px" width="100% !important" sx={{ position: "relative" }}>
      <Box display="flex" justifyContent="space-between">
        <Header title="Vehicle Location" subtitle="List of Vehicle Location" />
      </Box>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={15}
        center={{ lat: latitude || 15.1004537, lng: longitude || 120.948715 }}
      >
        {latitude && longitude && (
          <Marker position={{ lat: latitude, lng: longitude }} />
        )}
      </GoogleMap>
    </Box>
  );
};

export default DispatchedTransactions;
