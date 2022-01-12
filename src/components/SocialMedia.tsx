/**
 * Author: Tom Hayton
 * Desc: Composition based, reusable social media icons
 */

 import React from 'react';
 import styles from 'src/styles/misc.module.scss';

 import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
 import { faGithub, faLinkedin, faFacebook, faInstagram, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
 
 interface Props {

 }

 function SocialMedia(props: Props) {
   const links = {
     facebook: "",
     instagram: "",
     twitter: "",
     youtube: "",
   };

  return (
    <div className={`${styles.socMed} mob-visible`}>
      <a href={links.youtube} target="_blank"><FontAwesomeIcon icon={faYoutube} cursor="pointer" size="1x"/></a>
      <a href={links.instagram} target="_blank"><FontAwesomeIcon icon={faInstagram} cursor="pointer" size="1x"/></a>
      <a href={links.twitter} target="_blank"><FontAwesomeIcon icon={faTwitter} cursor="pointer" size="1x"/></a>
      <a href={links.facebook} target="_blank"><FontAwesomeIcon icon={faFacebook} cursor="pointer" size="1x"/></a>
    </div>
   );
 };
 
 export default SocialMedia;
 