import React from "react";
import MailchimpForm from "./MailchimpForm";

import firstImg from './assets/1.png';
import firstImgRight from './assets/2.png';


const Quote = () => {
  return (
    <div className='section fp-auto-height-responsive' id='subscribe'>
      <div className='container'>
        <div className="row">
          <div className="col-md-3" id="left-img">
            <img src={firstImg} alt='Fisrt' className='img-fluid' />
          </div>
          <div className="col-md-6" id="quote-section">
            <div id='quote-section__text'>
              <div className='quote-txt'>
                <p>We have created the closest virtual experience to live classes,
                  designed for <span>yogis of all levels</span> who need <span>feedback </span>
                  and <span>reassurance</span> on whether they are moving correctly whilst practising.</p>

                <p>This platform will help users <span>progress</span> and <span>sustain</span> their practice, comfortably and affordably,
                  <span> without an instructor</span>.</p>
              </div>
              <div className='quote-author'>
                <h4 className='name'>Malak Elbahtimy</h4>
                <h6>Co-founder & CEO</h6>
              </div>
            </div>
            <div className='newsletter' id='quote-section__newsletter'>
              <MailchimpForm />
            </div>
          </div>
          <div className="col-md-3" id="right-img">
            <img src={firstImgRight} alt='second' className='img-fluid' />
          </div>
        </div>
      </div>

    </div>
  )
}

export default Quote;