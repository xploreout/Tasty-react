import '../App.css';

function Popup({ handleDeleteTrue,handleDeleteFalse }) {
    return (
      <div className="modal">
        <div className="modal-box">
          <p>Are you sure you want to delete?</p>
          <button className="modal-buttonCancel" onClick={handleDeleteFalse}>Cancel</button>
          <button onClick={handleDeleteTrue} className="search-button">
            Confirm
          </button>
        </div>
      </div>
    );
  }

export default Popup;