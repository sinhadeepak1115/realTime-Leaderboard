import WebSocket from "ws";

const ws = new WebSocket("ws://localhost:8080");

ws.on("error", console.error);

ws.on("open", () => {
  function open() {
    console.log("WebSocket connection opened");
    ws.send("Hello, server!");
  }
});
