import React from 'react'
import {Redirect} from 'react-router-dom'

class Signout extends React.Component {

    constructor(props){
        super(props)
        localStorage.removeItem("driverToken")
        localStorage.removeItem("driver")
        
    }
    render() {
        return <Redirect to="/" />
    }
}
export default Signout;