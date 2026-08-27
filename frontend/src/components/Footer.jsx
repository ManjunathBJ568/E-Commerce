const Footer = () => {
    return (
        <footer style={{ textAlign: "center", padding: "1rem", borderTop: "1px solid #ccc", marginTop: "2rem" }}>
            <p>© {new Date().getFullYear()} MyStore. All rights reserved.</p>
        </footer>
    );
};

export default Footer;