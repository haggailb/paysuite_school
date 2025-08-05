
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { userLogOut } from '../_services/authServices';
import { useMessageModal } from '../components/ModalContext';

const ActivityMonitor = ({ children }) => {
  const location = useLocation();
  const { showMessageModal } = useMessageModal();
  const INACTIVITY_LIMIT = 10 * 60 * 1000; // 10 minutes

  useEffect(() => {
    if (location.pathname === "/") return;

    const updateActivity = () => {
      sessionStorage.setItem("lastActive", Date.now().toString());
    };

    const checkInactivity = () => {
      const lastActive = parseInt(sessionStorage.getItem("lastActive"), 10);
      if (!isNaN(lastActive) && Date.now() - lastActive > INACTIVITY_LIMIT) {
        sessionStorage.clear();
        try {
          userLogOut();
          showMessageModal({
            heading: 'Security Check',
            message: `You have been logged out due to inactivity.`,
            messageType: 'error',
          });
          window.location.href = '/';
        } catch (error) {
          alert(`❌ ${error.message}`);
          console.error("❌ Error performing log out: ", error.message);
        }
      }
    };

    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach(event => window.addEventListener(event, updateActivity));

    const interval = setInterval(checkInactivity, 10000);

    const syncActivity = (e) => {
      if (e.key === "lastActive") {
        // Optional cross-tab handling
      }
    };
    window.addEventListener("storage", syncActivity);

    return () => {
      events.forEach(event => window.removeEventListener(event, updateActivity));
      clearInterval(interval);
      window.removeEventListener("storage", syncActivity);
    };
  }, [location.pathname]);

  return children;
};

export default ActivityMonitor;
