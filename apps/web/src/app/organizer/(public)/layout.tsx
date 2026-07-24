import Navbar from "@/components/Home/Navbar";
import Footer from "@/components/Home/Footer";

const OrganizerPublicLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Navbar />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer />
        </>
    );
};

export default OrganizerPublicLayout;
