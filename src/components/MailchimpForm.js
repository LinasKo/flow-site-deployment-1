import React, {useState, useEffect} from 'react';
import MailchimpSubscribe from "react-mailchimp-subscribe"

const url = "https://gmail.us20.list-manage.com/subscribe/post?u=6df39fa7b2ff23e0ec3b88678&id=bb0ac376d8";

// simplest form (only email)
const SimpleForm = ({status, message, onSubmitted}) => {
    
    const [email, setEmail] = useState('');

    useEffect(() => {
        if(status === "success") clearFields();
      }, [status])
    
      const clearFields = () => {
        setEmail('');
      }

      const handleSubmit = (e) => {
        e.preventDefault();
        
        email &&

        email.indexOf("@") > -1 &&
        onSubmitted({
            EMAIL: email,

        });
       
    }


    return(
        <div>
            {/*<MailchimpSubscribe url={url}/>*/}
            {/* Form HTML with message after submit */}
            <form  onSubmit={(e) => handleSubmit(e)}>
            <h3 className="mc__title">
                {status === "success" ? "Success!" : null}
            </h3>
            {status === "sending" && (
                <div
                    className="mc__alert mc__alert--sending"
                >sending...</div>
            )}
            {status === "error" && (
                <div
                    className="mc__alert mc__alert--error"
                    dangerouslySetInnerHTML={{ __html: message }}
                />
            )}
            {status === "success" && (
                <div
                    className="mc__alert mc__alert--success"
                    dangerouslySetInnerHTML={{ __html: message }}
                />
            )}

            {status !== "success" ? (
                <div className='input-container'>
                    <input 
                       onChange={e => setEmail(e.target.value)}
                        type="email"
                        value={email}
                        placeholder="your@email.com"
                    />
                    <button 
                        type="submit" 
                        className="btn newsletter-btn hvr-sweep-to-right"
                        onClick={handleSubmit}
                    >Subscribe</button>
                </div>
                
            ): null }

            </form>
        </div>
    );
    

}

// use the render prop and your custom form
const MailchimpForm = () => (
  <MailchimpSubscribe
    url={url}
    render={({ subscribe, status, message }) => (
      <div>
        <SimpleForm onSubmitted=
            {formData => subscribe(formData)} 
            status={status}
            message={message}
        />
      </div>
    )}
  />
)

export default MailchimpForm;