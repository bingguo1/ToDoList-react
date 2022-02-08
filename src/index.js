import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCoffee, faPencilAlt, faTrashAlt, faInfoCircle, faSortAmountDown, faSortAmountDownAlt, faHourglassHalf, faHourglassEnd, faTasks } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ReactTooltip from 'react-tooltip';

import InputTodo from './InputTodo';
import ViewOptions from './ViewOptions';


// import Button from 'react-bootstrap/Button';
// import tooltip from 'react-bootstrap/Tooltip';

library.add(faCoffee, faPencilAlt, faTrashAlt, faInfoCircle, far, faSortAmountDown, faSortAmountDownAlt,faHourglassHalf,faHourglassEnd, faTasks);

function itemsFilterAndSort(items, viewOptions ) {
  const filterType=viewOptions.filterType;
  const dateType=viewOptions.dateType;
  const sortAscending=viewOptions.sortAscending;
  return items
    .filter(item => {
      if(filterType==="completed"){
          return item.completed;
      }else if(filterType==="active"){
          return !item.completed;
      }else if(filterType==="has-due-date"){
        return item.dueDate!=null;
      }else
        return true;
    })
    .sort((a, b) => {
      const aTime=dateType==="added-date"?a.addTime: a.dueDate;
      const bTime=dateType==="added-date"?b.addTime: b.dueDate;
      if(aTime < bTime) {
        return sortAscending?-1:1;
      } else if(aTime> bTime) {
        return sortAscending?1:-1;
      } else {
        return 0;
      }
    });
}


