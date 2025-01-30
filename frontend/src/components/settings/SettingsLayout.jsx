import React from "react";
import SettingsSidebar from "./SettingsSidebar";
import SettingsContent from "./SettingsContent";

const SettingsLayout = () => {
  return (
    <div className="flex w-full h-full bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-300">
        <SettingsSidebar />
      </div>

      {/* Content */}
      <div className="w-2/3">
        <SettingsContent />
      </div>
    </div>
  );
};

export default SettingsLayout;
