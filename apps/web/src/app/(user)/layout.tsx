import Navbar from "@/components/Home/Navbar"

const UserLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
        
                  <Navbar />
                  {children}
        
        </>
    )
}

export default UserLayout