import React from 'react';
import "./Error.scss";

const Error = ():JSX.Element => {
    return (
        <div className="error">
            <div className="error__frown">:(</div>
            <div className="error__message">404 Error - This routing does not exist</div>
        </div>
    );
}

export default Error;