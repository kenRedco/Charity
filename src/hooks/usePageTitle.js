import { useEffect } from "react";

/**
 * A custom hook to set the document title for a component.
 * @param {string} title The title to set for the page.
 */
export default function usePageTitle(title) {
  useEffect(() => {
    // Set a default title if none is provided
    const pageTitle = title ? `${title} | CryptoCharity` : "CryptoCharity - Send Crypto Directly";
    document.title = pageTitle;
  }, [title]);
}