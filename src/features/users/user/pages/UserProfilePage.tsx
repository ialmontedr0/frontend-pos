import PageBreadcrum from '../../../../components/common/PageBreadCrumb';
import UserMetaCard from '../components/Profile/UserMetaCard';
import UserInfoCard from '../components/Profile/UserInfoCard';
import UserAddressCard from '../components/Profile/UserAdressCard';
import PageMeta from '../../../../components/common/PageMeta';

export const UserProfilePage: React.FC = () => {
  return (
    <>
      <PageMeta title="Perfil - PoS v2" description="Aplicacion Point of Sale" />
      <PageBreadcrum pageTitle="Perfil" />
      <div className="rounded-2xl mx-1 border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-xl font-medium text-gray-800 dark:text-white/90 lg:mb-7">
          Perfil
        </h3>
        <div className="space-y-6">
          <UserMetaCard />
          <UserInfoCard />
          <UserAddressCard />
        </div>
      </div>
    </>
  );
}
