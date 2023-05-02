import React, { useEffect, useState } from 'react';
import EditTodo from './editTodo';
import '../index.css';
import { db } from '../services/firebase.config';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';

const Todo = () => {
  const collectionRef = collection(db, 'tasks');

  const [task, setTask] = useState([]);
  // eslint-disable-next-line
  const [checked, setChecked] = useState([]);
  const [createTask, setCreateTask] = useState([]);

  useEffect(() => {
    const getTasks = async () => {
      // eslint-disable-next-line
      let queryForTimeStamp = query((collection(db, 'tasks')), orderBy('timestamp'));
      await getDocs(queryForTimeStamp)
        .then((task) => {
          let taskData = task.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setTask(taskData);
          setChecked(taskData);
        })
        .catch((err) => {
          alert(err);
        });
    };
    getTasks();
  }, []);

  //   Add Task Handler
  const submitTask = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collectionRef, {
        task: createTask,
        isChecked: false,
        timestamp: serverTimestamp(),
      });
      window.location.reload();
    } catch (err) {
      alert(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      window.confirm('Are you sure you want to delete this task?');

      const documentRef = doc(db, 'tasks', id);
      await deleteDoc(documentRef);
      window.location.reload();
    } catch (err) {
      alert(err);
    }
  };

  const checkBoxHandler = async (e) => {
    setChecked((state) => {
      const index = state.findIndex(
        (checkbox) => checkbox.id.toString() === e.target.name
      );
      let newState = state.slice();
      newState.splice(index, 1, {
        ...state[index],
        isChecked: !state[index].isChecked,
      });

      setTask(newState);
      return newState;
    });

    // persisting the checkbox value
    try {
      const docRef = doc(db, 'tasks', e.target.name);
      await runTransaction(db, async (transaction) => {
        const todoDoc = await transaction.get(docRef);
        if (!todoDoc.exists()) {
          alert("Document not found!!")
        }
        const newValue = !todoDoc.data().isChecked;
        transaction.update(docRef, { isChecked: newValue });
      });
      console.log('Transaction successfully committed!');
    } catch (error) {
      console.log('Transaction failed: ', error);
    }
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="card card-white">
              <div className="card-body">
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#addModal"
                  type="button"
                  className="btn btn-info"
                >
                  Add Todo
                </button>
                {task.map(({ task, id, isChecked, timestamp }) => (
                  <div className="todo-list" key={id}>
                    <div className="todo-item">
                      <hr />
                      <span className={`${isChecked === true ? 'done' : ''}`}>
                        <div className="checker">
                          <span className="">
                            {/* ISSUE FACED:
                            FROM DB- THE CHECKED WAS TRUE, BUT UI WAS BEHAVING DIFFERENTLY. 
                            REASON: defaultValue was used, which is wrong. defaultChecked must be used
                            */}
                            <input
                              type="checkbox"
                              defaultChecked={isChecked}
                              onChange={(e) => checkBoxHandler(e)}
                              name={id}
                            />
                          </span>
                        </div>
                        &nbsp; {task}
                        <br />
                        {/* 
                        {new Date(timestamp)--- error created: Objects are not valid as a React child. because date returns as object. So have
                          to use object.keys
                        */}
                        <i>{new Date(timestamp.seconds * 1000).toLocaleString()}</i>
                      </span>
                      <span className=" float-end mx-3">
                        <EditTodo task={task} id={id} />
                      </span>
                      <button
                        type="button"
                        className="btn btn-danger float-end"
                        onClick={() => deleteTask(id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <div
        className="modal fade"
        id="addModal"
        tabIndex="-1"
        aria-labelledby="addModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <form className="d-flex" onSubmit={submitTask}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="addModalLabel">
                  Add Todo
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Add a Task"
                  onChange={(e) => setCreateTask(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" data-bs-dismiss="modal">
                  Close
                </button>

                <button type="submit" className="btn btn-primary">
                  Create Todo
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default Todo;
