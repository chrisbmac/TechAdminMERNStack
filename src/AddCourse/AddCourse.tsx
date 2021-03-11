import React from 'react';
import '../App.scss';
import './AddCourse.scss';
//import "./../node_modules/@fortawesome/fontawesome-free/css/all.min.css";
import { useParams , useHistory} from 'react-router-dom';
import {ViewProps, Course, AllCourses} from "../Tools/data.model";
import LoadingOverlay from '../LoadingOverlay/LoadingOverlay';
import {sendJSONData} from "./../Tools/Toolkit";

//const SUBMIT_TO_SERVER:string = "http://ec2-54-198-207-67.compute-1.amazonaws.com/add";
const SUBMIT_TO_SERVER:string = "http://localhost:8080/add";
const AddCourse = ({technologies, all_courses,visible}:ViewProps):JSX.Element => {
    const history:any = useHistory();

    let { collection } = useParams<{collection:string}>();
    //console.log("This is collection in add" + collection);
    // for adding course
    let [state_course_name ,setState_NewAdd_Course_Name] = React.useState<string>("");
    let [state_course_code ,setState_NewAdd_Course_Code] = React.useState<string>("");
    
    // for adding tech
    let [state_tech_name, setState_tech_name] = React.useState<string>("");
    let [state_tech_description, setState_tech_description] = React.useState<string>("");
    let [state_tech_difficulty, setState_tech_difficulty] = React.useState<number>(1);
    let [state_tech_courseArray, setState_tech_courseArray] = React.useState<Course[]>([]);

    // form validation boolean
    let [state_form_Validation, setState_form_validation] = React.useState<boolean>(true);
    
    //--------------On btn submit - send data to server as json
    const submitAdd = () => {
        // Send one object for both collections and pick out what we need in server
        
        let sendString:Object = {
            "collection_type": collection,
            "code": state_course_code,
            "name": state_course_name,
            "techName": state_tech_name,
            "description": state_tech_description,
            "difficulty": state_tech_difficulty,
            "courses":
                state_tech_courseArray
        };
        // string of json to send to server
        let sendIT:string = JSON.stringify(sendString);
        
        sendJSONData(SUBMIT_TO_SERVER, sendIT, onSuccess,onError);    
    };

    const onSuccess = (message:string):void => {
        console.log("it was success" + message);
    };
    const onError = (message:string):void => {
        //setCommentLoading(true);
        console.log("*** Error has occured during AJAX data transmission: " + message)};

    //------------On change events/ handle new values to add for course code and name
    // for adding courses
    const add_course_name = (e:any):void => {
        setState_NewAdd_Course_Name(e.target.value);
        checkFormInputCourses();
    };

    const add_course_code = (e:any):void => {
        setState_NewAdd_Course_Code(e.target.value);
        checkFormInputCourses();
    };
    const checkFormInputCourses = ():void => {
        state_form_Validation = true;
        if(state_course_name && state_course_name.trim() && state_course_code && state_course_code.trim()) {
            state_form_Validation = false;
            
        } else {
            state_form_Validation = true;
           
        }
        setState_form_validation(state_form_Validation);
    };

    //---------------------for adding techs
    const add_tech_name = (e:any):void => {
        setState_tech_name(e.target.value);
        checkFormInput();
    };
    const add_tech_description = (e:any):void => {
        setState_tech_description(e.target.value);
        checkFormInput();
    };
    const add_tech_difficulty = (e:any):void => {
        setState_tech_difficulty(e.target.value);
        checkFormInput();
    };
    const add_tech_courses = (e:any):void => {
        
        let cb_value = e.target.value.split("|");
        let courseToAdd = {
            "code": cb_value[0],
            "name": cb_value[1]
        };
        let checkbox:any = e.target;
        if(checkbox.checked){
            state_tech_courseArray.push(courseToAdd);
        } else {
            state_tech_courseArray = state_tech_courseArray.filter(item => item.code !== courseToAdd.code);
            setState_tech_courseArray(state_tech_courseArray);
        }
        checkFormInput();
    };
    
    const checkFormInput = ():void => {
        state_form_Validation = false;
        if(state_tech_name && state_tech_name.trim() && state_tech_description && state_tech_description.trim() && state_tech_difficulty > 0 && state_tech_difficulty < 6 && state_tech_courseArray.length > 0){
            state_form_Validation = false;     
        } else {
            state_form_Validation = true; 
        }
        setState_form_validation(state_form_Validation);
    };

    return (
        <div className="container" style={{display: (visible ? 'flex' : 'none')}}>
            {collection === "all_courses" ? 
            <div className="col">
                <h3>Add New Course:</h3>
                <form>
                    <div className="form-group">
                        <strong>Course Code:</strong>
                        <input className="form-control" id="editCourse_placeHolder_courseName" type="text" placeholder="Enter New Course Code" onChange={add_course_code}/>
                    </div>
                    <div className="form-group">
                        <strong>Course Name:</strong>
                        <input className="form-control" id="editCourse_placeHolder_courseName" type="text" placeholder="Enter New Course Name" onChange={add_course_name}/>
                    </div>
                    <div className="form-group">
                        <input name="addcpurse" disabled={state_form_Validation} type="submit" onClick={() => {submitAdd();history.push("/");}} value="Add"/>
                        <input name="addcourse" type="submit" onClick={() => history.push("/")} value="Cancel"/>
                    </div>
                </form>
            </div>
            :
            <div className="col">
                <h3>Add New Technology:</h3>
                <form>
                    <div className="form-group">
                        <strong>Name:</strong>
                        <input className="form-control" type="text" placeholder="Enter a name" onChange={add_tech_name} onClick={add_tech_name}/>
                    </div>
                    <div className="form-group">
                        <strong>Description:</strong>
                        <textarea className="form-control" placeholder="Enter a description" onChange={add_tech_description} onClick={add_tech_description}/>
                    </div>
                    <div className="form-group">
                        <strong>Difficulty:</strong>
                        <input className="form-control" type="number" defaultValue="1" min="1" max="5" onChange={add_tech_difficulty} onClick={add_tech_difficulty}/>
                    </div>
                    <div className="form-group"> <strong>Select new or remove courses</strong></div>
                        {all_courses.map((data:AllCourses, n:number):JSX.Element => {
                            return (
                            <div className="form-check" key={n}>
                                <input  name="editTechs" type="checkbox" value={data.code + "|" + data.name}
                                onClick={add_tech_courses}
                                />{data.code} | {data.name}
                            </div>
                            );
                        })}
                    <div className="form-group">
                        <input name="editTechs" type="submit" disabled={state_form_Validation} onClick={() => {submitAdd();history.push("/");}} 
                        value="Add"/>
                        <input name="editTechs" type="submit" value="Cancel" onClick={() => history.push("/")}/>
                    </div>
                </form>
            </div>
        }
        </div>
    )
}
export default AddCourse;