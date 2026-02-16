import { Component } from "react";

class ErrorBoundaries extends Component {
    state = {
        error : ''
    }

    static getDerivedStateFromError (error){
        return{
            error: error
        }
    }

    componentDidCatch(error, info){
        console.log('error is : ', error)
        console.log('info is: ', info);
    }
    
    render (){
    if(this.state.error){
        return (
            <div>
                <h2>Some Error Occured....</h2>
                <p>Here is what happened :{this.state.error.message}</p>
            </div>
        )
    }
    return this.props.children;
    }
}
export default ErrorBoundaries;