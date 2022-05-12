import { useContext } from "react";
import { NotificationContext } from "../context/NotificationProvider";

export const useNotification = () => useContext(NotificationContext)