import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { store, metrics, initStore } from './store.ts';
import { Provider } from 'tinybase/ui-react';

// Start the database sync 
initStore();

createRoot(document.getElementById("root")!).render(
    <Provider store={store} metrics={metrics}>
        <App />
    </Provider>
);
