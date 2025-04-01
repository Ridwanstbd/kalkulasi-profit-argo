import { useEffect } from "react";

function useDocumentHead({ title, description, favicon = null }) {
  useEffect(() => {
    const originalTitle = document.title;
    let originalDescription = null;
    let originalFavicon = null;

    if (title) {
      document.title = title;
    }

    if (description) {
      let metaDescription = document.querySelector("meta[name='description]");
      originalDescription = metaDescription?.getAttribute("content");
      if (!metaDescription) {
        metaDescription = document.createElement("meta");
        metaDescription.setAttribute("name", "description");
        document.head.appendChild(metaDescription);

        metaDescription.setAttribute("content", description);
      }
    }
    if (favicon) {
      const faviconLink = document.querySelector("link[rel='icon]");
      originalFavicon = faviconLink?.getAttribute("href");
      if (!faviconLink) {
        const link = document.createElement("link");
        link.rel = "icon";
        link.href = favicon;
        document.head.appendChild(link);
      } else {
        faviconLink.setAttribute("href", favicon);
      }
    }
    return () => {
      if (title) document.title = originalTitle;
      if (description && originalDescription !== null) {
        const metaDescription = document.querySelector(
          "meta[name='description']"
        );
        if (metaDescription) {
          metaDescription.setAttribute("content", originalDescription);
        }
      }
      if (favicon && originalFavicon !== null) {
        const faviconLink = document.querySelector("link[rel='icon']");
        if (faviconLink) {
          faviconLink.setAttribute("href", originalFavicon);
        }
      }
    };
  }, [title, description, favicon]);
}
export default useDocumentHead;
