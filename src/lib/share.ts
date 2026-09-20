"use client";

export interface ShareTarget {
  title: string;
  text?: string;
  url: string;
}

export function buildWhatsappShareUrl({ text, url }: ShareTarget): string {
  const body = `${text ? `${text}\n\n` : ""}${url}`;
  return `https://wa.me/?text=${encodeURIComponent(body)}`;
}

export function buildTelegramShareUrl({ text, url }: ShareTarget): string {
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text || "")}`;
}

export function buildFacebookShareUrl({ url }: ShareTarget): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}

export function buildTwitterShareUrl({ text, url }: ShareTarget): string {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text || "")}&url=${encodeURIComponent(url)}`;
}

export async function nativeShare(target: ShareTarget): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.share) return false;
  try {
    await navigator.share(target);
    return true;
  } catch {
    // user cancelled or share failed — caller falls back to the share menu
    return false;
  }
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to legacy fallback
  }
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export async function copyImageToClipboard(imageUrl: string): Promise<boolean> {
  try {
    if (!navigator.clipboard || !("write" in navigator.clipboard)) return false;
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    // Clipboard image write requires image/png in most browsers.
    const pngBlob = blob.type === "image/png" ? blob : await toPngBlob(blob);
    await navigator.clipboard.write([
      new ClipboardItem({ [pngBlob.type]: pngBlob }),
    ]);
    return true;
  } catch {
    return false;
  }
}

async function toPngBlob(blob: Blob): Promise<Blob> {
  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no canvas context");
  ctx.drawImage(bitmap, 0, 0);
  return new Promise((resolve, reject) => {
    canvas.toBlob((out) => {
      if (out) resolve(out);
      else reject(new Error("toBlob failed"));
    }, "image/png");
  });
}

export function downloadImage(imageUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = imageUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function supportsNativeShare(): boolean {
  return typeof navigator !== "undefined" && !!navigator.share;
}

export function supportsClipboardImage(): boolean {
  return (
    typeof navigator !== "undefined" &&
    !!navigator.clipboard &&
    typeof window !== "undefined" &&
    "ClipboardItem" in window
  );
}
