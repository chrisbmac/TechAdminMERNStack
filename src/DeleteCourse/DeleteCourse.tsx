import React from 'react';
import '../App.scss';
import './DeleteCourse.scss';
//import "./../node_modules/@fortawesome/fontawesome-free/css/all.min.css";
import { Technology, ViewProps, AllCourses } from '../Tools/data.model';
import LoadingOverlay from '../LoadingOverlay/LoadingOverlay';
import { useHistory, useLocation, useParams} from "react-router-dom";
import {deleteJSONData} from "./../Tools/Toolkit";

const SUBMIT_TO_SERVER:string = "http://localhost:8080/delete";
//const SUBMIT_TO_SERVER:string = "http://ec2-54-198-207-67.compute-1.amazonaws.com/delete";
const DeleteCourse = ({technologies, all_courses,visible}:ViewProps):JSX.Element => {
    const history:any = useHistory();
    const route:string = useLocation().pathname;
    
    let { id } = useParams<{id:string}>();
    const delete_courseArray:(AllCourses | undefined) = all_courses.find(item => item._id === id);
    let { collection } = useParams<{collection:string}>();
    
    const delete_technologiesArray:(Technology | undefined) = technologies.find(item => item._id === id);
    
    // on delete
    const submitDelete = () => {
        let sendString:Object = {
            "type_collection" : collection,
            "id": id    
        }
        // string of json to send to server
        let sendIT:string = JSON.stringify(sendString);
        
        deleteJSONData(SUBMIT_TO_SERVER, sendIT, onSuccess,onError);
    };
    const onSuccess = (message:string):void => {
        console.log("it was success" + message);
    };
    const onError = (message:string):void => {
        //setCommentLoading(true);
        console.log("*** Error has occured during AJAX data transmission: " + message)};
    return (
        <div className="col" style={{display: (visible ? 'flex' : 'none')}}>
            
            {collection === "all_courses" ?
            <div className="form-group">
                <h3>Are you sure you want to delete the following <i>course</i>?</h3>
                <div className="form-group">
                
                    <h3>{delete_courseArray?.code} | {delete_courseArray?.name}</h3>
                </div>
            </div>
            :
            <div className="form-group">
                <h3>Are you sure you want to delete the following <i>technology</i>?</h3>
                <div className="form-group">
                    <h3>{delete_technologiesArray?.name}</h3>
                </div>
            </div>
            }
            
                <form>
                    <div className="form-group">
                        <input name="view" type="submit" onClick={() => {submitDelete();history.push("/");}} value="Delete"/>
                        <input name="view" type="submit" onClick={() => history.push("/")} value="Cancel"/>
                    </div>
                </form>
            
             
        
        </div>        
    )
}
export default DeleteCourse;