import React, { memo } from 'react';
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "react-datepicker/dist/react-datepicker.css";
import ReactTooltip from 'react-tooltip';


class InputTodo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            todo: '',
            dueDate: new Date(),
            dueDateSelected: false,
            openCalendar: false,
            showDueDate: "Due date not set",
        };
    }
    submitToDo = (event) => {
        event.preventDefault();
        const todo=this.state.todo.trim();
        if(todo==="") return;
        this.props.sendToParent(todo, this.state.dueDateSelected?this.state.dueDate:null);
        this.setState({ todo: '', dueDateSelected:false, dueDate: new Date(), showDueDate: "Due date not set"});

    }
    convertDate2String=(date)=>{
        return date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
    }
    selectDate=(date)=>{
        console.log("get new date====>:",date);
        this.setState({openCalendar:false, dueDateSelected:true, dueDate: date, showDueDate: this.convertDate2String(date)});
    }
    render() {
        console.log(" rendering inputtodo");
        return (
            <div className="row m-1 p-3">
                <div className="col col-11 mx-auto">
                    <form onSubmit={this.submitToDo}>
                        <div className="row bg-white rounded shadow-sm p-2 add-todo-wrapper align-items-center justify-content-center">

                            <div className="col">
                                <input onChange={evt => this.setState({ todo: evt.target.value })} 
                                className="form-control form-control-lg border-0 add-todo-input bg-transparent rounded" 
                                type="text" value={this.state.todo} placeholder="Get it done!" />
                            </div>
                            <div className="col-auto m-0 px-2 d-flex align-items-center">
                            <ReactTooltip />
                                <label className="text-secondary my-2 p-0 px-1 view-opt-label due-date-label">{this.state.showDueDate}</label>
                                <div onClick={()=>this.setState({openCalendar: !this.state.openCalendar})}>
                                {this.state.dueDateSelected ?
                                    <FontAwesomeIcon className="  text-primary calendarIcon" icon={['far', 'calendar-check']} data-tip="Set a due date"/> :
                                    <FontAwesomeIcon className=" text-primary calendarIcon " icon={['far', 'calendar-alt']} data-tip="Set a due date"/>}
                                </div>
                                {this.state.openCalendar && <div className="calendarDue">
                                    <DatePicker selected={this.state.dueDate} onChange={(date) => this.selectDate(date)} inline />
                                </div>}
                                {/* <i class="fa fa-calendar my-2 px-1 text-primary btn due-date-button" data-toggle="tooltip" data-placement="bottom" title="Set a Due date"></i>
                                <i class="fa fa-calendar-times-o my-2 px-1 text-danger btn clear-due-date-button d-none" data-toggle="tooltip" data-placement="bottom" title="Clear Due date"></i> */}
                            </div>
                            <div className="col-auto px-0 mx-0 mr-2">
                                <button type="submit" className="btn btn-primary">Just Do It!</button>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
export default memo(InputTodo);