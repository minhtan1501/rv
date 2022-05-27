import Label from "./Label";

const LabelWithBadge = ({ children, htmlFor, badge }) => {
    const renderBadge = () => {
      return (
        <span
          className="dark:bg-dark-subtle 
      bg-light-subtle absolute top-0 right-0 w-5 h-5 
      rounded-full flex justify-center items-center
      translate-x-2 -translate-y-1 text-xs
      "
        >
          {badge <= 9 ? badge : '9+'}
        </span>
      );
    };
    return (
      <div className="relative">
        <Label htmlFor={htmlFor}>{children}</Label>
        {badge ? renderBadge() : null}
      </div>
    );
  };

export default LabelWithBadge