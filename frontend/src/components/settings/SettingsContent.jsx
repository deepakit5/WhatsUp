// import React from "react";
// import {useSelector} from "react-redux";

// const SettingsContent = () => {
//   const activeTab = useSelector((state) => state.settings.activeTab);

//   const renderContent = () => {
//     switch (activeTab) {
//       case "profile":
//         return <div>Profile Settings</div>;
//       case "privacy":
//         return <div>Privacy Settings</div>;
//       case "notifications":
//         return <div>Notification Settings</div>;
//       case "theme":
//         return <div>Theme Settings</div>;
//       case "help":
//         return <div>Help and Support</div>;
//       default:
//       // return <div>Select a tab</div>;
//     }
//   };

//   return (
//     <div className="p-5 relative overflow-hidden h-full">
//       <div
//         className="absolute inset-0 animate-fade-in opacity-100 transform translate-x-0 transition-all duration-300 bg-blue-300"
//         key={activeTab}>
//         <h2 className="text-xl font-semibold mb-4 capitalize">
//           {activeTab} Settings wer
//         </h2>
//         {renderContent()}
//       </div>
//     </div>
//   );
// };

// export default SettingsContent;
