import { api } from "./client";
import { UPLOAD } from "./endpoints";

export async function uploadFileRequest(file) {
  const formData = new FormData();
  formData.append("file", file);
  const data = await api.upload(UPLOAD.FILE, formData);
  return data.data?.url;
}
