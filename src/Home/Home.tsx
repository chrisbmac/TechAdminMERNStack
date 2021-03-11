import React from 'react';
import '../App.scss';
import './Home.scss';
//import "./../node_modules/@fortawesome/fontawesome-free/css/all.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Technology, ViewProps, AllCourses } from '../Tools/data.model';
import LoadingOverlay from '../LoadingOverlay/LoadingOverlay';
import { useHistory, useLocation } from "react-router-dom";
//import {ViewProps} from "./../Tools/data.model";

const Home = ({technologies, all_courses,visible}:ViewProps):JSX.Element => {
    const history:any = useHistory();
    
    // Home component 
    return (
        <div className="box" style={{display: (visible ? 'flex' : 'none')}}>
            
            <div>
                <div className="techs">
                    <div><h4>Technologies</h4>
                        <input name="view" type="submit" onClick={() => history.push("/AddCourse/technologies")} value="+"/>
                    </div>
                        {technologies.map((data:Technology, n:number):JSX.Element => {
                            return (
                                <div key={n}>
                                    <input name="view" type="submit" onClick={() => history.push(`/Delete/${data._id}/technologies`)} value="Delete"/>
                                    <input name="view" type="submit" onClick={() => history.push(`/EditTechnology/${data._id}`)} value="Edit"/>
                                    <p>{data.name}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="course">
                    <div><h4>Courses</h4>
                        <input name="view" type="submit" onClick={() => history.push("/AddCourse/all_courses")} value="+"/>
                    </div>
                
                    {all_courses.map((data:AllCourses, n:number):JSX.Element => {
                        return (
                            <div key={n}>
                                <input name="view" type="submit" onClick={() => history.push(`/Delete/${data._id}/all_courses`)} value="Delete"/>
                                <input name="view" type="submit" onClick={() => history.push(`/EditCourse/${data._id}`)} value="Edit"/>
                                <p>{data.code} | {data.name}</p>
                            </div>
                        );
                    })}
                
                </div>
        </div>
      
    )
}
export default Home;