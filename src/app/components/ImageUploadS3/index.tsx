"use client";

import Image from "next/image";
import React, { useState } from "react";

const ImageUpload = () => {
  const [establishmentId, setEstablishmentId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [presignedUrl, setPresignedUrl] = useState("");
  const GRAPHQL_ENDPOINT = "http://localhost:4000/graphql"; // Update as needed
  const [isLoading, setIsloading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);
  const showMessage = (msg: string, error = false) => {
    setMessage(msg);
    setIsError(error);
  };

  const addMedia = async (reqUrl: string) => {
    const createEstablishmentMedia = {
      query: `
        mutation CreateEstablishmentMedia($media: [EstablishmentMediaInput!]!, $establishmentId: String!) {
  createEstablishmentMedia(media: $media, establishmentId: $establishmentId) {
    categoryDetails {
      category
      ids
    }
    id
    isCoverPhoto
    type
    url
    verificationStatus
  }
}
      `,
      variables: {
        media: [
          {
            category: "ROOMS",
            title: "Award media - 1",
            type: "PHOTO",
            url: reqUrl,
          },
        ],
        establishmentId: "683585b0815c221f85d09fe8",
      },
    };

    const addMediaResponse = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(createEstablishmentMedia),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const presignedData = await addMediaResponse.json();
    if (presignedData.errors) {
      throw new Error(presignedData.errors[0].message);
    }
    const urls = presignedData.data.createEstablishmentMedia;
    console.log({ urls });
    setPreviewUrls(urls);
  };

  const uploadImage = async (file: File, establishmentId: string) => {
    try {
      const createPresignedUrlMutation = {
        query: `
        mutation CreatePresignedUrl($mimeType: String!, $mimeName: String!, $folder: S3Folder!, $category: MediaCategory!, $createPresignedUrlId: String!) {
          createPresignedUrl(mimeType: $mimeType, mimeName: $mimeName, folder: $folder, category: $category, id: $createPresignedUrlId) {
            url
          }
        }
      `,
        variables: {
          mimeType: "png",
          mimeName: file.name,
          folder: "establishment",
          category: "rooms",
          createPresignedUrlId: establishmentId,
        },
      };

      const presignedResponse = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(createPresignedUrlMutation),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const presignedData = await presignedResponse.json();
      if (presignedData.errors) {
        throw new Error(presignedData.errors[0].message);
      }

      const { url } = presignedData.data.createPresignedUrl;
      setPresignedUrl(url);

      const uploadResponse = await fetch(url, {
        method: "PUT",
        body: file,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.log(`Upload failed: ${errorText}`);

        showMessage(`Upload failed: ${errorText}`, true);
        return;
      }

      showMessage("Image uploaded successfully!");

      await addMedia(url.split("?")[0]);
    } catch (error: any) {
      showMessage(`Error: ${error.message}`, true);
    }
  };
  const uploadImagePost = async (file: File, establishmentId: string) => {
    try {
      // Step 1: Create Presigned URL
      const createPresignedUrlMutation = {
        query: `
          mutation CreatePresignedUrlPost($mimeType: String!, $mimeName: String!, $category: String!, $id: String!) {
            createPresignedUrlPost(mimeType: $mimeType, mimeName: $mimeName, category: $category, id: $id) {
              url  
              fields {
                key
                bucket
                policy
                xAmzAlgorithm
                xAmzCredential
                xAmzDate
                xAmzSignature
              }
            }
          }
        `,
        variables: {
          id: establishmentId,
          mimeName: file.name,
          mimeType: file.type,
          category: "rooms",
        },
      };

      const presignedResponse = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(createPresignedUrlMutation),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const presignedData = await presignedResponse.json();
      if (presignedData.errors) {
        throw new Error(presignedData.errors[0].message);
      }

      const { url, fields } = presignedData.data.createPresignedUrlPost;
      setPresignedUrl(url);

      // Step 2: Upload file to S3 using FormData
      const formData = new FormData();
      //   Object.entries(fields).forEach(([key, value]) => {
      //     formData.append(key, value as string);
      //   });

      formData.append("key", fields.key);
      formData.append("bucket", fields.bucket);
      formData.append("policy", fields.policy);
      formData.append("x-amz-algorithm", fields.xAmzAlgorithm);
      formData.append("x-amz-credential", fields.xAmzCredential);
      formData.append("x-amz-date", fields.xAmzDate);
      // formData.append("acl", "public-read");
      formData.append("x-amz-signature", fields.xAmzSignature);
      // formData.append("x-amz-meta-uploaded-by", fields.xAmzMetaUploadedBy);

      formData.append("file", file);
      for (const [key, val] of Object.entries(formData)) {
        console.log(`${key}: ${val}`);
      }

      const uploadResponse = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.log(`Upload failed: ${errorText}`);

        showMessage(`Upload failed: ${errorText}`, true);
        return;
      }

      showMessage("Image uploaded successfully!");
    } catch (error: any) {
      showMessage(`Error: ${error.message}`, true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      showMessage("Please select a file", true);
      return;
    }
    // await addMedia(
    //   "https://practo-dev-mumbai-content-service.s3.ap-south-1.amazonaws.com/establishment/establishment_683585b0815c221f85d09fe8/rooms/2%2520%25281%2529.png-1750837311912?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA27RHETUBAQFOFCHB%2F20250625%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250625T075405Z&X-Amz-Expires=86400&X-Amz-Signature=e3195a248d58b0a885bb3dd6d7d7f405c7695ba59ee42cccc11062b8d15c83ab&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject".split(
    //     "?"
    //   )[0]
    // );
    await uploadImage(file, establishmentId);
  };

  return (
    <div style={styles.container}>
      <h1>Image Upload</h1>
      {message && (
        <div
          style={{
            ...styles.message,
            ...(isError ? styles.error : styles.success),
          }}
        >
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="establishmentId">Establishment ID:</label>
          <input
            type="text"
            id="establishmentId"
            value={establishmentId}
            onChange={(e) => setEstablishmentId(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="fileInput">Select Image:</label>
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.files && e.target.files[0]) {
                setFile(e.target.files[0]);
              }
            }}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>
          Upload Image
        </button>
      </form>
      <div style={styles.grid}>
        {previewUrls.map((url: any, i: number) => (
          <div style={styles.imageWrapper} key={i}>
            <Image
              src={url.url}
              width={400}
              height={225}
              alt=""
              style={{ width: "100%", height: "auto", borderRadius: "8px" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  message: {
    margin: "10px 0",
    padding: "10px",
    borderRadius: "4px",
  },
  success: {
    backgroundColor: "#d4edda",
    color: "#155724",
  },
  error: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
  },
  form: {
    marginTop: "20px",
  },
  formGroup: {
    marginBottom: "15px",
  },
  input: {
    display: "block",
    marginTop: "5px",
    padding: "8px",
    width: "100%",
    boxSizing: "border-box",
  },
  button: {
    padding: "10px 16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "16px",
  },
  imageWrapper: {
    width: "100%",
    overflow: "hidden",
  },
};

export default ImageUpload;
