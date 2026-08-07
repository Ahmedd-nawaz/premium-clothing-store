/**
 * Cloudinary Configuration
 * Helper functions for Cloudinary image management
 */

import { CldImage, CldOgImage } from "next-cloudinary";

export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo",
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
} as const;

/**
 * Generate Cloudinary image URL with transformations
 */
export function getCloudinaryUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: "fill" | "scale" | "fit" | "thumb" | "crop";
    gravity?: "auto" | "face" | "center" | "north" | "south" | "east" | "west";
    quality?: "auto" | number;
    format?: "auto" | "webp" | "avif" | "jpg" | "png";
    fetchFormat?: "auto" | "webp" | "avif";
    secure?: boolean;
  } = {}
): string {
  const {
    width,
    height,
    crop = "fill",
    gravity = "auto",
    quality = "auto",
    format = "auto",
    fetchFormat = "auto",
    secure = true,
  } = options;

  const transformations: string[] = [];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop) transformations.push(`c_${crop}`);
  if (gravity) transformations.push(`g_${gravity}`);
  if (quality) transformations.push(`q_${quality}`);
  if (format) transformations.push(`f_${format}`);
  if (fetchFormat) transformations.push(`fl_${fetchFormat}`);

  const transformString = transformations.length > 0 ? transformations.join(",") + "/" : "";
  const protocol = secure ? "https" : "http";

  return `${protocol}://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${transformString}${publicId}`;
}

/**
 * Generate responsive image srcset
 */
export function getCloudinarySrcSet(
  publicId: string,
  widths: number[] = [320, 640, 960, 1280, 1920],
  options: {
    height?: number;
    crop?: "fill" | "scale" | "fit" | "thumb" | "crop";
    quality?: "auto" | number;
    format?: "auto" | "webp" | "avif" | "jpg" | "png";
  } = {}
): string {
  return widths
    .map((width) => {
      const url = getCloudinaryUrl(publicId, { ...options, width });
      return `${url} ${width}w`;
    })
    .join(", ");
}

/**
 * Generate Cloudinary upload preset options
 */
export const uploadPresets = {
  product: {
    folder: "ecommerce/products",
    allowedFormats: ["jpg", "jpeg", "png", "webp", "avif"],
    maxFileSize: 10 * 1024 * 1024, // 10MB
    transformation: [
      { width: 2000, height: 2000, crop: "limit", quality: "auto", fetch_format: "auto" },
      { width: 800, height: 800, crop: "fill", gravity: "auto", quality: "auto", fetch_format: "auto" },
    ],
    eager: [
      { width: 400, height: 400, crop: "fill", gravity: "auto", quality: "auto", fetch_format: "auto" },
      { width: 200, height: 200, crop: "fill", gravity: "auto", quality: "auto", fetch_format: "auto" },
    ],
    eagerAsync: true,
  },
  avatar: {
    folder: "ecommerce/avatars",
    allowedFormats: ["jpg", "jpeg", "png", "webp"],
    maxFileSize: 5 * 1024 * 1024, // 5MB
    transformation: [
      { width: 400, height: 400, crop: "fill", gravity: "face", quality: "auto", fetch_format: "auto" },
    ],
  },
  banner: {
    folder: "ecommerce/banners",
    allowedFormats: ["jpg", "jpeg", "png", "webp", "avif"],
    maxFileSize: 15 * 1024 * 1024, // 15MB
    transformation: [
      { width: 2560, height: 1440, crop: "limit", quality: "auto", fetch_format: "auto" },
    ],
  },
  category: {
    folder: "ecommerce/categories",
    allowedFormats: ["jpg", "jpeg", "png", "webp", "avif"],
    maxFileSize: 5 * 1024 * 1024, // 5MB
    transformation: [
      { width: 800, height: 800, crop: "fill", gravity: "auto", quality: "auto", fetch_format: "auto" },
    ],
  },
} as const;

/**
 * Delete image from Cloudinary
 */
export async function deleteCloudinaryImage(publicId: string): Promise<boolean> {
  try {
    const { v2: cloudinary } = await import("cloudinary");

    cloudinary.config({
      cloud_name: cloudinaryConfig.cloudName,
      api_key: cloudinaryConfig.apiKey,
      api_secret: cloudinaryConfig.apiSecret,
    });

    await new Promise<void>((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error: unknown, result: unknown) => {
        if (error) reject(error);
        else resolve();
      });
    });

    return true;
  } catch (error) {
    console.error("Failed to delete Cloudinary image:", error);
    return false;
  }
}

/**
 * Get optimized image props for Next.js Image component
 */
export function getOptimizedImageProps(
  publicId: string,
  width: number,
  height: number,
  options: {
    priority?: boolean;
    alt?: string;
    className?: string;
  } = {}
) {
  const { priority = false, alt = "", className = "" } = options;

  return {
    src: getCloudinaryUrl(publicId, { width, height, crop: "fill", gravity: "auto" }),
    width,
    height,
    alt,
    priority,
    className,
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  };
}

export { CldImage, CldOgImage };