import React, { useContext, useMemo } from 'react';
import styles from 'src/styles/misc.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {GlobalCtx} from '../contexts/GlobalCtx';
 
interface Props {
  iconSize?: FAIconSizePreset
};

function SocialMedia(props: Props) {
  const { iconSize = "1x" } = props;

  const { socialMediaObjects } = useContext(GlobalCtx);
  const socialIcons = useMemo(() => {
    return socialMediaObjects.map(socialMediaObj => {
      const { handle, link, icon } = socialMediaObj;
      return <a href={link} target="_blank" key={handle}><FontAwesomeIcon icon={icon} cursor="pointer" size={iconSize}/></a>
    })
  }, [socialMediaObjects])

  return (
    <div className={`${styles.socMed} mob-visible`}>
      {socialIcons}
    </div>
  );
};

export default SocialMedia;
 