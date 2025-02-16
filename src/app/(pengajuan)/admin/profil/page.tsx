import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import ProfileBox from "@/components/ProfileBox";
import SettingForm from "@/components/SettingBoxes/SettingClone";

const Profile = () => {
  return (
    <div className="mx-auto w-full">
      <Breadcrumb pageName="Profile" />

      <SettingForm />
      {/* <ProfileBox /> */}
    </div>
  );
};

export default Profile;