function displayDueDate(date){
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const DueDateBlock = ({dueDate}) => { 
  const today=new Date();
  const dueToday=dueDate.getDate()===today.getDate() && dueDate.getMonth()===today.getMonth() && dueDate.getFullYear()===today.getFullYear();
  const alreadyDue= !dueToday && dueDate<today;
  return(
  <div className="col-auto m-1 p-0 px-3">
    <div className="row">
      <div className="col-auto d-flex align-items-center rounded bg-white border border-warning">
        {alreadyDue? <FontAwesomeIcon icon="hourglass-end" className="mr-1 text-danger " data-tip="Due Date"/>:
        <FontAwesomeIcon icon="hourglass-half" className="mr-1 text-warning " data-tip="Due Date"/>}
        {/* <i className="fa fa-hourglass-2 my-2 px-2 text-warning btn" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Due on date"></i> */}
        <h6 className="text m-2 pr-0 due-block">{displayDueDate(dueDate)}</h6>
      </div>
    </div>
  </div>
)
}

const todoItemContentStyle="form-control form-control-lg border-0 edit-todo-input bg-transparent rounded px-3 completed-task";

class App extends React.Component {
  constructor(props) {
    super(props);


    this.state = {
      todolist: [
        {
        content: "Enjoy today",
        addTime: new Date(),
        completed: false,
        dueDate: new Date(),
        index: 0,
      },
      {
        content: "Prepare for tomorrow",
        addTime: new Date(),
        completed: false,
        dueDate: null,
        index: 1,
      }
      ],
      editingItemIndex: null,
      contentInEditing: "",
      viewOptions: {
        sortAscending: false,
        dateType: "added-date",
        filterType: "all",
      },
    };
  }
  componentDidUpdate(){
    // console.log("after update: viewOptions", this.state.viewOptions);
  }
  displayAddTime = (time) => {
    return time.toLocaleTimeString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  }

  getChildSortAscending =(sortAscending) =>{
    this.setState({ viewOptions: { ...this.state.viewOptions, sortAscending } });
  }

  getChildDateType= (dateType)=>{
    this.setState({ viewOptions: { ...this.state.viewOptions, dateType } });
  }

  getChildFilterType=(filterType)=>{
    this.setState({ viewOptions: { ...this.state.viewOptions, filterType } });
  }

  receiveNewToDo = (todo, dueDate) => {
    const newToDo = {
      content: todo,
      dueDate,
      addTime: new Date(),
      completed: false,
      index: this.state.todolist.length,
    };
    this.setState({ todolist: [ ...this.state.todolist, newToDo] });
  }

  switchCompletedStatus = (index) => {
    console.log("going to switch completed status for index:", index);
    let newToDoList = [...this.state.todolist];
    let newToDo = { ...newToDoList[index], completed: !newToDoList[index].completed };
    newToDoList[index] = newToDo;
    this.setState({ todolist: newToDoList });
    
  }
  removeThisToDoItem = (index) => {
    let newToDoList = [...this.state.todolist];
    newToDoList.splice(index, 1);

    this.setState({ todolist: newToDoList });
  }
  editThisToDoItem = (index) => {
    this.setState({ contentInEditing: this.state.todolist[index].content });
    this.setState({ editingItemIndex: index });
    /// why not add EventListener to the input field? cause it is not there yet, of course you can wait and add this event listener in
    /// componentDidMount(), but that is hard and may create more trouble 
    document.addEventListener('keyup', this.listenToEditingKeys);
  }
  listenToEditingKeys = (event) => {
    if (event.key === "Escape") {
      this.setState({ editingItemIndex: null });
      document.removeEventListener('keyup', this.listenToEditingKeys);
    } else if (event.keyCode === 13) {
      let newToDoList = [...this.state.todolist];
      let newToDo = { ...newToDoList[this.state.editingItemIndex], content: this.state.contentInEditing };
      newToDoList[this.state.editingItemIndex] = newToDo;
      this.setState({ todolist: newToDoList });
      this.setState({ editingItemIndex: null });
      document.removeEventListener('keyup', this.listenToEditingKeys);
    }
  }

  render() {
    console.log("rendering index.js");
    return (
      
      <div className="container m-5 p-2 rounded mx-auto bg-light shadow">
        <ReactTooltip />
        <div className="row m-1 p-4">
          <div className="col">
            <div className="p-1 h1 text-primary text-center mx-auto display-inline-block">
              {/* <i class="fa fa-check bg-primary text-white rounded p-2"></i> */}
              <FontAwesomeIcon className=" bg-primary text-white rounded p-2 mx-3" icon="tasks" />
              <h>To Do or Not To Do?</h>
            </div>
          </div>
        </div>
        <InputTodo sendToParent={this.receiveNewToDo} />
        <div className="p-2 mx-4 border-black-25 border-bottom"></div>
        <ViewOptions viewOptions={this.state.viewOptions} sendParentFilterType={this.getChildFilterType}
          sendParentDateType={this.getChildDateType} sendParentSortAscending={this.getChildSortAscending} />
        <div className="row mx-1 px-5 pb-3 w-80">
          <div className="col mx-auto">
            { itemsFilterAndSort(this.state.todolist, this.state.viewOptions).map((todoitem) => (
              <div className="row px-3 align-items-center todo-item rounded" key={todoitem.index}>
                <div className="col-auto m-1 p-0 d-flex align-items-center">
                  <h2 className="m-0 p-0" onClick={() => this.switchCompletedStatus(todoitem.index)}>
                    {todoitem.completed ?
                      <FontAwesomeIcon className="text-primary  m-0 p-0 mark-box" icon={['far', 'check-square']} data-tip="Mark as todo"/> :
                      <FontAwesomeIcon className="text-primary m-0 p-0 mark-box" icon={['far', 'square']} data-tip="Mark as complete"/>
                    }
                  </h2>
                </div>
                <div className="col px-1 m-1 d-flex align-items-center">
                  {this.state.editingItemIndex !== todoitem.index ?
                    <input type="text" className={ todoitem.completed? todoItemContentStyle+' strike-through-text': todoItemContentStyle} readOnly
                      value={todoitem.content} title="Buy groceries for next week" /> :
                    <input id="editingInputBox" type="text" onChange={evt => this.setState({ contentInEditing: evt.target.value })}
                      className="form-control form-control-lg border-0 edit-todo-input rounded px-3"
                      value={this.state.contentInEditing} />
                  }
                </div>
                { todoitem.dueDate && <DueDateBlock dueDate={todoitem.dueDate}/> }
                <div className="col-auto m-1 p-0 todo-actions">
                  <div className="d-flex align-items-center justify-content-end">
                    <h5 className="m-0 p-0 px-2" onClick={() => this.editThisToDoItem(todoitem.index)}>
                      <FontAwesomeIcon icon="pencil-alt" className="text-info btn m-0 p-0" data-tip="Edit todo"/>
                    </h5>
                    <h5 className="m-0 p-0 px-2" onClick={() => this.removeThisToDoItem(todoitem.index)}>
                      <FontAwesomeIcon icon="trash-alt" className="text-danger btn m-0 p-0" data-tip="Delete todo"/>
                      
                      {/* <i className="fa fa-trash-o text-danger btn m-0 p-0" data-toggle="tooltip" data-placement="bottom" title="Delete todo"></i> */}
                    </h5>
                  </div>
                  <div className="row todo-created-info">
                    <div className="col-auto d-flex align-items-center pr-2">
                      <FontAwesomeIcon icon="info-circle" data-tip="Created datetime"/>
                      {/* <i className="fa fa-info-circle my-2 px-2 text-black-50 btn" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Created date"></i> */}
                      <label className="date-label my-2 text-black-50">{this.displayAddTime(todoitem.addTime)}</label>
                    </div>
                  </div>
                </div>
              </div>

            ))}
          </div>
        </div>


      </div>
    )
  }



}



ReactDOM.render(
  <App />,
  document.getElementById('root')
);

