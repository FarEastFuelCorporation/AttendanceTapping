import React, { useMemo, useEffect } from "react";

const SignatureComponent = ({ signature, style = {} }) => {
  const signatureUrl = useMemo(() => {
    if (signature && signature.data && signature.type) {
      try {
        // Convert signature Blob data to Uint8Array
        const uint8Array = new Uint8Array(signature.data);
        const blob = new Blob([uint8Array], { type: signature.type });
        return URL.createObjectURL(blob);
      } catch (error) {
        console.error("Error creating signature URL from Blob:", error);
        return null;
      }
    } else if (typeof signature === "string" && signature.startsWith("http")) {
      // Signature is a valid external URL
      return signature;
    } else if (typeof signature === "string") {
      // Handle imported image or relative URL
      return signature;
    }

    // Fallback if no valid signature is provided
    return null;
  }, [signature]);

  // Cleanup the Blob URL when the component is unmounted
  useEffect(() => {
    return () => {
      if (signatureUrl && signatureUrl.startsWith("blob:")) {
        URL.revokeObjectURL(signatureUrl);
      }
    };
  }, [signatureUrl]);

  // If there's no valid signature URL, return null (nothing is rendered)
  if (!signatureUrl) {
    return null;
  }

  return (
    <div>
      <img
        src={signatureUrl}
        alt="Signature"
        style={{
          position: "absolute",
          top: "-40px",
          left: "10px",
          width: 120,
          height: 80,
          ...style,
        }} // Merge default styles with optional style
      />
    </div>
  );
};

export default SignatureComponent;
