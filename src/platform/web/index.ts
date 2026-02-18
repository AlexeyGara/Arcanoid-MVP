/*
 * Copyright © 2026 Alexey Gara (alexey.gara@gmail.com). All rights reserved.
 * Project: Arcanoid MVP
 * File: index.ts
 * Path: src/platform/web/
 * Author: alexeygara
 * Last modified: 2026-02-17 23:16
 */

export const EMimeType = {
	// See https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
	// https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=2ahUKEwiUmYyolYPmAhXDwosKHT04CbYQFjAAegQIARAB&url=https%3A%2F%2Fru.wikipedia.org%2Fwiki%2F%25D0%25A1%25D0%25BF%25D0%25B8%25D1%2581%25D0%25BE%25D0%25BA_MIME-%25D1%2582%25D0%25B8%25D0%25BF%25D0%25BE%25D0%25B2&usg=AOvVaw2vIhrhTwDtlahqKDpbULZS
	IMAGE_WEBP: "image/webp",
	IMAGE_PNG: "image/png",
	IMAGE_JPEG: "image/jpeg",
	IMAGE_TIFF: "image/tiff",
	IMAGE_BMP: "image/bmp",
	IMAGE_SVG: "image/svg+xml",

	AUDIO_MP4: "audio/mp4",
	AUDIO_AAC: "audio/aac",
	AUDIO_MP3: "audio/mpeg",
	AUDIO_OGG: "audio/ogg",
	AUDIO_VORBIS: "audio/vorbis",
	AUDIO_WAV: "audio/vnd.wave",
	AUDIO_WEBM: "audio/webm",

	/** Video encoded with H.264 without alpha channel */
	VIDEO_MPEG: "video/mpeg",
	/** Video encoded with H.264 codec (AVC) or AV1 or HEVC (H.265) with alpha channel */
	VIDEO_MP4: "video/mp4",
	/** obsolete format */
	VIDEO_OGG: "video/ogg",
	/** obsolete format */
	VIDEO_QT: "video/quicktime",
	/** WebM + Alpha video format for video textures (vp09.00.10.08 codec) */
	VIDEO_WEBM: "video/webm",
	/** obsolete format */
	VIDEO_WMV: "video/x-ms-wmv",
	/** obsolete format */
	VIDEO_FLV: "video/x-flv",
	/** obsolete format */
	VIDEO_3GPP: "video/3gpp",
	/** obsolete format */
	VIDEO_3GPP2: "video/3gpp2",

	/** Web Open Font Format - container for compressed TTF или OTF */
	FONT_WOFF2: "font/woff2",
	/** obsolete */
	FONT_WOFF: "font/woff",
	/** None-compressed simple font format with 100% support */
	FONT_TTF: "font/ttf",
	/** None-compressed font format with ligatures, 100% supported */
	FONT_OTF: "font/otf",

	TEXT_JS: "text/javascript",
	TEXT_CSS: "text/css",
	/** Comma separated text data */
	TEXT_CSV: "text/csv",
	TEXT_HTML: "text/html",
	TEXT_PLAIN: "text/plain",
	TEXT_XML: "text/xml",

	/** obsolete */
	APPLICATION_JS: "application/javascript",
	APPLICATION_BINARY: "application/octet-stream",
	APPLICATION_OGG: "application/ogg",
	/** obsolete */
	APPLICATION_SWF: "application/x-shockwave-flash",
	APPLICATION_JSON: "application/json",

	MULTIPART_FORMDATA: "multipart/form-data",
	MULTIPART_BYTERANGES: "multipart/byteranges",
} as const;

export type EMimeType = typeof EMimeType[keyof typeof EMimeType];

export type ImageMimeType = typeof EMimeType.IMAGE_WEBP | typeof EMimeType.IMAGE_PNG | typeof EMimeType.IMAGE_JPEG |
							typeof EMimeType.IMAGE_SVG | typeof EMimeType.IMAGE_BMP | typeof EMimeType.IMAGE_TIFF;

export type VideoMimeType = typeof EMimeType.VIDEO_WEBM | typeof EMimeType.VIDEO_MP4 | typeof EMimeType.VIDEO_MPEG |
							typeof EMimeType.VIDEO_FLV | typeof EMimeType.VIDEO_WMV | typeof EMimeType.VIDEO_OGG |
							typeof EMimeType.VIDEO_3GPP | typeof EMimeType.VIDEO_3GPP2 | typeof EMimeType.VIDEO_QT;

export type AudioMimeType = typeof EMimeType.AUDIO_OGG | typeof EMimeType.AUDIO_MP3 | typeof EMimeType.AUDIO_WEBM |
							typeof EMimeType.AUDIO_MP4 | typeof EMimeType.AUDIO_WAV | typeof EMimeType.AUDIO_AAC |
							typeof EMimeType.AUDIO_VORBIS;

export type TextMimeType = typeof EMimeType.TEXT_PLAIN | typeof EMimeType.TEXT_XML | typeof EMimeType.TEXT_HTML |
						   typeof EMimeType.TEXT_CSV;

export type CssTableMimeType = typeof EMimeType.TEXT_CSS;

export type JsonTextMimeType = typeof EMimeType.APPLICATION_JSON;

export type FontMimeType = typeof EMimeType.FONT_WOFF2 | typeof EMimeType.FONT_WOFF | typeof EMimeType.FONT_TTF |
						   typeof EMimeType.FONT_OTF;

export type BinaryMimeType = typeof EMimeType.APPLICATION_BINARY | typeof EMimeType.APPLICATION_OGG;

export type PictureSources = {
	readonly [P in keyof ImageMimeType]:string
};

export type VideoSources = {
	readonly [P in keyof VideoMimeType]:string
};