export const Message = ({ message, name }) => {
  if (message.type === 'join') return null;
  if (message.type === 'chat') return <p>{`${name}: ${message.message}`}</p>;
};
