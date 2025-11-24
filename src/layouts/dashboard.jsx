import { Routes, Route } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import ProtectedRoute from "@/auth/ProtectedRoute";
import NotAuthorized from "@/pages/dashboard/NotAuthorized";


export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;


  const sidebarRoutes = routes.filter(r => r.layout === "dashboard");

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      
      <Sidenav
        routes={sidebarRoutes}   // Εδώ εμφανίζονται *μόνο* τα dashboard pages!
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />

      <div className="p-5 xl:ml-80">
        <DashboardNavbar/>
        <Configurator />

        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>
        
        <Routes>
          <Route path="403" element={<NotAuthorized />} />
          {routes.map(
            ({ layout, pages }) =>
              layout === "dashboard" &&
              pages.map(({ path, element, roles }) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <ProtectedRoute roles={roles}>
                      {element}
                    </ProtectedRoute>
                  }
                />
              ))
          )}
        </Routes>


        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
