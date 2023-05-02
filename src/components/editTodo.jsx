import React, { useState } from 'react';
import '../index.css';
import { db } from '../services/firebase.config';
import { doc, updateDoc } from '@firebase/firestore';

const EditTodo = ({ task, id }) => {
  const [updatedTask, setUpdatedTask] = useState([task]);

  const updateTask = async (e) => {
    e.preventDefault();
    try {
      const taskDocument = doc(db, 'tasks', id);
      await updateDoc(taskDocument, {
        task: updatedTask,
        isChecked: false,
      });
      window.location.reload();
    } catch (err) {
      alert(err);
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target={`#id${id}`}
      >
        Edit Todo
      </button>

      <div
        className="modal fade"
        id={`id${id}`}
        tabIndex="-1"
        aria-labelledby="editLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editLabel">
                Update Todo Details
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form className="d-flex">
                <input
                  type="text"
                  className="form-control"
                  defaultValue={updatedTask}
                  onChange={(e) => setUpdatedTask(e.target.value)}
                />
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={(e) => updateTask(e)}
              >
                Update Todo
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditTodo;
