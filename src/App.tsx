import React from 'react';
import './App.scss';
import "./../node_modules/@fortawesome/fontawesome-free/css/all.min.css";

// NPM Imports
import { Route, Switch } from 'react-router-dom';
import {JSONData, Technology, AllCourses} from "./Tools/data.model";


// Component Imports
import Home from "./Home/Home";
import AddCourse from "./AddCourse/AddCourse";
import DeleteCourse from './DeleteCourse/DeleteCourse';
import EditCourse from './EditCourse/EditCourse';
import EditTechnology from './EditTechnology/EditTechnology';
import Error from './Error/Error';

//From toolkit
import LoadingOverlay from './LoadingOverlay/LoadingOverlay';
import { getJSONData } from "./Tools/Toolkit";

// Retrieval Data
const COURSE_SCRIPT:string = "http://localhost:8080/get";
//const COURSE_SCRIPT:string = "http://ec2-54-198-207-67.compute-1.amazonaws.com/get";
const App = ():JSX.Element => {

  //Data from server recieve both collections in one get
  const onResponse = (result:JSONData):void => {
    // data received from Web API
    //console.table(result);
    setTechnologies(result.technologies || []);
    setAll_Courses(result.all_courses || []);
    setLoading(false);
  };
  //For error
  const onError = (message:string):void => console.log("*** Error has occured during AJAX data transmission: " + message);
  // ----------------------------------- setting state variables
  const [technologies, setTechnologies] = React.useState<Technology[]>([]);
  const [all_courses, setAll_Courses] = React.useState<AllCourses[]>([]);
  // Loading
  const [loading, setLoading] = React.useState<boolean>(true); 
  // Routing and history

  React.useEffect(():void => {
    getJSONData(COURSE_SCRIPT, onResponse, onError);
  }, []);
  // ----------------------------------- rendering to the DOM
  return (
    <div className="main">
      <LoadingOverlay bgColor="#2fa77f" spinnerColor="#FFFFFF" enabled={loading} />
      
      <div className="header">
        <div className="header__title">_Technology Roster : Administration</div>
      </div>
      {
        (technologies.length > 0 && all_courses.length > 0)? 
      <Switch>
        {/*For Home - 1*/}
          <Route path="/" exact render={():JSX.Element =>
            <React.Fragment>
              <Home technologies={technologies} all_courses={all_courses} visible={true}/>
              <AddCourse technologies={technologies} all_courses={all_courses} visible={false}/>
              <DeleteCourse technologies={technologies} all_courses={all_courses} visible={false}/>
              <EditCourse technologies={technologies} all_courses={all_courses} visible={false}/>
            </React.Fragment>
          }
          ></Route>
          {/*For Add - 2*/}
          <Route path="/AddCourse/:collection" render={():JSX.Element =>
            <React.Fragment>
              <Home technologies={technologies} all_courses={all_courses} visible={false}/>
              <AddCourse technologies={technologies} all_courses={all_courses} visible={true}/>
              <DeleteCourse technologies={technologies} all_courses={all_courses} visible={false}/>
              <EditCourse technologies={technologies} all_courses={all_courses} visible={false}/>
              <EditTechnology technologies={technologies} all_courses={all_courses} visible={false}/>
            </React.Fragment>
          }
          ></Route>
          {/*For Delete - 3*/}
          <Route path="/Delete/:id/:collection" render={():JSX.Element =>
            <React.Fragment>
              <Home technologies={technologies} all_courses={all_courses} visible={false}/>
              <AddCourse technologies={technologies} all_courses={all_courses} visible={false}/>
              <DeleteCourse technologies={technologies} all_courses={all_courses} visible={true}/>
              <EditCourse technologies={technologies} all_courses={all_courses} visible={false}/>
              <EditTechnology technologies={technologies} all_courses={all_courses} visible={false}/>
            </React.Fragment>
          }
          ></Route>
          {/*For Edit Course - 4*/}
          <Route path="/EditCourse/:id" render={():JSX.Element =>
            <React.Fragment>
              <Home technologies={technologies} all_courses={all_courses} visible={false}/>
              <AddCourse technologies={technologies} all_courses={all_courses} visible={false}/>
              <DeleteCourse technologies={technologies} all_courses={all_courses} visible={false}/>
              <EditCourse technologies={technologies} all_courses={all_courses} visible={true}/>
              <EditTechnology technologies={technologies} all_courses={all_courses} visible={false}/>
            </React.Fragment>
          }
          ></Route>
          {/*For Edit Technology - 5*/}
          <Route path="/EditTechnology/:id" render={():JSX.Element =>
            <React.Fragment>
              <Home technologies={technologies} all_courses={all_courses} visible={false}/>
              <AddCourse technologies={technologies} all_courses={all_courses} visible={false}/>
              <DeleteCourse technologies={technologies} all_courses={all_courses} visible={false}/>
              <EditCourse technologies={technologies} all_courses={all_courses} visible={false}/>
              <EditTechnology technologies={technologies} all_courses={all_courses} visible={true}/>
            </React.Fragment>
          }
          ></Route>
          <Route component={Error} />
      </Switch>
    :
    <div>No Data To Display</div>
    }

      <div className="footer">Web App powered by <a href="http://mern.io" target="_blank">MERN Stack</a></div>
    </div>
  );
}

export default App;
