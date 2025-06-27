import Header from "@/components/gestion-gym/Header";

export default function GestionGymLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            <div>
                {children}
            </div>
        </>
    );
}