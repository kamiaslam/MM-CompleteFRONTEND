import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import FlexBox from '@/components/flexbox/FlexBox';
import { H6, Paragraph, Small } from '@/components/typography';
import { useLoader } from "@/contexts/LoaderContext";
import { FormWrapper, Dot } from './styles';
import { updatePassword } from '../../../api/axiosApis/post';
import toast from 'react-hot-toast';

const REQUIREMENTS = [
  'Minimum 8 characters long - the more, the better',
  'At least one lowercase character',
  'At least one uppercase character',
  'At least one number, symbol, or whitespace character'
];

export default function Password() {
  const { showLoader, hideLoader } = useLoader();

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string()
        .min(3, 'Must be greater than 3 characters')
        .required('Current Password is Required!'),
      newPassword: Yup.string()
        .min(8, 'Must be at least 8 characters')
        .required('New Password is Required!'),
      confirmNewPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Please confirm your new password'),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      const params = {
        current_password: values.currentPassword,
        new_password: values.newPassword,
      };

      try {
        const res = await updatePassword(params, showLoader, hideLoader);

        // adjust based on your API wrapper
        const success = res?.data?.success ?? res?.success;
        if (success) {
          
          resetForm();
        } else {
          console.log("invalid password")
        }
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong!');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const {
    values,
    errors,
    touched,
    handleSubmit,
    handleChange,
    handleBlur,
    resetForm,
    isSubmitting,
  } = formik;

  return (
    <Card>
      <H6 fontSize={14} p={3}>
        Change Your Password
      </H6>
      <Divider />
      <FormWrapper>
        <Grid container spacing={5}>
          <Grid size={{ sm: 6, xs: 12 }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <TextField
                  fullWidth
                  name="currentPassword"
                  type="password"
                  label="Current Password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.currentPassword}
                  helperText={touched.currentPassword && errors.currentPassword}
                  error={Boolean(touched.currentPassword && errors.currentPassword)}
                />

                <TextField
                  fullWidth
                  name="newPassword"
                  type="password"
                  label="New Password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.newPassword}
                  helperText={touched.newPassword && errors.newPassword}
                  error={Boolean(touched.newPassword && errors.newPassword)}
                />

                <TextField
                  fullWidth
                  name="confirmNewPassword"
                  type="password"
                  label="Confirm New Password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.confirmNewPassword}
                  helperText={touched.confirmNewPassword && errors.confirmNewPassword}
                  error={Boolean(touched.confirmNewPassword && errors.confirmNewPassword)}
                />
              </Stack>

              <Stack direction="row" spacing={2} mt={4}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving…' : 'Save Changes'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => resetForm()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </Stack>
            </form>
          </Grid>

          <Grid size={12}>
            <Paragraph fontWeight={500}>Password requirements:</Paragraph>
            <Small color="grey.500">Ensure that these requirements are met:</Small>
            <Stack spacing={1} mt={2}>
              {REQUIREMENTS.map(item => (
                <FlexBox alignItems="center" gap={1} key={item}>
                  <Dot />
                  <Small>{item}</Small>
                </FlexBox>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </FormWrapper>
    </Card>
  );
}
