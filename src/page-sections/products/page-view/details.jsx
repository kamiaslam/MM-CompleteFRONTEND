import { useState } from 'react'; // MUI

import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import ProductView from '../product-view';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext'; // CUSTOM PAGE SECTION COMPONENTS

import ProductReviews from '../product-review';
import ProductDescription from '../ProductDescription';
export default function ProductDetailsPageView() {
  const [tab, setTab] = useState('1');

  const tabChange = (_, value) => setTab(value);

  return <div className="pt-2 pb-4">
      <Grid container spacing={3}>
        <Grid size={12}>
          <ProductView />
        </Grid>

        <Grid size={12}>
          <Card>
            
          </Card>
        </Grid>
      </Grid>
    </div>;
}