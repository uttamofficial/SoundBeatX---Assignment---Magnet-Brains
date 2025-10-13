/// <reference types="vite/client" />

// Extend Vite's ImportMetaEnv for our env variables
interface ImportMetaEnv {
	readonly VITE_API_URL?: string;
	readonly VITE_STRIPE_PUBLISHABLE_KEY?: string;
	readonly VITE_CLOUDINARY_CLOUD_NAME?: string;
	readonly VITE_CLOUDINARY_UPLOAD_PRESET?: string;
	readonly VITE_CLERK_PUBLISHABLE_KEY?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
