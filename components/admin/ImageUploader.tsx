"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type PendingImage = { url: string; uploading: boolean };

export function ImageUploader({ initialImages = [] }: { initialImages?: string[] }) {
  const [images, setImages] = useState<PendingImage[]>(
    initialImages.map((url) => ({ url, uploading: false }))
  );
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function uploadFile(file: File) {
    setError(null);
    const placeholder: PendingImage = { url: URL.createObjectURL(file), uploading: true };
    setImages((prev) => [...prev, placeholder]);

    try {
      const presignResponse = await fetch("/api/uploads/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });
      if (!presignResponse.ok) throw new Error("Could not get an upload URL.");
      const { uploadUrl, publicUrl } = await presignResponse.json();

      // The presigned URL embeds x-amz-acl=public-read as a signed query
      // parameter, but DigitalOcean Spaces only actually grants public-read
      // if the header is also present on the request itself — the query
      // parameter alone is silently ignored. Confirmed by direct testing.
      const putResponse = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type, "x-amz-acl": "public-read" },
        body: file,
      });
      if (!putResponse.ok) throw new Error("Upload to storage failed.");

      setImages((prev) =>
        prev.map((img) => (img.url === placeholder.url ? { url: publicUrl, uploading: false } : img))
      );
    } catch (err) {
      setImages((prev) => prev.filter((img) => img.url !== placeholder.url));
      setError(err instanceof Error ? err.message : "Upload failed.");
    }
  }

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    Array.from(fileList).forEach((file) => uploadFile(file));
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function moveImage(index: number, direction: -1 | 1) {
    setImages((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <div className="image-uploader">
      <label className="image-uploader__dropzone" htmlFor="image-upload-input">
        Click to add photos (the first photo is used as the product&apos;s main image)
      </label>
      <input
        ref={fileInputRef}
        id="image-upload-input"
        type="file"
        accept="image/*"
        multiple
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
        style={{ display: "none" }}
      />
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => fileInputRef.current?.click()}
      >
        Add Photos
      </button>

      {error ? <p className="form-field__error">{error}</p> : null}

      <div className="image-uploader__grid">
        {images.map((image, index) => (
          <div className="image-uploader__thumb" key={image.url}>
            <div className="image-uploader__thumb-image">
              <Image src={image.url} alt="" fill sizes="120px" unoptimized={image.uploading} />
            </div>
            {image.uploading ? (
              <span className="image-uploader__status">Uploading…</span>
            ) : (
              <>
                {!image.uploading && (
                  <input type="hidden" name="images" value={image.url} />
                )}
                <div className="image-uploader__thumb-actions">
                  <button type="button" onClick={() => moveImage(index, -1)} aria-label="Move earlier">
                    ←
                  </button>
                  <button type="button" onClick={() => removeImage(index)} aria-label="Remove image">
                    ✕
                  </button>
                  <button type="button" onClick={() => moveImage(index, 1)} aria-label="Move later">
                    →
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
