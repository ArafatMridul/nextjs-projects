import NavBar from "@/components/NavBar";
import {ReactNode} from "react";


const Layout = ({children} : {children: ReactNode}) => {
    return (
        <>
            <header>
                <NavBar />
            </header>
            <main>
                {children}
            </main>
        </>
    );
};

export default Layout;