export const getPresignedUrl = async (fileName) => {
    const response = await fetch(`http://<YOUR_BACKEND>/upload-url?filename=${fileName}`);
    const { url } = await response.json();
    return url;
  };
  
  export const uploadToS3 = async (presignedUrl, fileUri) => {
    const blob = await fetch(fileUri).then((res) => res.blob());
  
    await fetch(presignedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'audio/wav',
      },
      body: blob,
    });
  };