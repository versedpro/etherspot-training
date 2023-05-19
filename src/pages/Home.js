import { Box, Button, Container, Stack, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { redirect } from "react-router-dom";
import * as Yup from "yup";

export default function Home() {
  const formik = useFormik({
    initialValues: {
      eventId: "",
      submit: null,
    },
    validationSchema: Yup.object({
      eventId: Yup.number().max(255).required("Please input your desird ID to navigate"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        redirect(`/event/${values.eventId}`);
      } catch (err) {
        console.log(err);
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });
  return (
    <Container>
      <Box
        sx={{
          py: 3,
          width: "100%",
        }}
      >
        <form noValidate onSubmit={formik.handleSubmit}>
          <Typography textAlign="center">Navigate to your event</Typography>
          <Stack spacing={1} sx={{ my: 3, display: "flex", alignItems: "center" }}>
            <TextField
              required
              placeholder="1"
              name="eventId"
              label="Event ID"
              error={!!(formik.touched.eventId && formik.errors.eventId)}
              helperText={formik.touched.eventId && formik.errors.eventId}
              value={formik.values.eventId}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              sx={{ width: "35%" }}
            />
          </Stack>
          {formik.errors.submit && (
            <Typography color="error" sx={{ mt: 3 }} variant="body2">
              {formik.errors.submit}
            </Typography>
          )}
          <Stack spacing={2} sx={{ mb: 3, display: "flex", justifyContent: "center" }} direction="row">
            <Button sx={{ padding: 1, width: "35%" }} type="submit" variant="contained">
              Navigate
            </Button>
          </Stack>
        </form>
      </Box>
    </Container>
  );
}
