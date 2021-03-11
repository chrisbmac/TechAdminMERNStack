import React, { useEffect } from 'react';
import '../App.scss';
import './EditTechnology.scss';
//import "./../node_modules/@fortawesome/fontawesome-free/css/all.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams, useHistory, useLocation, } from 'react-router-dom';
import {sendJSONData} from "./../Tools/Toolkit";
import { Technology, ViewProps, AllCourses, Course } from '../Tools/data.model';
import LoadingOverlay from '../LoadingOverlay/LoadingOverlay';

const SUBMIT_TO_SERVER:string = "http://localhost:8080/put";
//const SUBMIT_TO_SERVER:string = "http://ec2-54-198-207-67.compute-1.amazonaws.com/put";
const EditTechnology = ({technologies, all_courses, visible}:ViewProps):JSX.Element => {
    const history:any = useHistory();
    
    //Params
    //Techs
    let { id } = useParams<{id:string}>();
    
    let edit_Technology:(Technology | undefined) = technologies.find(item => item._id === id) ;
    //let existing_Technology_Courses:()

    let [state_technology_name, setState_New_technology_Name] = React.useState<string | undefined>("");
    let [state_technology_description, setState_New_technology_Description] = React.useState<string | undefined>("");
    let [state_technology_difficulty, setState_New_technology_Difficulty] = React.useState<number>(1);
    let existingCourses_ForTechs:(Course[] | undefined) = edit_Technology?.courses.map(item => item);
    
    
    let [state_array_items, setState_array_items] = React.useState<Course[] | undefined>([]);

    // form validation boolean
    let [state_form_Validation, setState_form_validation] = React.useState<boolean>(true);

    // form validation
    const checkFormInput = ():void => {
        state_form_Validation = true;
        if(state_technology_name && state_technology_name.trim() && state_technology_description && state_technology_description.trim() && state_technology_difficulty > 0 && state_technology_difficulty < 6
        && Array.isArray(state_array_items) && state_array_items?.length){
            state_form_Validation = false;     
        } else {
            state_form_Validation = true; 
        }
        setState_form_validation(state_form_Validation);
    };

//---------------
    const new_technology_name = (e:any):void => {
        
        setState_New_technology_Name(e.target.value);

        checkFormInput();
    };

    const new_technology_description = (e:any):void => {
        
        setState_New_technology_Description(e.target.value);
        checkFormInput();
    };
    
    const new_technology_difficulty = (e:any):void => {
        
        setState_New_technology_Difficulty(e.target.value);
        checkFormInput();
    };
    const cb_technologies_edit_courses = (e:any):void => {
        
        let checkbox:any = e.target;
    
        let mySplit:string = e.target.value.split("|");
        let cb_ItemToAdd:Course = { 
            "code": mySplit[0],
            "name": mySplit[1]

        };
        if(checkbox.checked){
           
            state_array_items?.push(cb_ItemToAdd);
        } else {
            state_array_items = state_array_items?.filter(item => item.code !== cb_ItemToAdd.code);
            
        } 
        console.log(state_array_items);
        setState_array_items(state_array_items); 
        checkFormInput(); 
    };
   
// ------------- for sending data to server***
    const submitEdit = () => {
        
        let my:string = id;
        
        let sendString:Object = {
            "id": my,
            "type_collection" : "technologies",
            "name": state_technology_name,
            "description": state_technology_description,
            "difficulty": state_technology_difficulty,
            "courses": 
                    state_array_items 
        };

        let sendIT:string = JSON.stringify(sendString);
        
        sendJSONData(SUBMIT_TO_SERVER, sendIT, onSuccess,onError);   
        
    };
    
    const onSuccess = (message:string):void => { 
        console.log("it was success" + message);
    };
    const onError = (message:string):void => {
        console.log("*** Error has occured during AJAX data transmission: " + message)};

return (
    
        <div className="container" style={{display: (visible ? 'flex' : 'none')}}>
            <div className="col">
                <h3>Edit Technology</h3>
                <form id="editTechs">
                <div className="form-group">
                    <div>
                        <strong>Name:</strong>
                        <input className="form-control" name="editTechs" type="text" placeholder={edit_Technology?.name} onChange={new_technology_name}/>
                    </div>
                    <div className="form-group">
                        <strong>Description:</strong>
                        <textarea className="form-control" name="editTechs" placeholder={edit_Technology?.description} onChange={new_technology_description}/>
                    </div>
                    <div className="form-group">
                        <strong>Difficulty:</strong>
                        <input className="form-control" name="editTechs" type="number" min="1" max="5" placeholder={edit_Technology?.difficulty.toString()} onChange={new_technology_difficulty}/>
                    </div>
                </div>
                
                <strong>Previous Courses:</strong>
                {existingCourses_ForTechs?.map((tech:Course, n:number):JSX.Element => {
                    return (
                        <div key={n}>
                            {tech.code} | {tech.name}
                        </div>

                    );
                })}
                <div className="form-group"> <strong>Select courses</strong></div>
                {all_courses.map((data:AllCourses, n:number):JSX.Element => {
                    return (
                    <div key={n}>
                        <input name="editTechs" type="checkbox" value={data.code + "|" + data.name}
                        onClick={cb_technologies_edit_courses}
                        />{data.code} | {data.name}
                    </div>
                    );
                })}
                <div className="form-group">
                    <input name="editTechs" type="submit" disabled={state_form_Validation} onClick={() => {submitEdit();history.push("/");}} value="Edit"/>
                    <input name="editTechs" type="submit" value="Cancel" onClick={() => history.push("/")}/>
                    
                </div>
                
                </form>
            </div>
        </div>
        
    )
}
export default EditTechnology;