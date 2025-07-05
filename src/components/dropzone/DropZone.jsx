import { useDropzone } from "react-dropzone";
import { useState } from "react";
import { H6, Paragraph } from "@/components/typography";
import UploadOnCloud from "@/icons/UploadOnCloud";
import { RootStyle } from "./styles";

export default function DropZone({ onDrop, accept }) {
  const [error, setError] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: accept ? { [accept]: [] } : {}, // Dynamically set the accepted file types
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        setError(`Please upload only ${accept.split("/")[0]} files.`);
        return;
      }
      setError(null); // Clear any existing error
      onDrop(acceptedFiles); // Pass the accepted files to the parent component
    },
  });

  return (
    <RootStyle {...getRootProps({ className: "dropzone" })}>
      <UploadOnCloud
        sx={{
          fontSize: 38,
          color: "text.secondary",
        }}
      />
      <Paragraph color="text.secondary">Drop your files here or</Paragraph>
      <H6 fontSize={16} color="primary.main">
        Click to browse
      </H6>
      <input {...getInputProps()} placeholder="Click to browse" />

      {/* Display error message */}
      {error && (
        <Paragraph color="error" mt={1}>
          {error}
        </Paragraph>
      )}
    </RootStyle>
  );
}
