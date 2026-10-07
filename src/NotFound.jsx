import { NavLink } from "react-router";
import { Seo } from "./Seo";
import { NOT_FOUND_SEO } from "./seoConfig";

// Unknown URLs: noindex + no canonical so they never compete with real pages in search results.
export function NotFound() {
    return (
        <>
            <Seo {...NOT_FOUND_SEO} path={null} />
            <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", background: "#0B0A08", color: "#F0CC9D", textAlign: "center", padding: "2rem" }}>
                <h1>Page not found</h1>
                <p>The page you are looking for does not exist.</p>
                <NavLink to="/" style={{ color: "#F0CC9D" }}>Back to JUSTZ</NavLink>
            </main>
        </>
    );
}
