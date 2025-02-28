import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import ErrorDialogsProvider from "./Providers/ErrorDialogsProvider.jsx";
import { BrowserRouter } from "react-router-dom";
import MapProvider from "./Providers/MapProvider.jsx";
import { SnackbarProvider } from "notistack";
import {SnackbarUtilsConfigurator} from '../src/Utils/SnackbarUtils.jsx'

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ErrorDialogsProvider>
      <MapProvider>
        <SnackbarProvider
          maxSnack={3}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <SnackbarUtilsConfigurator/>
            <App />
        </SnackbarProvider>
      </MapProvider>
    </ErrorDialogsProvider> 
  </BrowserRouter>
);
