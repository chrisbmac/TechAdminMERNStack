import React from 'react';
import '../App.scss';
import './EditCourse.scss';
//import "./../node_modules/@fortawesome/fontawesome-free/css/all.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import { useParams, useHistory } from 'react-router-dom';
import {sendJSONData} from "./../Tools/Toolkit";
import { ViewProps, AllCourses} from '../Tools/data.model';
import LoadingOverlay from '../LoadingOverlay/LoadingOverlay';


//const SUBMIT_TO_SERVER:string = "http://ec2-54-198-207-67.compute-1.amazonaws.com/put";
const SUBMIT_TO_SERVER:string = "http://localhost:8080/put";
const EditCourse = ({technologies, all_courses, visible}:ViewProps):JSX.Element => {
    // history
    const history:any = useHistory();

    // Params
    let { id } = useParams<{id:string}>();
    let edit_Course:(AllCourses | undefined) = all_courses.find(item => item._id === id) ;
    let [state_category_name, setState_New_Category_Name] = React.useState<string | undefined>("");
    
    // form validation boolean
    let [state_form_Validation, setState_form_validation] = React.useState<boolean>(true);
    const new_category_name = (e:any):void => {
        setState_New_Category_Name(e.target.value);
        formValidation();
    };

    const formValidation = ():void => {
        if(state_category_name && state_category_name.trim()){
            state_form_Validation = false;
        } else {
            state_form_Validation = true;
        }
        setState_form_validation(state_form_Validation);
    };

    // send to server 
    const submitEdit = ():void => {
        
        console.log("edit" + edit_Course?._id + "this is _id" + id + " " + state_category_name);
        let my:string = id;
        // object for sending data to server
        let sendString:Object = {
            "id": my,
            "code": edit_Course?.code,
            "name": state_category_name,
            "courses":
                [   
                    {
                        "code": edit_Course?.code,
                        "name": state_category_name
                    }
                ]    
            }
        console.log(sendString);
        // json string to send
        let sendIT:string = JSON.stringify(sendString);
        
        sendJSONData(SUBMIT_TO_SERVER, sendIT, onSuccess,onError);    
    };
    
    const onSuccess = (message:string):void => {
        console.log("it was success" + message);
    };
    const onError = (message:string):void => {
        //setCommentLoading(true);
        console.log("*** Error has occured during AJAX data transmission: " + message)};
        
    return (
        <div className="form-group" style={{display: (visible ? 'flex' : 'none')}}>
            <h3>Edit Course</h3>
            <form>
            <div className="form-group">
                Course Code:
                <input type="text" value={edit_Course?.code}/>
                <input id="editCourse_placeHolder_courseName" type="text" placeholder={edit_Course?.name} onChange={new_category_name}/> 
            </div>
            <div className="form-group">
                <input name="view" disabled={state_form_Validation} type="submit" onClick={() => {submitEdit();history.push("/");}} value="Edit"/>
                <input name="view" type="submit" onClick={() => history.push("/")} value="Cancel"/>
            </div>
            </form>
        </div>
    )
}
export default EditCourse;