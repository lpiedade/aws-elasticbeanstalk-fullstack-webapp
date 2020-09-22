import React from "react";
import { Modal, Button } from "react-bootstrap";
import Loader from "react-loader";

export default class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {name: '', email: '', phone: '', successMessage: '', 
                        errorMessage:'', isOpen:false, loaded: true};
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
    }

    handleNameChange(event) {
        event.preventDefault();
        this.setState({name: event.target.value});
    }

    handleEmailChange(event) {
        event.preventDefault();
        this.setState({email: event.target.value});
    }

    handlePhoneChange(event) {
        event.preventDefault();
        this.setState({phone: event.target.value});
    }
    handleErrors(response) {
        if (!response.ok) {
            console.log(response.statusText);
            throw Error(response.statusText);
        }
        return response;
    }
    // this handler would calls the sign up API for updating the user details in the backend
    signUp = () => {
        this.setState({successMessage : ''});
        this.setState({errorMessage : ''});  
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify ({
                name: this.state.name.toString(),
                email: this.state.email.toString(),
                phone: this.state.phone.toString()
            })
        };
        this.setState({loaded: false});
        fetch(process.env.REACT_APP_DB_SIGNUP_API, requestOptions)
        //handle any non-network errors
        .then(this.handleErrors)
        .then( 
            // api success
             (response) => {
              // if d/b update is successful, send an email   
              this.signupSns() 
              
            },
            // api error
            (error) => {
                this.setState({loaded: true});
                console.log(error);
                this.setState({errorMessage : 'An error occured. Please try again'})
            }
        )
        //catch status check error 
        .catch((error) => {
            this.setState({loaded: true});
            this.setState({errorMessage : 'An error occured. Please try again'});
        }
      )
    };
    // this calls the signupsns API to notify via a SNS topic 
    signupSns = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify ({
                name: this.state.name.toString(),
                email: this.state.email.toString()
            })
        };
        fetch(process.env.REACT_APP_SNS_SIGNUP_API, requestOptions)
        // handle non-network errors
        .then(this.handleErrors)
        .then( 
            // api sucess
            (response) => { 
              this.setState({loaded: true});
              this.openModal();
            },
            // api error
            (error) => {
                console.log(error);
                this.setState({loaded: true});
                this.setState({errorMessage : 'An error occured. Please try again'})
            }
        )
        // catch status check error
        .catch((error) => {
            this.setState({loaded: true});
            this.setState({errorMessage : 'An error occured. Please try again'})
         }
        )
    };
    
    openModal = () => this.setState({ isOpen: true });
    closeModal = () => this.setState({ isOpen: false });
    
    render() {
        return(
            <div className="container">
                    <Loader loaded={this.state.loaded}></Loader>
                    <div className="form-group row">
                    <label className="col" htmlFor="name">Name</label>
                    <input type="text" className="form-control col-9" name="name" 
                        placeholder="Your name" value={this.state.name} onChange={this.handleNameChange}/>
                    </div>
                    <div className="form-group row">
                    <label className="col">Email</label>
                    <input type="text" className="form-control col-9" name="Email" placeholder="Your Email Address"
                        value={this.state.email} onChange={this.handleEmailChange}/>
                    </div>
                    <div className="form-group row">
                    <label className="col" >Phone Number</label>
                    <input type="text" className="form-control col-9" name="Email" placeholder="Your Phone Number"
                        value={this.state.phone} onChange={this.handlePhoneChange}/>
                    </div>
                    <button type="button" disabled={!this.state.email || !this.state.name || !this.state.phone} className="btn btn-primary btn-lg" 
                            onClick={this.signUp}>Sign Up
                    </button>
                    <div className="row">
                        <div>{this.state.successMessage}</div>
                        <div>{this.state.errorMessage}</div>
                    </div>
                    <Modal show={this.state.isOpen} onHide={this.closeModal} >
                        <Modal.Header closeButton>
                            <h3>
                                <Modal.Title>Registered</Modal.Title>
                            </h3>
                        </Modal.Header>
                        <Modal.Body>Hey {this.state.name}, you have been successfully registered for this product</Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={this.closeModal}>Close</Button>
                        </Modal.Footer>
                    </Modal>
            </div>
        );
    }

}   