import MainRouter from "./routes/MainRouter";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <>
      <MainRouter />
      <Toaster />
    </>
  );
}
