export const isValidEmail = (email) => {
  const regexEmail = /^\w+([\.+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regexEmail.test(email);
};

export const renderItem = (result) => {
  return (
    <div className="flex space-x-2 rounded overflow-hidden">
      <img
        className="w-16 h-16 object-cover"
        src={result.avatar}
        alt={result.name}
      />
      <p className="dark:text-white font-semibold">{result.name}</p>
    </div>
  );
};

export const parseError = (string) => {
  return string?.toString()?.split('Error: ')[1]
}

export  const trimTitle = (text = '') => {
  if (text.length <= 20) return text;
  return text.substring(0, 20) + '...';
};
