import {useState, memo } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function ViewOptions({viewOptions, sendParentFilterType, sendParentDateType, sendParentSortAscending }){
    // const [sortAscending, setSortAscending]=useState(true);
    // const [dateType, setDateType]=useState("added-date-asc");
    // const [filterType, setFilterType]=useState("all");
    console.log(" ViewOptions is about to rendering again");
    return (       
        <div className="row m-1 p-3 px-5 justify-content-end">
            <div className="col-auto d-flex align-items-center">
                <label className="text-secondary pr-2 my-2 mx-1 view-opt-label">Filter</label>
                <select className="form-select form-select-sm my-1 select-menu" value={viewOptions.filterType} onChange={(e)=>sendParentFilterType(e.target.value)}>
                    <option value="all">All</option>
                    <option value="completed">Completed</option>
                    <option value="active">Active</option>
                    <option value="has-due-date">Has due date</option>
                </select>
            </div>
            <div className="col-auto d-flex align-items-center px-1 pr-3">
                <label className="text-secondary m-2 pr-2 view-opt-label">Sort</label>
                <select className="form-select form-select-sm  my-1 select-menu" value={viewOptions.dateType} onChange={ e=>sendParentDateType(e.target.value)}>
                    <option value="added-date">Added date</option>
                    <option value="due-date">Due date</option>
                </select>
                <div onClick={()=>sendParentSortAscending(!viewOptions.sortAscending)}>
                    {viewOptions.sortAscending? <FontAwesomeIcon icon="sort-amount-down-alt" className="text-info mx-2"/>
                    :<FontAwesomeIcon icon="sort-amount-down" className="text-info mx-2"/> }
                </div>
               
                {/* <i className="fa fa fa-sort-amount-asc text-info btn mx-0 px-0 pl-1" data-toggle="tooltip" data-placement="bottom" title="Ascending"></i>
                <i className="fa fa fa-sort-amount-desc text-info btn mx-0 px-0 pl-1 d-none" data-toggle="tooltip" data-placement="bottom" title="Descending"></i> */}
            </div>
        </div>
    )

}

export default memo(ViewOptions);