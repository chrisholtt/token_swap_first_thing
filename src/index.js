import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MoralisProvider } from "react-moralis";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <MoralisProvider serverUrl="https://pgyt1snolhf3.usemoralis.com:2053/server" appId="AXpqpg4DJWxM7Tx2GSQN9mrbVJztXI6P8csDj9fW">
    <App />
  </MoralisProvider>
);


