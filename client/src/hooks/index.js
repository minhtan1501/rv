import { useContext } from "react";
import { useDispatch } from "react-redux";
import { NotificationContext } from "../context/NotificationProvider";
import { handleSearch } from "../redux/searchSlice";
import { debounce } from "../utils/debounce";

export const useNotification = () => useContext(NotificationContext)

export const useSearch = () =>{
    const dispatch = useDispatch();
    const debounceSearch = debounce(dispatch,300);
    return (...args) => {
        debounceSearch(handleSearch(...args))
    }
}