import { Fragment, useEffect, useState } from 'react';
import Card from '@mui/material/Card'; // CUSTOM COMPONENTS

import InfoForm from './info-form';
import UserInfo from './user-info'; // STYLED COMPONENTS

import { CoverPicWrapper } from './styles';
import { getProfileList } from '../../../api/axiosApis/get';
import { useLoader } from '../../../contexts/LoaderContext';
export default function BasicInformation() {
  const [adminData, setAdminData] = useState(null);
  // const { showLoader, hideLoader } = useLoader(); 
  

    useEffect(() => {
      getProfileList().then((resp) => {
        setAdminData(resp?.data);
      });
    }, []);
  return <Fragment>
      <Card sx={{
      padding: 3,
      position: 'relative'
    }}>
        {
        /* COVER IMAGE SECTION */
      }
        <CoverPicWrapper>
          <img width="100%" height="100%" alt="Team Member" src="/static/cover/user-cover-pic.png" />
        </CoverPicWrapper>

        {
        /* USER INFO SECTION */
      }
        <UserInfo {...{adminData}} />
      </Card>

      {
      /* BASIC INFORMATION FORM SECTION */
    }
      <InfoForm {...{adminData}} />
    </Fragment>;
}