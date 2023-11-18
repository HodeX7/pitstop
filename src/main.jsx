import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { defineCustomElements } from '@ionic/pwa-elements/loader';

defineCustomElements(window)

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
