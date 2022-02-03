import React, { useState } from "react";
import emailjs, {init} from 'emailjs-com';


import app_store from './assets/app_store.png';
import play_store from './assets/play_store.png';
import mobile from './assets/two_mobiles.png';

const Contact = () =>{
    // Contact us form to send message using mailjs.com 
    const [name, setName ] = useState('');
    const [email, setEmail ] = useState('');
    //const [about, setAbout ] = useState('');
    const [message, setMessage ] = useState('');
    const [emailSend, setEmailSent ] = useState(false);


    const submit = () =>{
        if(name && email && message){
            //TODO - send mail
            const serviceId = 'service_oajgxl5';
            const templateId = 'template_sj5ibzi';
            init("user_2w1cM9tauR7ftwZQiJLfr");
            const templateParams = {
                name,
                email,
                //about,
                message
            };

            emailjs.send(serviceId, templateId, templateParams)
                .then(response => console.log(response))
                .then(error => console.log(error));

            setName('');
            setEmail('');
            //setAbout('');
            setMessage('');
            setEmailSent(true);
        }else{
            alert('Please fill in all field');
        }
    }

    //const isValidEmail = email => {
         //const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        //return regex.test(String(email).toLowerCase());
    //};

    return(
            <div className='section fp-auto-height-responsive' id='contact-section'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-6' id='contact-section_form'>
                            <h1>Drop us a line</h1>
                            <p>Get in touch! We'll get back in a glimpse.</p>
                            <div className='form-section'>
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input 
                                        className="form-control" 
                                        type='text' 
                                        placeholder='Enter your name' 
                                        value={name} 
                                        onChange={e => setName(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">About you</label>
                                    <select className="form-select" aria-label="Default select example">
                                        <option defaultValue>Select from here</option>
                                        <option 
                                            value=""
                                            //onChange={e => setAbout(e.target.value)}
                                        >Student
                                        </option>
                                        <option                                         
                                            value=""
                                            //onChange={e => setAbout(e.target.value)}
                                        >Instructor
                                        </option>
                                        <option 
                                            value=""
                                            //onChange={e => setAbout(e.target.value)}
                                        >Investor
                                        </option>
                                        <option 
                                            value=""
                                            //onChange={e => setAbout(e.target.value)}
                                        >Other
                                        </option>
                                    </select>
                                </div> 
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input 
                                        className="form-control" 
                                        type="email" 
                                        placeholder="Your email address" 
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </div> 
                                <div className="mb-3">
                                    <label className="form-label">Message</label>
                                    <textarea 
                                        className="form-control" 
                                        placeholder="Enter your message" 
                                        id="message"
                                        row="5"
                                        value={message}
                                        onChange={e => setMessage(e.target.value)}
                                    >
                                        
                                    </textarea>
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn contact-btn"
                                    onClick={submit}
                                >
                                Send Message
                                </button>
                                <span className={emailSend ? 'visible' : 'hidden'}>Thank you for your message, we will be in touch in no time!</span>
                            </div>
                            <div className='social-media'>
                                <a className='hvr-radial-out' href='mailto:me@esraa.io'>
                                    <i className="fa fa-envelope" aria-hidden="true"></i>
                                </a>
                                <a className='hvr-radial-out' href='https://facebook.com/'>
                                    <i className="fa fa-facebook" aria-hidden="true"></i>
                                </a>
                                <a className='hvr-radial-out' href='https://twitter.com/'>
                                    <i className="fa fa-twitter" aria-hidden="true"></i>
                                </a>
                                <a className='hvr-radial-out' href='https://instgram.com/'>
                                    <i className="fa fa-instagram"></i>
                                </a>
                                <a className='hvr-radial-out' href='https://linkedin.com/'>
                                    <i className="fa fa-linkedin" aria-hidden="true"></i>
                                </a>
                            </div>
                        </div>
                        <div className='col-md-6 align-self-center' id='contact-section_img'>
                            <div className='contact-section_img__top'>
                                <img className='img-fluid' src={mobile} alt=' two mobile' />
                            </div>
                            <div className='contact-section_img__bottom'>
                                <p>Available on stores soon</p>
                                <a href="/"><img className='img-fluid' src={app_store} alt='app store'/></a>
                                <a href="/"><img className='img-fluid' src={play_store} alt='google play'/></a>
                            </div>
                        </div>


                    </div>
                    <div className='row'>
                        <div className='copyright'>All rights reserved. letsflow ©2022</div>
                    </div> 
                </div>
            </div>
    );
}

export default Contact;