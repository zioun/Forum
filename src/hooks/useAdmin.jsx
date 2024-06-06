import { useContext } from 'react';
import useAxiosPublic from './useAxiosPublic';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../providers/AuthProvider';

const useAdmin = () => {
    const {user, loading} = useContext(AuthContext);
    const axiosSecure = useAxiosPublic();
    const {data: admin, isPending: isAdminLoading} = useQuery({
        queryKey:[user?.email, 'admin'],
        enabled: !loading,
        queryFn: async() =>{
            const res = await axiosSecure.get(`/users/${user.email}`);
            console.log(res.data);
            return res.data?.admin
        }
    })
    return[admin, isAdminLoading]
};

export default useAdmin;