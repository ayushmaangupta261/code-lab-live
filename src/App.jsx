import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setModal } from "./redux/slices/authSlice";
import { Outlet } from "react-router-dom";
import { PeerProvider } from "./providers/PeerProvider";
import Navbar from "./components/Navbar/Navbar";


function App() {
  const modal = useSelector((state) => state.auth.modal);
  const dispatch = useDispatch();
  const modalRef = useRef();

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      dispatch(setModal(false));
    }
  };

  return (
    <div
      ref={modalRef}
      onClick={closeModal}
      className="min-h-screen overflow-x-hidden  w-full bg-[#121212] text-white flex flex-col relative"
    >
      <PeerProvider>
        
        <Navbar />

        
        <main className="flex-1 mt-8 lg:mt-24 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>

     
      </PeerProvider>
    </div>
  );
}

export default App;
