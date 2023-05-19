import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { Button, Container, Stack, TextField, Typography, Card, Box, IconButton } from "@mui/material";
import { Close, Send, Image } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import * as Yup from "yup";
import { create } from "ipfs-http-client";
import { useSigner } from "wagmi";
import { ethers } from "ethers";

const projectId = process.env.REACT_APP_INFURA_PROJECT_ID;
const projectSecret = process.env.REACT_APP_INFURA_PROJECT_SECRET;
const authorization = "Basic " + btoa(projectId + ":" + projectSecret);

const nft_abi = require("../constants/NFTAbi.json");

const NFTAddress = process.env.REACT_APP_CONTRACT_ADDRESS_CHIADO;

const Mint = () => {
  const { data: signer } = useSigner();

  const fileRef = useRef();
  const [fileUrl, setFileUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      filePath: "",
      submit: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().max(255).required("Asset Name is required"),
      filePathe: Yup.string().max(255).required("Asset path is required"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const tx = {
          gasLimit: "0x55555",
          to: NFTAddress,
          value: 0,
          data: new ethers.utils.Interface(nft_abi).encodeFunctionData("createEvent", [values.name, values.filePath]),
        };
        const txnResp = await signer.sendTransaction(tx);
        await txnResp.wait();
      } catch (err) {
        console.log(err);
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  const ipfs = create({
    url: "https://ipfs.infura.io:5001/api/v0",
    headers: {
      authorization,
    },
  });

  const handleFileSelect = (e) => {
    const pickedFile = e.target.files[0];

    const reader = new FileReader();
    if (pickedFile) {
      setFile(pickedFile);

      reader.readAsDataURL(pickedFile);
      reader.onloadend = function (e) {
        setFileUrl(reader.result);
      };
    }
  };

  const uploadfile = async () => {
    setLoading(true);
    if (file) {
      try {
        // upload files
        const result = await ipfs.add(file);

        formik.setFieldValue("filePath", result.path);
      } catch (e) {
        console.log(e);
        toast.error(e.message);
      }
    }
    setLoading(false);
  };

  const handleResetFile = (e) => {
    e.stopPropagation();
    setFileUrl(null);
    fileRef.current.value = null;
  };

  return (
    <Container>
      <Box
        sx={{
          px: 3,
          width: "100%",
        }}
      >
        <form noValidate onSubmit={formik.handleSubmit}>
          <Stack spacing={1} sx={{ mb: 3 }}>
            <Typography variant="h6">Image, Video, Audio</Typography>
            <Box display="flex" justifyContent="center">
              <div style={{ width: "fit-content" }}>
                <input
                  ref={fileRef}
                  style={{ display: "none" }}
                  accept="image/*"
                  id="contained-button-file"
                  multiple
                  type="file"
                  onChange={handleFileSelect}
                />
                <Card
                  sx={{
                    display: "flex",
                    width: 320,
                    height: 240,
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "auto",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "absolute",
                      inset: "0",
                    }}
                    onClick={() => fileRef.current.click()}
                  >
                    <IconButton
                      aria-label="close"
                      onClick={(e) => handleResetFile(e)}
                      sx={fileUrl ? { position: "absolute", right: "1vw", top: "1vh" } : { display: "none" }}
                    >
                      <Close color="white" />
                    </IconButton>
                  </div>
                  <img
                    src={fileUrl}
                    alt=""
                    style={fileUrl ? { objectFit: "cover", height: "100%", overflow: "hidden" } : { display: "none" }}
                  />
                  <Image fontSize="large" sx={fileUrl ? { display: "none" } : { width: 100, height: 100 }} />
                </Card>
                <Stack sx={{}}>
                  <LoadingButton loading={loading} loadingPosition="start" startIcon={<Send />} onClick={uploadfile}>
                    Upload
                  </LoadingButton>
                </Stack>
              </div>
            </Box>
          </Stack>
          <Stack spacing={1} sx={{ mb: 3, display: "flex", alignItems: "center" }}>
            <TextField
              required
              placeholder="Asset Name"
              name="name"
              label="Asset Name"
              error={!!(formik.touched.name && formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              value={formik.values.name}
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
              Mint NFT
            </Button>
          </Stack>
        </form>
      </Box>
    </Container>
  );
};

export default Mint;
