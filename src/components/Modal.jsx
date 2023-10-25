const Modal = ({ team }) => {
  return (
    <div>
      <div>{team.teams[0]}</div>
      <div>{team.teams[1]}</div>
    </div>
  );
};

export default Modal;
