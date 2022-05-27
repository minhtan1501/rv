const ViewAllBtn = ({ children, onClick, visible }) => {
    if (!visible) return null;
    return (
      <button
        type="button"
        onClick={onClick}
        className="
    dark:text-white text-primary 
      hover:underline transtion"
      >
        {children}
      </button>
    );
  };

export default ViewAllBtn